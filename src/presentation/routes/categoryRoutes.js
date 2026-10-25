const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(protect, requirePrivilege(['Categoría Productos', 'Categoría Insumos'], 'Crear'), createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, requirePrivilege(['Categoría Productos', 'Categoría Insumos'], 'Editar'), updateCategory)
  .delete(protect, requirePrivilege(['Categoría Productos', 'Categoría Insumos'], 'Eliminar'), deleteCategory);

module.exports = router;
