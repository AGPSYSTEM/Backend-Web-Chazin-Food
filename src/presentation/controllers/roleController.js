const RoleService = require('../../application/services/roleService');

const getRoles = async (req, res, next) => {
  try {
    const roles = await RoleService.getAllRoles();
    res.json(roles);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getRoleById = async (req, res, next) => {
  try {
    const role = await RoleService.getRoleById(req.params.id);
    res.json(role);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const createRole = async (req, res, next) => {
  try {
    const newRole = await RoleService.createRole(req.body);
    res.status(201).json(newRole);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const updatedRole = await RoleService.updateRole(req.params.id, req.body);
    res.json(updatedRole);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const result = await RoleService.deleteRole(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const updateRolePermisos = async (req, res, next) => {
  try {
    const updatedRole = await RoleService.updateRole(req.params.id, { permisos: req.body.permisos });
    res.json(updatedRole);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  updateRolePermisos,
  deleteRole,
};
