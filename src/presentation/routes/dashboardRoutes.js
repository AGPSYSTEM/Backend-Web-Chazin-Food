const express = require('express');
const router = express.Router();
const { getStats, getVentasChart, getProductosPopulares, getAlertasStock, getVentasRecientes } = require('../controllers/dashboardController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.use(protect, requirePrivilege('Dashboard', 'Ver'));
const { cacheResponse } = require('../../infrastructure/utils/apiCache');
const cacheDashboard = cacheResponse('dashboard', { ttlMs: 20000, cacheControl: 'private, max-age=10' });

router.get('/stats', cacheDashboard, getStats);
router.get('/ventas-chart', cacheDashboard, getVentasChart);
router.get('/productos-populares', cacheDashboard, getProductosPopulares);
router.get('/alertas-stock', cacheDashboard, getAlertasStock);
router.get('/ventas-recientes', cacheDashboard, getVentasRecientes);

module.exports = router;
