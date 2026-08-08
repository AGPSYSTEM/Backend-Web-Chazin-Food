const express = require('express');
const router = express.Router();
const { getCompras, getCompraById, createCompra, updateCompra, updateEstadoCompra, cancelarCompra } = require('../controllers/compraController');

router.route('/')
  .get(getCompras)
  .post(createCompra);

router.route('/:id')
  .get(getCompraById)
  .put(updateCompra);

router.put('/:id/estado', updateEstadoCompra);
router.put('/:id/cancelar', cancelarCompra);

module.exports = router;
