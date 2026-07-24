const CategoryService = require('../../application/services/categoryService');

const getCategoriasInsumo = async (req, res, next) => {
  try {
    const categorias = await CategoryService.getAllCategories();
    res.json(categorias);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getCategoriaInsumoById = async (req, res, next) => {
  try {
    const categoria = await CategoryService.getCategoryById(req.params.id);
    res.json(categoria);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const createCategoriaInsumo = async (req, res, next) => {
  try {
    const nuevaCategoria = await CategoryService.createCategory(req.body);
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const updateCategoriaInsumo = async (req, res, next) => {
  try {
    const actualizada = await CategoryService.updateCategory(req.params.id, req.body);
    res.json(actualizada);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const deleteCategoriaInsumo = async (req, res, next) => {
  try {
    const result = await CategoryService.deleteCategory(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

module.exports = {
  getCategoriasInsumo,
  getCategoriaInsumoById,
  createCategoriaInsumo,
  updateCategoriaInsumo,
  deleteCategoriaInsumo,
};
