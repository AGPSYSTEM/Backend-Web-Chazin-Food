const express = require('express');
const router = express.Router();
const { getFichas, getFichaById, createFicha, updateFicha, deleteFicha } = require('../controllers/fichaTecnicaController');

router.route('/')
  .get(getFichas)
  .post(createFicha);

router.route('/:id')
  .get(getFichaById)
  .put(updateFicha)
  .delete(deleteFicha);

module.exports = router;
