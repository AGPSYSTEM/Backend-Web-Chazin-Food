const express = require('express');
const router = express.Router();
const { getVentas, getVentaById, createVenta, updateEstadoVenta, cancelarVenta } = require('../controllers/ventaController');

router.route('/')
  .get(getVentas)
  .post(createVenta);

router.route('/:id')
  .get(getVentaById);

router.put('/:id/estado', updateEstadoVenta);
router.put('/:id/cancelar', cancelarVenta);

module.exports = router;
