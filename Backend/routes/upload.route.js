const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// Upload avatar (single file)
router.post('/avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({
    message: 'Avatar uploaded successfully!',
    image_url: `${req.protocol}://${req.get('host')}/upload/avatar/${req.file.filename}`
  });
});

// Upload thumbnail (single file)
router.post('/thumbnail', upload.single('thumbnail'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({
    message: 'Thumbnail uploaded successfully!',
    image_url: `${req.protocol}://${req.get('host')}/upload/thumbnails/${req.file.filename}`
  });
});

// Upload multiple images (optional)
router.post('/multiple', upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  res.status(200).json({
    message: 'Images uploaded successfully!',
    files: req.files.map(f => f.path)
  });
});

module.exports = router;
