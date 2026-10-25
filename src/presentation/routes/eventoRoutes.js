const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/eventoController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.get('/', EventoController.getAll);
router.get('/:id', EventoController.getById);
router.post('/', protect, requirePrivilege('Productos', 'Crear'), EventoController.create);
router.put('/:id', protect, requirePrivilege('Productos', 'Editar'), EventoController.update);
router.delete('/:id', protect, requirePrivilege('Productos', 'Eliminar'), EventoController.delete);

module.exports = router;
