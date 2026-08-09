const ProduccionService = require('../../application/services/produccionService');

const getOrdenes = async (req, res, next) => {
  try {
    const ordenes = await ProduccionService.getAll();
    res.json(ordenes);
  } catch (error) {
    next(error);
  }
};

const createOrden = async (req, res, next) => {
  try {
    const orden = await ProduccionService.create(req.body);
    res.status(201).json(orden);
  } catch (error) {
    next(error);
  }
};

const updateEstadoOrden = async (req, res, next) => {
  try {
    const orden = await ProduccionService.updateEstado(req.params.id, req.body.estado);
    res.json(orden);
  } catch (error) {
    next(error);
  }
};

const deleteOrden = async (req, res, next) => {
  try {
    const result = await ProduccionService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getOrdenes, createOrden, updateEstadoOrden, deleteOrden };
