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
    const usuarioId = req.user ? (req.user.idUsuario || req.user.id || req.user._id) : (req.body.usuarioId || null);
    const compra = await CompraService.create({
      ...req.body,
      usuarioId
    });
    res.status(201).json(compra);
  } catch (error) {
    next(error);
  }
};

const updateCompra = async (req, res, next) => {
  try {
    const usuarioId = req.user ? (req.user.idUsuario || req.user.id || req.user._id) : (req.body.usuarioId || null);
    const compra = await CompraService.update(req.params.id, {
      ...req.body,
      usuarioId
    });
    res.json(compra);
  } catch (error) {
    next(error);
  }
};

const updateEstadoCompra = async (req, res, next) => {
  try {
    const usuarioId = req.user ? (req.user.idUsuario || req.user.id || req.user._id) : (req.body.usuarioId || null);
    const compra = await CompraService.updateEstado(req.params.id, req.body.estado, { usuarioId });
    res.json(compra);
  } catch (error) {
    next(error);
  }
};

const cancelarCompra = async (req, res, next) => {
  try {
    const usuarioId = req.user ? (req.user.idUsuario || req.user.id || req.user._id) : (req.body.usuarioId || null);
    const motivo = req.body.motivo || req.body.motivoCancelacion || 'Cancelada por el usuario';
    const detallesCancelacion = req.body.detallesCancelacion || null;
    // cantidadesAjuste: array de { idInsumo, cantidadCancelada } para ajuste parcial de stock
    const cantidadesAjuste = req.body.cantidadesAjuste || null;
    const compra = await CompraService.cancelar(req.params.id, {
      motivo,
      detallesCancelacion,
      cantidadesAjuste,
      usuarioId
    });
    res.json(compra);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCompras, getCompraById, createCompra, updateCompra, updateEstadoCompra, cancelarCompra };
