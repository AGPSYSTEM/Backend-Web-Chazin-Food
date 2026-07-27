const express = require('express');
const router = express.Router();
const { getCompras, getCompraById, createCompra, updateEstadoCompra, cancelarCompra } = require('../controllers/compraController');

router.route('/')
  .get(getCompras)
  .post(createCompra);

router.route('/:id')
  .get(getCompraById);

router.put('/:id/estado', updateEstadoCompra);
router.put('/:id/cancelar', cancelarCompra);

module.exports = router;
