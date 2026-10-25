const express = require('express');
const router = express.Router();
const adicionController = require('../controllers/adicionController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.get('/', adicionController.getAll);
router.get('/:id', adicionController.getById);
router.post('/', protect, requirePrivilege(['Insumos', 'Productos'], 'Crear'), adicionController.create);
router.put('/:id', protect, requirePrivilege(['Insumos', 'Productos'], 'Editar'), adicionController.update);
router.delete('/:id', protect, requirePrivilege(['Insumos', 'Productos'], 'Eliminar'), adicionController.softDelete);

module.exports = router;
