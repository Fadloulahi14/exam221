const multer = require('multer');
const ApiError = require('../utils/ApiError');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new ApiError(400, 'Format d\'image non supporté (JPEG, PNG, WEBP, GIF uniquement)'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 32 * 1024 * 1024 },
});

module.exports = upload;
