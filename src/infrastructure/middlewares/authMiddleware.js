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

      if (user.estado === 'INACTIVO' || user.estado === 0 || user.estado === '0') {
        return res.status(401).json({ message: 'No autorizado, esta cuenta ha sido desactivada' });
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

module.exports = { protect, authorize };
