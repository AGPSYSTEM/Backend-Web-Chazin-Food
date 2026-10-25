const jwt = require('jsonwebtoken');
const UserService = require('../../application/services/userService');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      const user = await UserService.getUserById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      if (
        user.estado === 'INACTIVO' ||
        user.estado === 'PENDIENTE' ||
        user.estado === 0 ||
        user.estado === '0'
      ) {
        return res.status(401).json({ message: 'No autorizado, esta cuenta se encuentra inactiva o pendiente de activación' });
      }

      if (user.rolEstado === 0 || user.rolEstado === '0' || user.rolEstado === 'INACTIVO') {
        return res.status(401).json({ message: 'No autorizado, el rol asignado a esta cuenta ha sido desactivado' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Error en autenticación de token:', error.message);
      return res.status(401).json({ message: 'No autorizado, token fallido' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, sin token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (req.user && req.user.rol) {
      const userRol = req.user.rol.toLowerCase();
      const allowedRoles = roles.map(role => role.toLowerCase());
      
      if (allowedRoles.includes(userRol)) {
        next();
      } else {
        res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta' });
      }
    } else {
      res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta' });
    }
  };
};

const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      const user = await UserService.getUserById(decoded.id);
      if (
        user &&
        user.estado !== 'INACTIVO' &&
        user.estado !== 'PENDIENTE' &&
        user.estado !== 0 &&
        user.estado !== '0' &&
        user.rolEstado !== 0 &&
        user.rolEstado !== '0'
      ) {
        req.user = user;
      }
    } catch (e) {
      // Token inválido o expirado, continuar sin req.user
    }
  }
  return next();
};

/**
 * Verifica permisos y privilegios granulares ("Modulo" y "Modulo:Accion").
 * - Administrador siempre tiene acceso total.
 * - Si un rol tiene el módulo asignado sin sufijos granulares (legado), se permite la acción.
 * - Si el rol tiene privilegios granulares ("Modulo:Ver", "Modulo:Crear", etc.), se exige la acción exacta.
 */
const requirePrivilege = (modulos, accion = 'Ver') => {
  const targetModulos = Array.isArray(modulos) ? modulos : [modulos];
  const normAccion = String(accion || 'Ver');
  const capAccion = normAccion.charAt(0).toUpperCase() + normAccion.slice(1).toLowerCase();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado, debes iniciar sesión' });
    }

    const userRol = String(req.user.rol || '').toLowerCase().trim();
    if (userRol === 'administrador' || userRol === 'admin' || Number(req.user.idRol) === 1) {
      return next();
    }

    // Acceso de cocinero a Producción y Fichas Técnicas
    if (userRol === 'cocinero') {
      const cocinaAllowed = ['Gestión de Producción', 'Fichas Técnicas', 'Productos', 'Insumos'];
      if (targetModulos.some(m => cocinaAllowed.includes(m)) && capAccion !== 'Eliminar') {
        return next();
      }
    }

    const permisos = Array.isArray(req.user.permisos) ? req.user.permisos : [];

    // Compatibilidad con "Punto de Venta" integrado en "Gestión de Ventas"
    const expandedTargets = [...targetModulos];
    if (targetModulos.includes('Gestión de Ventas') && !expandedTargets.includes('Punto de Venta')) {
      expandedTargets.push('Punto de Venta');
    }

    const allowed = expandedTargets.some((mod) => {
      const hasModule = permisos.includes(mod) || permisos.some(p => p.startsWith(`${mod}:`));
      if (!hasModule) return false;
      const hasGranular = permisos.some(p => p.startsWith(`${mod}:`));
      if (!hasGranular) return true;
      return permisos.includes(`${mod}:${capAccion}`);
    });

    if (!allowed) {
      return res.status(403).json({
        message: `No tienes privilegios de "${capAccion}" para realizar esta acción en ${targetModulos[0]}.`
      });
    }

    return next();
  };
};

module.exports = { protect, optionalProtect, authorize, requirePrivilege };
