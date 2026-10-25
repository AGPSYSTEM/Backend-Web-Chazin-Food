const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, optionalProtect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.route('/')
  .get(protect, requirePrivilege(['Gestión de Ventas', 'Gestión de Producción', 'Punto de Venta'], 'Ver'), getOrders)
  .post(optionalProtect, createOrder);

router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/status', protect, requirePrivilege(['Gestión de Ventas', 'Gestión de Producción'], 'Editar'), updateOrderStatus);

module.exports = router;
