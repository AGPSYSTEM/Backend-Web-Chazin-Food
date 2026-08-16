const express = require('express');
const router = express.Router();
const { getVentas, getVentasStats, getVentaById, createVenta, updateEstadoVenta, cancelarVenta } = require('../controllers/ventaController');

router.route('/')
  .get(getVentas)
  .post(createVenta);

router.get('/stats', getVentasStats);

router.route('/:id')
  .get(getVentaById);

router.put('/:id/estado', updateEstadoVenta);
router.put('/:id/cancelar', cancelarVenta);

module.exports = router;
