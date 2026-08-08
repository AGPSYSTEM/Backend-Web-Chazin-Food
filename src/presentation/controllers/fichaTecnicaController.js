const FichaTecnicaService = require('../../application/services/fichaTecnicaService');

const getFichas = async (req, res, next) => {
  try {
    const fichas = await FichaTecnicaService.getAll();
    res.json(fichas);
  } catch (error) {
    next(error);
  }
};

const getFichaById = async (req, res, next) => {
  try {
    const ficha = await FichaTecnicaService.getById(req.params.id);
    res.json(ficha);
  } catch (error) {
    next(error);
  }
};

const getFichaByProducto = async (req, res, next) => {
  try {
    const ficha = await FichaTecnicaService.getByProductoId(req.params.idProducto);
    res.json(ficha || {});
  } catch (error) {
    next(error);
  }
};

const getFichaByInsumo = async (req, res, next) => {
  try {
    const ficha = await FichaTecnicaService.getByInsumoId(req.params.idInsumo);
    res.json(ficha || {});
  } catch (error) {
    next(error);
  }
};

const saveFichaByProducto = async (req, res, next) => {
  try {
    const ficha = await FichaTecnicaService.saveForProducto(req.params.idProducto, req.body);
    res.json(ficha);
  } catch (error) {
    next(error);
  }
};

const saveFichaByInsumo = async (req, res, next) => {
  try {
    const ficha = await FichaTecnicaService.saveForInsumo(req.params.idInsumo, req.body);
    res.json(ficha);
  } catch (error) {
    next(error);
  }
};

const createFicha = async (req, res, next) => {
  try {
    const ficha = await FichaTecnicaService.create(req.body);
    res.status(201).json(ficha);
  } catch (error) {
    next(error);
  }
};

const updateFicha = async (req, res, next) => {
  try {
    const ficha = await FichaTecnicaService.update(req.params.id, req.body);
    res.json(ficha);
  } catch (error) {
    next(error);
  }
};

const deleteFicha = async (req, res, next) => {
  try {
    const result = await FichaTecnicaService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFichas,
  getFichaById,
  getFichaByProducto,
  getFichaByInsumo,
  saveFichaByProducto,
  saveFichaByInsumo,
  createFicha,
  updateFicha,
  deleteFicha
};
