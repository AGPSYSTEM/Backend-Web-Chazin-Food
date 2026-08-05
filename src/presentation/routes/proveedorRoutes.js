const express = require('express');
const router = express.Router();
const {
  getProveedores,
  getProveedorById,
  getTiposProveedor,
  createProveedor,
  updateProveedor,
  toggleProveedorEstado,
  deleteProveedor,
} = require('../controllers/proveedorController');

router.get('/tipos', getTiposProveedor);

router.route('/')
  .get(getProveedores)
  .post(createProveedor);

router.route('/:id')
  .get(getProveedorById)
  .put(updateProveedor)
  .delete(deleteProveedor);

router.put('/:id/estado', toggleProveedorEstado);
router.patch('/:id/estado', toggleProveedorEstado);

module.exports = router;
