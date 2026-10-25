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
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.use(protect);

router.get('/papelera', getInsumosPreparadosPapelera);
router.get('/deleted', getInsumosPreparadosPapelera);

router.route('/')
  .get(getInsumosPreparados)
  .post(requirePrivilege('Insumos', 'Crear'), createInsumoPreparado);

router.route('/:id')
  .get(getInsumoPreparadoById)
  .put(requirePrivilege('Insumos', 'Editar'), updateInsumoPreparado)
  .delete(requirePrivilege('Insumos', 'Eliminar'), deleteInsumoPreparado);

router.put('/:id/restaurar', requirePrivilege('Insumos', 'Editar'), restoreInsumoPreparado);
router.patch('/:id/restaurar', requirePrivilege('Insumos', 'Editar'), restoreInsumoPreparado);
router.put('/:id/restore', requirePrivilege('Insumos', 'Editar'), restoreInsumoPreparado);
router.patch('/:id/restore', requirePrivilege('Insumos', 'Editar'), restoreInsumoPreparado);

router.delete('/:id/fisico', requirePrivilege('Insumos', 'Eliminar'), hardDeleteInsumoPreparado);
router.delete('/:id/permanent', requirePrivilege('Insumos', 'Eliminar'), hardDeleteInsumoPreparado);

module.exports = router;
