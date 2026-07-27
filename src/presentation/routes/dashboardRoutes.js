const express = require('express');
const router = express.Router();
const { getStats, getVentasChart, getProductosPopulares } = require('../controllers/dashboardController');

router.get('/stats', getStats);
router.get('/ventas-chart', getVentasChart);
router.get('/productos-populares', getProductosPopulares);

module.exports = router;
