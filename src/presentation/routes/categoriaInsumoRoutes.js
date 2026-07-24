const express = require('express');
const router = express.Router();
const { getCategoriasInsumo, getCategoriaInsumoById, createCategoriaInsumo, updateCategoriaInsumo, deleteCategoriaInsumo } = require('../controllers/categoriaInsumoController');

router.route('/')
  .get(getCategoriasInsumo)
  .post(createCategoriaInsumo);

router.route('/:id')
  .get(getCategoriaInsumoById)
  .put(updateCategoriaInsumo)
  .delete(deleteCategoriaInsumo);

module.exports = router;
