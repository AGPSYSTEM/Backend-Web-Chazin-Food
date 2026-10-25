const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, requirePrivilege('Productos', 'Crear'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, requirePrivilege('Productos', 'Editar'), updateProduct)
  .delete(protect, requirePrivilege('Productos', 'Eliminar'), deleteProduct);

module.exports = router;
