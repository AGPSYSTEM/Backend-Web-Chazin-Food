const express = require('express');
const router = express.Router();
const { getVentas, getVentasStats, getVentaById, createVenta, updateEstadoVenta, updateTiempoEntregaVenta, cancelarVenta, aprobarPagoVenta } = require('../controllers/ventaController');
const { protect, optionalProtect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.route('/')
  .get(protect, getVentas)
  .post(optionalProtect, createVenta);

router.get('/stats', protect, requirePrivilege(['Gestión de Ventas', 'Dashboard'], 'Ver'), getVentasStats);

router.route('/:id')
  .get(protect, getVentaById);

router.put('/:id/estado', protect, requirePrivilege(['Gestión de Ventas', 'Gestión de Producción'], 'Editar'), updateEstadoVenta);
router.put('/:id/aprobar-pago', protect, requirePrivilege('Gestión de Ventas', 'Editar'), aprobarPagoVenta);
router.put('/:id/tiempo-entrega', protect, requirePrivilege(['Gestión de Ventas', 'Gestión de Producción'], 'Editar'), updateTiempoEntregaVenta);
router.put('/:id/cancelar', protect, cancelarVenta);

module.exports = router;
