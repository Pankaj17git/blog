// routes/posts.js
const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const postCtrl = require('../controllers/postController.controller');
const { authenticate, roleCheck } = require('../middleware/auth');

// Create post (authors or admin)
router.post('/',
  authenticate,
  roleCheck('author', 'admin'), // only authors/admins can create
  [
    body('title').isLength({ min: 3 }).withMessage('Title min 3 chars'),
    body('content').isLength({ min: 10 }).withMessage('Content min 10 chars'),
    body('tags').optional().isArray(),
    body('thumbnailUrl').optional(),
    body('isPublished').optional().isBoolean()
  ],
  postCtrl.createPost
);

// List posts
router.get('/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('q').optional().isString()
  ],
  postCtrl.getPosts
);

// Single post by id or slug
router.get('/:idOrSlug', postCtrl.getPost);

// Update post
router.put('/:id',
  authenticate,
  [
    param('id').isMongoId(),
    body('title').optional().isLength({ min: 3 }),
    body('content').optional().isLength({ min: 10 }),
    body('tags').optional().isArray(),
    body('thumbnailUrl').optional().isURL()
  ],
  postCtrl.updatePost
);

// Delete post
router.delete('/:id',
  authenticate,
  param('id').isMongoId(),
  postCtrl.deletePost
);

// Like toggle
router.patch('/:id/like',
  authenticate,
  param('id').isMongoId(),
  postCtrl.toggleLike
);

// Comments
router.post('/:id/comments',
  authenticate,
  [
    param('id').isMongoId(),
    body('text').isLength({ min: 1, max: 2000 }).withMessage('Comment text 1-2000 chars')
  ],
  postCtrl.addComment
);

router.delete('/:postId/comments/:commentId',
  authenticate,
  [
    param('postId').isMongoId(),
    param('commentId').isMongoId()
  ],
  postCtrl.deleteComment
);

module.exports = router;
