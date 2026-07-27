const express = require('express');
const router = express.Router();
const { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria } = require('../controllers/categoriaProductoController');

router.route('/')
  .get(getCategorias)
  .post(createCategoria);

router.route('/:id')
  .get(getCategoriaById)
  .put(updateCategoria)
  .delete(deleteCategoria);

module.exports = router;
