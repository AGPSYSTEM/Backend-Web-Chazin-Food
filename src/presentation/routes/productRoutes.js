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
const { cacheResponse } = require('../../infrastructure/utils/apiCache');

const cacheProductos = cacheResponse('productos', {
  ttlMs: 30000,
  cacheControl: 'public, max-age=15, stale-while-revalidate=30'
});

router.route('/')
  .get(cacheProductos, getProducts)
  .post(protect, requirePrivilege('Productos', 'Crear'), createProduct);

router.route('/:id')
  .get(cacheProductos, getProductById)
  .put(protect, requirePrivilege('Productos', 'Editar'), updateProduct)
  .delete(protect, requirePrivilege('Productos', 'Eliminar'), deleteProduct);

module.exports = router;
