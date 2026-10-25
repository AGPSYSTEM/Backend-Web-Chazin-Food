const express = require('express');
const router = express.Router();
const { getRoles, getRoleById, createRole, updateRole, updateRolePermisos, deleteRole } = require('../controllers/roleController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.route('/')
  .get(protect, getRoles)
  .post(protect, requirePrivilege('Roles', 'Crear'), createRole);

router.put('/:id/permisos', protect, requirePrivilege('Roles', 'Editar'), updateRolePermisos);

router.route('/:id')
  .get(protect, getRoleById)
  .put(protect, requirePrivilege('Roles', 'Editar'), updateRole)
  .delete(protect, requirePrivilege('Roles', 'Eliminar'), deleteRole);

module.exports = router;
