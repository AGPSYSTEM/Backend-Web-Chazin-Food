const express = require('express');
const router = express.Router();
const {
  getMovimientos,
  createMovimiento,
  markAllAsRead,
  clearAll
} = require('../controllers/trazabilidadController');

router.route('/')
  .get(getMovimientos)
  .post(createMovimiento);

router.put('/read-all', markAllAsRead);
router.delete('/clear', clearAll);

module.exports = router;
