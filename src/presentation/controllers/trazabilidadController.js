const TrazabilidadService = require('../../application/services/trazabilidadService');

const getMovimientos = async (req, res, next) => {
  try {
    const movimientos = await TrazabilidadService.getAll();
    res.json(movimientos);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const createMovimiento = async (req, res, next) => {
  try {
    const usuarioId = req.user ? (req.user._id || req.user.id) : null;
    const movimiento = await TrazabilidadService.create({
      ...req.body,
      usuarioId
    });
    res.status(201).json(movimiento);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const result = await TrazabilidadService.markAllAsRead();
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const clearAll = async (req, res, next) => {
  try {
    const result = await TrazabilidadService.clearAll();
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

module.exports = {
  getMovimientos,
  createMovimiento,
  markAllAsRead,
  clearAll
};
