const { Role, Permiso, RolPermiso, User } = require('../../persistence/models');

class RoleService {
  static async getAllRoles() {
    const roles = await Role.findAll({
      include: [
        { model: Permiso, as: 'permisos', through: { attributes: [] } },
        { model: User }
      ]
    });

    return roles.map(role => {
      const userCount = role.usuarios ? role.usuarios.length : 0;
      const permisos = role.permisos ? role.permisos.map(p => p.nombrePermiso) : [];
      return {
        id: role.idRol,
        nombre: role.nombre,
        descripcion: role.descripcion || '',
        usuarios: userCount,
        permisos,
        estado: role.estado === 1 ? 'Activo' : 'Inactivo'
      };
    });
  }

  static async getRoleById(id) {
    const role = await Role.findByPk(id, {
      include: [
        { model: Permiso, as: 'permisos', through: { attributes: [] } },
        { model: User }
      ]
    });

    if (!role) {
      const error = new Error('Rol no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const userCount = role.usuarios ? role.usuarios.length : 0;
    const permisos = role.permisos ? role.permisos.map(p => p.nombrePermiso) : [];

    return {
      id: role.idRol,
      nombre: role.nombre,
      descripcion: role.descripcion || '',
      usuarios: userCount,
      permisos,
      estado: role.estado === 1 ? 'Activo' : 'Inactivo'
    };
  }

  static async createRole({ nombre, descripcion, permisos }) {
    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre del rol es obligatorio');
      error.statusCode = 400;
      throw error;
    }

    const role = await Role.create({
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : '',
      estado: 1
    });

    if (permisos && Array.isArray(permisos) && permisos.length > 0) {
      for (const permNombre of permisos) {
        let permiso = await Permiso.findOne({ where: { nombrePermiso: permNombre } });
        if (!permiso) {
          permiso = await Permiso.create({ nombrePermiso: permNombre });
        }
        await RolPermiso.create({ idRol: role.idRol, idPermiso: permiso.idPermiso });
      }
    }

    return this.getRoleById(role.idRol);
  }

  static async updateRole(id, { nombre, descripcion, permisos, estado }) {
    const role = await Role.findByPk(id);
    if (!role) {
      const error = new Error('Rol no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (nombre) role.nombre = nombre.trim();
    if (descripcion !== undefined) role.descripcion = descripcion ? descripcion.trim() : '';
    if (estado !== undefined) role.estado = estado === 'Activo' || estado === 1 ? 1 : 0;

    await role.save();

    if (permisos && Array.isArray(permisos)) {
      await RolPermiso.destroy({ where: { idRol: id } });
      for (const permNombre of permisos) {
        let permiso = await Permiso.findOne({ where: { nombrePermiso: permNombre } });
        if (!permiso) {
          permiso = await Permiso.create({ nombrePermiso: permNombre });
        }
        await RolPermiso.create({ idRol: id, idPermiso: permiso.idPermiso });
      }
    }

    return this.getRoleById(id);
  }

  static async deleteRole(id) {
    const role = await Role.findByPk(id);
    if (!role) {
      const error = new Error('Rol no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const userCount = await User.count({ where: { idRol: id } });
    if (userCount > 0) {
      const error = new Error('No se puede eliminar el rol porque está asignado a usuarios');
      error.statusCode = 400;
      throw error;
    }

    await RolPermiso.destroy({ where: { idRol: id } });
    await role.destroy();
    return { message: 'Rol eliminado correctamente' };
  }
}

module.exports = RoleService;
