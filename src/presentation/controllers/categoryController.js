const CategoryService = require('../../application/services/categoryService');

const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await CategoryService.getCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const createdCategory = await CategoryService.createCategory(req.body);
    res.status(201).json(createdCategory);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const updatedCategory = await CategoryService.updateCategory(req.params.id, req.body);
    res.json(updatedCategory);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const result = await CategoryService.deleteCategory(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
