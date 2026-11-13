const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');
const { cacheResponse } = require('../../infrastructure/utils/apiCache');

const cacheCategories = cacheResponse('categories', {
  ttlMs: 120000,
  cacheControl: 'public, max-age=60, stale-while-revalidate=120'
});

router.route('/')
  .get(cacheCategories, getCategories)
  .post(protect, requirePrivilege(['Categoría Productos', 'Categoría Insumos'], 'Crear'), createCategory);

router.route('/:id')
  .get(cacheCategories, getCategoryById)
  .put(protect, requirePrivilege(['Categoría Productos', 'Categoría Insumos'], 'Editar'), updateCategory)
  .delete(protect, requirePrivilege(['Categoría Productos', 'Categoría Insumos'], 'Eliminar'), deleteCategory);

module.exports = router;
