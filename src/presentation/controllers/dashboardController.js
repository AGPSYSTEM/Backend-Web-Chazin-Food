const DashboardService = require('../../application/services/dashboardService');

const getStats = async (req, res, next) => {
  try {
    const stats = await DashboardService.getStats(req.query);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const getVentasChart = async (req, res, next) => {
  try {
    const data = await DashboardService.getVentasChart(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getProductosPopulares = async (req, res, next) => {
  try {
    const data = await DashboardService.getProductosPopulares(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getAlertasStock = async (req, res, next) => {
  try {
    const data = await DashboardService.getAlertasStock(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getVentasRecientes = async (req, res, next) => {
  try {
    const data = await DashboardService.getVentasRecientes(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getVentasChart, getProductosPopulares, getAlertasStock, getVentasRecientes };
