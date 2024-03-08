const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter:function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); 
    } else {
      cb(new Error('File type not supported')); 
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5, 
  },
});

module.exports = { upload };

