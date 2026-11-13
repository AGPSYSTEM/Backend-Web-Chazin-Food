const express = require('express');
const router = express.Router();
const { cacheResponse } = require('../../infrastructure/utils/apiCache');
const cacheRoles = cacheResponse('roles', { ttlMs: 120000, cacheControl: 'private, max-age=60' });
const { getRoles, getRoleById, createRole, updateRole, updateRolePermisos, deleteRole } = require('../controllers/roleController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.route('/')
  .get(protect, cacheRoles, getRoles)
  .post(protect, requirePrivilege('Roles', 'Crear'), createRole);

router.put('/:id/permisos', protect, requirePrivilege('Roles', 'Editar'), updateRolePermisos);

router.route('/:id')
  .get(protect, cacheRoles, getRoleById)
  .put(protect, requirePrivilege('Roles', 'Editar'), updateRole)
  .delete(protect, requirePrivilege('Roles', 'Eliminar'), deleteRole);

module.exports = router;
