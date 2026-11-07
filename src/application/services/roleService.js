const { Role, Permiso, RolPermiso, User } = require('../../persistence/models');

class RoleService {
  static async getAllRoles() {
    const roles = await Role.findAll({
      include: [
        { model: Permiso, as: 'permisos', through: { attributes: [] } },
        { model: User, attributes: ['idUsuario'] }
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
        { model: User, attributes: ['idUsuario'] }
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

    const cleanNombre = nombre.trim();
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,50}$/.test(cleanNombre)) {
      const error = new Error('El nombre del rol solo puede contener letras y espacios (sin puntos, números, guiones ni caracteres especiales como @ o -)');
      error.statusCode = 400;
      throw error;
    }

    if (!Array.isArray(permisos) || permisos.filter(Boolean).length === 0) {
      const error = new Error('Debes asignar al menos un permiso o privilegio al rol');
      error.statusCode = 400;
      throw error;
    }

    const cleanPermisos = permisos.filter(Boolean);

    const role = await Role.create({
      nombre: cleanNombre,
      descripcion: descripcion ? descripcion.trim() : '',
      estado: 1
    });

    // Optimización masiva de permisos en lote (reduce de N consultas a 2)
    const existingPermisos = await Permiso.findAll({
      where: { nombrePermiso: cleanPermisos }
    });
    const existingMap = new Map(existingPermisos.map(p => [p.nombrePermiso, p.idPermiso]));

    const missingPermNames = cleanPermisos.filter(pName => !existingMap.has(pName));
    if (missingPermNames.length > 0) {
      const createdPerms = await Permiso.bulkCreate(
        missingPermNames.map(pName => ({ nombrePermiso: pName }))
      );
      createdPerms.forEach(p => existingMap.set(p.nombrePermiso, p.idPermiso));
    }

    const rolPermisoRecords = cleanPermisos
      .map(pName => {
        const idPermiso = existingMap.get(pName);
        return idPermiso ? { idRol: role.idRol, idPermiso } : null;
      })
      .filter(Boolean);

    if (rolPermisoRecords.length > 0) {
      await RolPermiso.bulkCreate(rolPermisoRecords);
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

    if (Number(id) === 1 || (role.nombre && role.nombre.toLowerCase() === 'administrador')) {
      if (estado !== undefined && (estado === 'Inactivo' || estado === 0 || estado === 'INACTIVO')) {
        const error = new Error('El rol Administrador no se puede desactivar');
        error.statusCode = 400;
        throw error;
      }
    }

    if (nombre) {
      const cleanNombre = nombre.trim();
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,50}$/.test(cleanNombre)) {
        const error = new Error('El nombre del rol solo puede contener letras y espacios (sin puntos, números, guiones ni caracteres especiales como @ o -)');
        error.statusCode = 400;
        throw error;
      }
      role.nombre = cleanNombre;
    }

    if (descripcion !== undefined) role.descripcion = descripcion ? descripcion.trim() : '';
    if (estado !== undefined) role.estado = estado === 'Activo' || estado === 1 ? 1 : 0;

    await role.save();

    if (permisos && Array.isArray(permisos)) {
      const cleanPermisos = permisos.filter(Boolean);
      if (cleanPermisos.length === 0) {
        const error = new Error('El rol debe conservar al menos un permiso asignado');
        error.statusCode = 400;
        throw error;
      }

      // Optimización de rendimiento: consulta en lote (bulk)
      const existingPermisos = await Permiso.findAll({
        where: { nombrePermiso: cleanPermisos }
      });
      const existingMap = new Map(existingPermisos.map(p => [p.nombrePermiso, p.idPermiso]));

      const missingPermNames = cleanPermisos.filter(pName => !existingMap.has(pName));
      if (missingPermNames.length > 0) {
        const createdPerms = await Permiso.bulkCreate(
          missingPermNames.map(pName => ({ nombrePermiso: pName }))
        );
        createdPerms.forEach(p => existingMap.set(p.nombrePermiso, p.idPermiso));
      }

      const rolPermisoRecords = cleanPermisos
        .map(pName => {
          const idPermiso = existingMap.get(pName);
          return idPermiso ? { idRol: Number(id), idPermiso } : null;
        })
        .filter(Boolean);

      await RolPermiso.destroy({ where: { idRol: id } });
      if (rolPermisoRecords.length > 0) {
        await RolPermiso.bulkCreate(rolPermisoRecords);
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

    if (Number(id) === 1 || (role.nombre && role.nombre.toLowerCase() === 'administrador')) {
      const error = new Error('El rol Administrador no se puede eliminar bajo ninguna circunstancia');
      error.statusCode = 400;
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

    const { resetAutoIncrement } = require('../../infrastructure/utils/dbUtils');
    await resetAutoIncrement('rol', 'idRol');


    return { message: 'Rol eliminado correctamente' };
  }
}

module.exports = RoleService;
