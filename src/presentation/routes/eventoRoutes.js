const express = require('express');
const router = express.Router();
const { cacheResponse } = require('../../infrastructure/utils/apiCache');
const cacheEventos = cacheResponse('eventos', { ttlMs: 45000, cacheControl: 'public, max-age=20, stale-while-revalidate=45' });
const EventoController = require('../controllers/eventoController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.get('/', cacheEventos, EventoController.getAll);
router.get('/:id', cacheEventos, EventoController.getById);
router.post('/', protect, requirePrivilege('Productos', 'Crear'), EventoController.create);
router.put('/:id', protect, requirePrivilege('Productos', 'Editar'), EventoController.update);
router.delete('/:id', protect, requirePrivilege('Productos', 'Eliminar'), EventoController.delete);

module.exports = router;
