const express = require('express');
const router = express.Router();
const upload = require('../../infrastructure/middlewares/uploadMiddleware');
const { deleteImage } = require('../../infrastructure/services/cloudinaryService');

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

router.post('/delete', async (req, res) => {
  try {
    const { url, publicId } = req.body;
    const target = url || publicId;

    if (!target) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere proporcionar "url" o "publicId" para eliminar la imagen'
      });
    }

    const result = await deleteImage(target);
    return res.status(200).json({
      success: true,
      message: 'Operación de eliminación en Cloudinary procesada',
      ...result
    });
  } catch (error) {
    console.error('Error en ruta /upload/delete:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno al procesar la eliminación en Cloudinary',
      error: error.message
    });
  }
});

module.exports = router;

