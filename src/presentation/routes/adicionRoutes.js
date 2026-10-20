const express = require('express');
const router = express.Router();
const adicionController = require('../controllers/adicionController');
const { protect, authorize } = require('../../infrastructure/middlewares/authMiddleware');

router.get('/', adicionController.getAll);
router.get('/:id', adicionController.getById);
router.post('/', protect, authorize('admin', 'administrador'), adicionController.create);
router.put('/:id', protect, authorize('admin', 'administrador'), adicionController.update);
router.delete('/:id', protect, authorize('admin', 'administrador'), adicionController.softDelete);

module.exports = router;
