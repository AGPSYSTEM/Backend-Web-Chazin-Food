const express = require('express');
const router = express.Router();
const { cacheResponse } = require('../../infrastructure/utils/apiCache');
const cacheCatInsumo = cacheResponse('categorias-insumo', { ttlMs: 120000, cacheControl: 'private, max-age=60' });
const { getCategoriasInsumo, getCategoriaInsumoById, createCategoriaInsumo, updateCategoriaInsumo, deleteCategoriaInsumo } = require('../controllers/categoriaInsumoController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.route('/')
  .get(protect, cacheCatInsumo, getCategoriasInsumo)
  .post(protect, requirePrivilege(['Categoría Insumos', 'Insumos', 'Gestión de Compras'], 'Crear'), createCategoriaInsumo);

router.route('/:id')
  .get(protect, cacheCatInsumo, getCategoriaInsumoById)
  .put(protect, requirePrivilege('Categoría Insumos', 'Editar'), updateCategoriaInsumo)
  .delete(protect, requirePrivilege('Categoría Insumos', 'Eliminar'), deleteCategoriaInsumo);

module.exports = router;
