const express = require('express');
const router = express.Router();
const upload = require('../../infrastructure/middlewares/uploadMiddleware');

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No se subió ninguna imagen' });
  }

  // req.file.path contains the URL to the image on Cloudinary
  res.status(200).json({
    success: true,
    message: 'Imagen subida exitosamente',
    url: req.file.path
  });
});

module.exports = router;
