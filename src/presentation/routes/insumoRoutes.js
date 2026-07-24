const express = require('express');
const router = express.Router();
const {
  getInsumos,
  getInsumosPapelera,
  getInsumoById,
  createInsumo,
  updateInsumo,
  deleteInsumo,
  restoreInsumo,
  hardDeleteInsumo,
} = require('../controllers/insumoController');

router.get('/papelera', getInsumosPapelera);
router.get('/deleted', getInsumosPapelera);

router.route('/')
  .get(getInsumos)
  .post(createInsumo);

router.route('/:id')
  .get(getInsumoById)
  .put(updateInsumo)
  .delete(deleteInsumo);

router.put('/:id/restaurar', restoreInsumo);
router.patch('/:id/restaurar', restoreInsumo);
router.put('/:id/restore', restoreInsumo);
router.patch('/:id/restore', restoreInsumo);

router.delete('/:id/fisico', hardDeleteInsumo);
router.delete('/:id/permanent', hardDeleteInsumo);

module.exports = router;
