const CompraService = require('../../application/services/compraService');

const getCompras = async (req, res, next) => {
  try {
    const compras = await CompraService.getAll();
    res.json(compras);
  } catch (error) {
    next(error);
  }
};

const getCompraById = async (req, res, next) => {
  try {
    const compra = await CompraService.getById(req.params.id);
    res.json(compra);
  } catch (error) {
    next(error);
  }
};

const createCompra = async (req, res, next) => {
  try {
    const compra = await CompraService.create(req.body);
    res.status(201).json(compra);
  } catch (error) {
    next(error);
  }
};

const updateEstadoCompra = async (req, res, next) => {
  try {
    const compra = await CompraService.updateEstado(req.params.id, req.body.estado);
    res.json(compra);
  } catch (error) {
    next(error);
  }
};

const cancelarCompra = async (req, res, next) => {
  try {
    const compra = await CompraService.cancelar(req.params.id);
    res.json(compra);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCompras, getCompraById, createCompra, updateEstadoCompra, cancelarCompra };
