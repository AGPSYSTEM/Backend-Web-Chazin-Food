const express = require('express');
const router = express.Router();
const {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  toggleProveedorEstado,
  deleteProveedor,
  restoreProveedor,
  deletePermanenteProveedor,
} = require('../controllers/proveedorController');
const {
  validateCreateProveedor,
  validateUpdateProveedor,
} = require('../../infrastructure/middlewares/proveedorValidation');

router.route('/')
  .get(getProveedores)
  .post(validateCreateProveedor, createProveedor);

router.route('/:id')
  .get(getProveedorById)
  .put(validateUpdateProveedor, updateProveedor)
  .delete(deleteProveedor);

router.put('/:id/estado', toggleProveedorEstado);
router.patch('/:id/estado', toggleProveedorEstado);
router.put('/:id/restaurar', restoreProveedor);
router.delete('/:id/permanente', deletePermanenteProveedor);

module.exports = router;
