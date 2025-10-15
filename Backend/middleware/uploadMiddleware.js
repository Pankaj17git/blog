const multer = require('multer');
const path = require('path');

// Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadFolder = 'upload/default';

    if (file.fieldname === 'avatar') {
      uploadFolder = 'upload/avatar';
    } else if (file.fieldname === 'thumbnail') {
      uploadFolder = 'upload/thumbnails';
    }

    cb(null, uploadFolder);
  },

  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = upload;
