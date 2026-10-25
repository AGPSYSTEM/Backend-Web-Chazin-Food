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
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.use(protect);

router.get('/papelera', getInsumosPapelera);
router.get('/deleted', getInsumosPapelera);

router.route('/')
  .get(getInsumos)
  .post(requirePrivilege(['Insumos', 'Gestión de Compras'], 'Crear'), createInsumo);

router.route('/:id')
  .get(getInsumoById)
  .put(requirePrivilege('Insumos', 'Editar'), updateInsumo)
  .delete(requirePrivilege('Insumos', 'Eliminar'), deleteInsumo);

router.put('/:id/restaurar', requirePrivilege('Insumos', 'Editar'), restoreInsumo);
router.patch('/:id/restaurar', requirePrivilege('Insumos', 'Editar'), restoreInsumo);
router.put('/:id/restore', requirePrivilege('Insumos', 'Editar'), restoreInsumo);
router.patch('/:id/restore', requirePrivilege('Insumos', 'Editar'), restoreInsumo);

router.delete('/:id/fisico', requirePrivilege('Insumos', 'Eliminar'), hardDeleteInsumo);
router.delete('/:id/permanent', requirePrivilege('Insumos', 'Eliminar'), hardDeleteInsumo);

module.exports = router;
