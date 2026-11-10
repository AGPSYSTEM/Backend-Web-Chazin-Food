const express = require('express');
const router = express.Router();
const {
  getDevoluciones,
  getDevolucionesStats,
  getPoliticas,
  checkVentaElegibilidad,
  getMisDevoluciones,
  getDevolucionById,
  createDevolucion,
  updateEstadoDevolucion
} = require('../controllers/devolucionController');
const { protect, optionalProtect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

// Consulta pública de políticas de devolución
router.get('/politicas', getPoliticas);

// Verificación de elegibilidad de una venta (para modal de devolución de cliente o cajero)
router.get('/elegibilidad/:idVenta', optionalProtect, checkVentaElegibilidad);

// Rutas autenticadas
router.use(protect);

// Devoluciones del usuario cliente en sesión
router.get('/mis-devoluciones', getMisDevoluciones);

// Estadísticas para tarjetas KPI del módulo administrativo
router.get('/stats', requirePrivilege(['Devoluciones', 'Gestión de Ventas', 'Ventas', 'Dashboard'], 'Ver'), getDevolucionesStats);

// Listar devoluciones y registrar nueva solicitud
router.route('/')
  .get(requirePrivilege(['Devoluciones', 'Gestión de Ventas', 'Ventas'], 'Ver'), getDevoluciones)
  .post(createDevolucion); // Clientes y Administradores pueden crear solicitudes de devolución

// Detalle de devolución
router.route('/:id')
  .get(requirePrivilege(['Devoluciones', 'Gestión de Ventas', 'Ventas'], 'Ver'), getDevolucionById);

// Gestión y resolución de devolución (Aprobar, Rechazar, Completar)
router.put('/:id/estado', requirePrivilege(['Devoluciones', 'Gestión de Ventas', 'Ventas'], 'Editar'), updateEstadoDevolucion);

module.exports = router;

