const DevolucionService = require('../../application/services/devolucionService');

const getDevoluciones = async (req, res, next) => {
  try {
    const filters = {
      estado: req.query.estado,
      motivo: req.query.motivo,
      tipoResolucion: req.query.tipoResolucion,
      idCliente: req.query.idCliente,
      idVenta: req.query.idVenta
    };
    const devoluciones = await DevolucionService.getAll(filters);
    res.json(devoluciones);
  } catch (error) {
    console.error('[devolucionController.getDevoluciones] Error:', error);
    next(error);
  }
};

const getDevolucionesStats = async (req, res, next) => {
  try {
    const stats = await DevolucionService.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const getPoliticas = async (req, res, next) => {
  try {
    const politicas = DevolucionService.getPolicies();
    res.json(politicas);
  } catch (error) {
    next(error);
  }
};

const checkVentaElegibilidad = async (req, res, next) => {
  try {
    const { idVenta } = req.params;
    const result = await DevolucionService.checkVentaElegibilidad(idVenta);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getMisDevoluciones = async (req, res, next) => {
  try {
    const idUsuario = req.user?.idUsuario || req.user?.id;
    const idCliente = req.query.idCliente || null;
    const devoluciones = await DevolucionService.getByCliente(idCliente, idUsuario);
    res.json(devoluciones);
  } catch (error) {
    next(error);
  }
};

const getDevolucionById = async (req, res, next) => {
  try {
    const devolucion = await DevolucionService.getById(req.params.id);
    if (!devolucion) {
      return res.status(404).json({ message: 'Devolución no encontrada' });
    }
    res.json(devolucion);
  } catch (error) {
    next(error);
  }
};

const createDevolucion = async (req, res, next) => {
  try {
    const devolucion = await DevolucionService.create(req.body, req.user);
    res.status(201).json(devolucion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEstadoDevolucion = async (req, res, next) => {
  try {
    const devolucion = await DevolucionService.updateEstado(req.params.id, req.body, req.user);
    res.json(devolucion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDevoluciones,
  getDevolucionesStats,
  getPoliticas,
  checkVentaElegibilidad,
  getMisDevoluciones,
  getDevolucionById,
  createDevolucion,
  updateEstadoDevolucion
};

