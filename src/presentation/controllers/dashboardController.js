const DashboardService = require('../../application/services/dashboardService');

const getStats = async (req, res, next) => {
  try {
    const stats = await DashboardService.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const getVentasChart = async (req, res, next) => {
  try {
    const data = await DashboardService.getVentasChart();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getProductosPopulares = async (req, res, next) => {
  try {
    const data = await DashboardService.getProductosPopulares();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getAlertasStock = async (req, res, next) => {
  try {
    const data = await DashboardService.getAlertasStock();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getVentasRecientes = async (req, res, next) => {
  try {
    const data = await DashboardService.getVentasRecientes();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getVentasChart, getProductosPopulares, getAlertasStock, getVentasRecientes };
