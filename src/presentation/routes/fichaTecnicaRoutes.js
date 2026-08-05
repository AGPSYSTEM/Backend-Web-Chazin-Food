const express = require('express');
const router = express.Router();
const {
  getFichas,
  getFichaById,
  getFichaByProducto,
  getFichaByInsumo,
  saveFichaByProducto,
  saveFichaByInsumo,
  createFicha,
  updateFicha,
  deleteFicha
} = require('../controllers/fichaTecnicaController');

router.route('/')
  .get(getFichas)
  .post(createFicha);

router.route('/producto/:idProducto')
  .get(getFichaByProducto)
  .put(saveFichaByProducto)
  .post(saveFichaByProducto);

router.route('/insumo/:idInsumo')
  .get(getFichaByInsumo)
  .put(saveFichaByInsumo)
  .post(saveFichaByInsumo);

router.route('/:id')
  .get(getFichaById)
  .put(updateFicha)
  .delete(deleteFicha);

module.exports = router;
