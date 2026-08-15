const CategoriaProductoService = require('../../application/services/categoriaProductoService');

const getCategorias = async (req, res, next) => {
  try {
    const categorias = await CategoriaProductoService.getAll();
    res.json(categorias);
  } catch (error) {
    next(error);
  }
};

const getCategoriaById = async (req, res, next) => {
  try {
    const categoria = await CategoriaProductoService.getById(req.params.id);
    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

const createCategoria = async (req, res, next) => {
  try {
    const categoria = await CategoriaProductoService.create(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    next(error);
  }
};

const updateCategoria = async (req, res, next) => {
  try {
    const categoria = await CategoriaProductoService.update(req.params.id, req.body);
    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

const deleteCategoria = async (req, res, next) => {
  try {
    const result = await CategoriaProductoService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria };

