//multer
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  // reject
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 500,
  },
  fileFilter,
});

module.exports = upload;
