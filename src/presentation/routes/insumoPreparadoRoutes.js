const express = require('express');
const router = express.Router();
const {
  getInsumosPreparados,
  getInsumosPreparadosPapelera,
  getInsumoPreparadoById,
  createInsumoPreparado,
  updateInsumoPreparado,
  deleteInsumoPreparado,
  restoreInsumoPreparado,
  hardDeleteInsumoPreparado,
} = require('../controllers/insumoPreparadoController');

router.get('/papelera', getInsumosPreparadosPapelera);
router.get('/deleted', getInsumosPreparadosPapelera);

router.route('/')
  .get(getInsumosPreparados)
  .post(createInsumoPreparado);

router.route('/:id')
  .get(getInsumoPreparadoById)
  .put(updateInsumoPreparado)
  .delete(deleteInsumoPreparado);

router.put('/:id/restaurar', restoreInsumoPreparado);
router.patch('/:id/restaurar', restoreInsumoPreparado);
router.put('/:id/restore', restoreInsumoPreparado);
router.patch('/:id/restore', restoreInsumoPreparado);

router.delete('/:id/fisico', hardDeleteInsumoPreparado);
router.delete('/:id/permanent', hardDeleteInsumoPreparado);

module.exports = router;
