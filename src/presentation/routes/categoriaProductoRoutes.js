const express = require('express');
const router = express.Router();
const { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria } = require('../controllers/categoriaProductoController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');
const { cacheResponse } = require('../../infrastructure/utils/apiCache');

const cacheCategorias = cacheResponse('categorias', {
  ttlMs: 120000,
  cacheControl: 'public, max-age=60, stale-while-revalidate=120'
});

router.route('/')
  .get(cacheCategorias, getCategorias)
  .post(protect, requirePrivilege(['Categoría Productos', 'Productos'], 'Crear'), createCategoria);

router.route('/:id')
  .get(cacheCategorias, getCategoriaById)
  .put(protect, requirePrivilege('Categoría Productos', 'Editar'), updateCategoria)
  .delete(protect, requirePrivilege('Categoría Productos', 'Eliminar'), deleteCategoria);

module.exports = router;
