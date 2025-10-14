// controllers/postController.js
const { validationResult } = require('express-validator');
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const slugify = require('slugify'); 

// Helper to create unique slug
async function makeUniqueSlug(title, postId = null) {
  let base = slugify(title, { lower: true, strict: true }).slice(0, 200) || 'post';
  let slug = base;
  let i = 0;
  while (true) {
    const found = await Post.findOne({ slug, ...(postId ? { _id: { $ne: postId } } : {}) });
    if (!found) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

// CREATE post (authors + admin)
exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, content, tags = [], category, excerpt, thumbnailUrl, isPublished } = req.body;
    // only authors or admins can create (middleware should ensure)
    const slug = await makeUniqueSlug(title);
    const post = new Post({
      title, content, tags, category, excerpt, thumbnailUrl,
      slug, author: req.user._id,
      isPublished: !!isPublished,
      publishedAt: isPublished ? new Date() : null
    });
    await post.save();
    
    const populated = await post.populate('author', 'username email role');
    return res.status(201).json({ post: populated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET posts (with pagination, filters, search)
exports.getPosts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(50, parseInt(req.query.limit || '10'));
    const skip = (page - 1) * limit;

    const { tag, category, author, q, published } = req.query;
    const filter = {};
    if (tag) filter.tags = tag.toLowerCase();
    if (category) filter.category = category;
    if (author) filter.author = author;
    if (published === 'true') filter.isPublished = true;
    if (q) filter.$text = { $search: q };

    // count and query
    const [total, posts] = await Promise.all([
      Post.countDocuments(filter),
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'username role')
        .select('-comments') // don't send comments in list; get them on single post endpoint
    ]);
    return res.json({
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
      posts
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET single post (increment views optionally)
exports.getPost = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };
    const post = await Post.findOne(query)
      .populate('author', 'username role')
      .populate('comments.author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    // increment views (non-blocking)
    post.views = (post.views || 0) + 1;
    await post.save();
    return res.json({ post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE post (author or admin)
exports.updatePost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // ownership check: either post.author == req.user._id or req.user.role === 'admin'
    if (!post.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updatable = ['title', 'content', 'tags', 'category', 'excerpt', 'thumbnailUrl', 'isPublished'];
    updatable.forEach(field => {
      if (req.body[field] !== undefined) post[field] = req.body[field];
    });

    // if title changed, update slug
    if (req.body.title && req.body.title !== post.title) {
      post.slug = await makeUniqueSlug(req.body.title, post._id);
    }

    if (post.isPublished && !post.publishedAt) post.publishedAt = new Date();
    if (!post.isPublished) post.publishedAt = null;

    await post.save();
    const populated = await post.populate('author', 'username role');
    return res.json({ post: populated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE post (author or admin)
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!post.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Post.findByIdAndDelete(id);
    return res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// LIKE toggle
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const idx = post.likes.findIndex(l => l.equals(userId));
    if (idx === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(idx, 1);
    }
    await post.save();
    return res.json({ likesCount: post.likes.length, liked: idx === -1 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// COMMENTS
exports.addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      author: req.user._id,
      text: req.body.text
    };
    post.comments.push(comment);
    await post.save();
    const added = post.comments[post.comments.length - 1];
    await post.populate('comments.author', 'username'); // populate latest
    return res.status(201).json({ comment: added });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // only comment author or admin can delete
    if (!comment.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
 
    post.comments = post.comments.filter((comment) => comment._id.toString() !== commentId.toString());
    
    await post.save();
    return res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
