const InsumoPreparadoService = require('../../application/services/insumoPreparadoService');

const getInsumosPreparados = async (req, res, next) => {
  try {
    const data = await InsumoPreparadoService.getAll();
    res.json(data);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getInsumosPreparadosPapelera = async (req, res, next) => {
  try {
    const data = await InsumoPreparadoService.getDeleted();
    res.json(data);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getInsumoPreparadoById = async (req, res, next) => {
  try {
    const data = await InsumoPreparadoService.getById(req.params.id);
    res.json(data);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const createInsumoPreparado = async (req, res, next) => {
  try {
    const nuevo = await InsumoPreparadoService.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const updateInsumoPreparado = async (req, res, next) => {
  try {
    const actualizado = await InsumoPreparadoService.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const deleteInsumoPreparado = async (req, res, next) => {
  try {
    const result = await InsumoPreparadoService.softDelete(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const restoreInsumoPreparado = async (req, res, next) => {
  try {
    const result = await InsumoPreparadoService.restore(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const hardDeleteInsumoPreparado = async (req, res, next) => {
  try {
    const result = await InsumoPreparadoService.hardDelete(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

module.exports = {
  getInsumosPreparados,
  getInsumosPreparadosPapelera,
  getInsumoPreparadoById,
  createInsumoPreparado,
  updateInsumoPreparado,
  deleteInsumoPreparado,
  restoreInsumoPreparado,
  hardDeleteInsumoPreparado,
};
