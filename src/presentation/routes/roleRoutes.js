const express = require('express');
const router = express.Router();
const { getRoles, getRoleById, createRole, updateRole, updateRolePermisos, deleteRole } = require('../controllers/roleController');

router.route('/')
  .get(getRoles)
  .post(createRole);

router.put('/:id/permisos', updateRolePermisos);

router.route('/:id')
  .get(getRoleById)
  .put(updateRole)
  .delete(deleteRole);

module.exports = router;
