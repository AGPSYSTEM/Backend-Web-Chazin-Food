const express = require('express');
const router = express.Router();
const {
  getMovimientos,
  getUnreadCount,
  createMovimiento,
  markAllAsRead,
  clearAll
} = require('../controllers/trazabilidadController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getMovimientos)
  .post(createMovimiento);

router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.delete('/clear', requirePrivilege('Insumos', 'Eliminar'), clearAll);

module.exports = router;

