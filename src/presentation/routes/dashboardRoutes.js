const express = require('express');
const router = express.Router();
const { getStats, getVentasChart, getProductosPopulares, getAlertasStock, getVentasRecientes } = require('../controllers/dashboardController');

router.get('/stats', getStats);
router.get('/ventas-chart', getVentasChart);
router.get('/productos-populares', getProductosPopulares);
router.get('/alertas-stock', getAlertasStock);
router.get('/ventas-recientes', getVentasRecientes);

module.exports = router;
