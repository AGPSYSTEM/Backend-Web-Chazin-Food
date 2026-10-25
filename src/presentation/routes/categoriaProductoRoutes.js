const express = require('express');
const router = express.Router();
const { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria } = require('../controllers/categoriaProductoController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.route('/')
  .get(getCategorias)
  .post(protect, requirePrivilege(['Categoría Productos', 'Productos'], 'Crear'), createCategoria);

router.route('/:id')
  .get(getCategoriaById)
  .put(protect, requirePrivilege('Categoría Productos', 'Editar'), updateCategoria)
  .delete(protect, requirePrivilege('Categoría Productos', 'Eliminar'), deleteCategoria);

module.exports = router;
