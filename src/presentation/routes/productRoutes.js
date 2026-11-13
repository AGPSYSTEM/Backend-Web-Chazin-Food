const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductsPapelera,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  hardDeleteProduct,
} = require('../controllers/productController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.get('/papelera', protect, getProductsPapelera);
router.get('/deleted', protect, getProductsPapelera);

router.route('/')
  .get(getProducts)
  .post(protect, requirePrivilege('Productos', 'Crear'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, requirePrivilege('Productos', 'Editar'), updateProduct)
  .delete(protect, requirePrivilege('Productos', 'Eliminar'), deleteProduct);

router.put('/:id/restaurar', protect, requirePrivilege('Productos', 'Editar'), restoreProduct);
router.patch('/:id/restaurar', protect, requirePrivilege('Productos', 'Editar'), restoreProduct);
router.put('/:id/restore', protect, requirePrivilege('Productos', 'Editar'), restoreProduct);
router.patch('/:id/restore', protect, requirePrivilege('Productos', 'Editar'), restoreProduct);

router.delete('/:id/fisico', protect, requirePrivilege('Productos', 'Eliminar'), hardDeleteProduct);
router.delete('/:id/permanent', protect, requirePrivilege('Productos', 'Eliminar'), hardDeleteProduct);

module.exports = router;
