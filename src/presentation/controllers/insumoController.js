const InsumoService = require('../../application/services/insumoService');

const getInsumos = async (req, res, next) => {
  try {
    const insumos = await InsumoService.getAll();
    res.json(insumos);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getInsumosPapelera = async (req, res, next) => {
  try {
    const insumos = await InsumoService.getDeleted();
    res.json(insumos);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getInsumoById = async (req, res, next) => {
  try {
    const insumo = await InsumoService.getById(req.params.id);
    res.json(insumo);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const createInsumo = async (req, res, next) => {
  try {
    const nuevoInsumo = await InsumoService.create(req.body);
    res.status(201).json(nuevoInsumo);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const updateInsumo = async (req, res, next) => {
  try {
    const actualizado = await InsumoService.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const deleteInsumo = async (req, res, next) => {
  try {
    const result = await InsumoService.softDelete(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const restoreInsumo = async (req, res, next) => {
  try {
    const result = await InsumoService.restore(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const hardDeleteInsumo = async (req, res, next) => {
  try {
    const result = await InsumoService.hardDelete(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

module.exports = {
  getInsumos,
  getInsumosPapelera,
  getInsumoById,
  createInsumo,
  updateInsumo,
  deleteInsumo,
  restoreInsumo,
  hardDeleteInsumo,
};
