// models/Post.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title too long']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  excerpt: {
    type: String,
    maxlength: 500
  },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tags: [{ type: String, lowercase: true, trim: true }],
  category: { type: String, trim: true, index: true },
  thumbnailUrl: { 
    type: String,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // array of user ids
  comments: [CommentSchema],
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date }
}, {
  timestamps: true
});

// Text index for search (title + content)
PostSchema.index({ title: 'text', content: 'text', tags: 'text', category: 'text' });

// Ensure unique slug generation handled in controller
module.exports = mongoose.model('Post', PostSchema);
