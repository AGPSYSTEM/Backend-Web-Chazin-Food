const express = require('express');
const router = express.Router();
const {
  getProductResenas,
  getRatingsBulk,
  getMiResena,
  createResena,
  updateResena,
  deleteResena
} = require('../controllers/resenaController');
const { protect } = require('../../infrastructure/middlewares/authMiddleware');

// Públicas
router.get('/producto/:idProducto', getProductResenas);
router.get('/ratings', getRatingsBulk); // ?ids=1,2,3

// Protegidas (requieren sesión)
router.get('/mia/:idProducto', protect, getMiResena);
router.post('/', protect, createResena);
router.put('/:id', protect, updateResena);
router.delete('/:id', protect, deleteResena);

module.exports = router;
