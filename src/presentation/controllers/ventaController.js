const VentaService = require('../../application/services/ventaService');

const getVentas = async (req, res, next) => {
  try {
    const ventas = await VentaService.getAll();
    res.json(ventas);
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

module.exports = { getVentas, getVentaById, createVenta, updateEstadoVenta, cancelarVenta };
