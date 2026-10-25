const express = require('express');
const router = express.Router();
const {
  getFichas,
  getFichaById,
  getFichaByProducto,
  getFichaByInsumo,
  getFichaByInsumoPreparado,
  saveFichaByProducto,
  saveFichaByInsumo,
  saveFichaByInsumoPreparado,
  createFicha,
  updateFicha,
  deleteFicha
} = require('../controllers/fichaTecnicaController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.route('/')
  .get(getFichas)
  .post(protect, requirePrivilege(['Productos', 'Insumos', 'Fichas Técnicas'], 'Crear'), createFicha);

router.route('/producto/:idProducto')
  .get(getFichaByProducto)
  .put(protect, requirePrivilege(['Productos', 'Fichas Técnicas'], 'Editar'), saveFichaByProducto)
  .post(protect, requirePrivilege(['Productos', 'Fichas Técnicas'], 'Crear'), saveFichaByProducto);

router.route('/insumo-preparado/:idInsumoPreparado')
  .get(getFichaByInsumoPreparado)
  .put(protect, requirePrivilege(['Insumos', 'Fichas Técnicas'], 'Editar'), saveFichaByInsumoPreparado)
  .post(protect, requirePrivilege(['Insumos', 'Fichas Técnicas'], 'Crear'), saveFichaByInsumoPreparado);

router.route('/insumo/:idInsumo')
  .get(getFichaByInsumo)
  .put(protect, requirePrivilege(['Insumos', 'Fichas Técnicas'], 'Editar'), saveFichaByInsumo)
  .post(protect, requirePrivilege(['Insumos', 'Fichas Técnicas'], 'Crear'), saveFichaByInsumo);

router.route('/:id')
  .get(getFichaById)
  .put(protect, requirePrivilege(['Productos', 'Insumos', 'Fichas Técnicas'], 'Editar'), updateFicha)
  .delete(protect, requirePrivilege(['Productos', 'Insumos', 'Fichas Técnicas'], 'Eliminar'), deleteFicha);

module.exports = router;

