const VentaService = require('../../application/services/ventaService');

const getVentas = async (req, res, next) => {
  try {
    const filter = {
      periodo: req.query.periodo,
      estado: req.query.estado,
      search: req.query.search
    };
    const ventas = await VentaService.getAll(filter);
    res.json(ventas);
  } catch (error) {
    next(error);
  }
};

const getVentasStats = async (req, res, next) => {
  try {
    const filter = {
      periodo: req.query.periodo,
      estado: req.query.estado
    };
    const stats = await VentaService.getStats(filter);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const getVentaById = async (req, res, next) => {
  try {
    const venta = await VentaService.getById(req.params.id);
    res.json(venta);
  } catch (error) {
    next(error);
  }
};

const createVenta = async (req, res, next) => {
  try {
    const venta = await VentaService.create(req.body);
    res.status(201).json(venta);
  } catch (error) {
    next(error);
  }
};

const updateEstadoVenta = async (req, res, next) => {
  try {
    const venta = await VentaService.updateEstado(req.params.id, req.body.estado);
    res.json(venta);
  } catch (error) {
    next(error);
  }
};

const cancelarVenta = async (req, res, next) => {
  try {
    const venta = await VentaService.cancelar(req.params.id);
    res.json(venta);
  } catch (error) {
    next(error);
  }
};

module.exports = { getVentas, getVentasStats, getVentaById, createVenta, updateEstadoVenta, cancelarVenta };
