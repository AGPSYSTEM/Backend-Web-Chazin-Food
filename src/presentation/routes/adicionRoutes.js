const express = require('express');
const router = express.Router();
const { cacheResponse } = require('../../infrastructure/utils/apiCache');
const cacheAdiciones = cacheResponse('adiciones', { ttlMs: 60000, cacheControl: 'public, max-age=30, stale-while-revalidate=60' });
const adicionController = require('../controllers/adicionController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.get('/', cacheAdiciones, adicionController.getAll);
router.get('/:id', cacheAdiciones, adicionController.getById);
router.post('/', protect, requirePrivilege(['Insumos', 'Productos'], 'Crear'), adicionController.create);
router.put('/:id', protect, requirePrivilege(['Insumos', 'Productos'], 'Editar'), adicionController.update);
router.delete('/:id', protect, requirePrivilege(['Insumos', 'Productos'], 'Eliminar'), adicionController.softDelete);

module.exports = router;
