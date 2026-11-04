const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (err.statusCode && typeof err.statusCode === 'number') {
    statusCode = err.statusCode;
  } else if (err.status && typeof err.status === 'number') {
    statusCode = err.status;
  }

  let friendlyMessage = err.message || 'Ha ocurrido un error inesperado en el servidor';

  // Normalizar errores técnicos de Sequelize / MySQL / TiDB a mensajes claros en español
  const errName = err.name || '';
  const rawMsg = String(err.message || '');

  if (errName === 'SequelizeForeignKeyConstraintError' || rawMsg.includes('foreign key constraint')) {
    statusCode = 400;
    if (rawMsg.includes('categoriaproducto') || rawMsg.includes('idCategoriaProducto')) {
      friendlyMessage = 'No se puede eliminar la categoría porque tiene productos asociados en el menú.';
    } else if (rawMsg.includes('producto') || rawMsg.includes('idProducto')) {
      friendlyMessage = 'No se puede eliminar este producto porque tiene ventas, pedidos o eventos asociados.';
    } else if (rawMsg.includes('insumo') || rawMsg.includes('idInsumo')) {
      friendlyMessage = 'No se puede eliminar el insumo porque está relacionado con compras o recetas activas.';
    } else {
      friendlyMessage = 'No se puede realizar esta acción porque el registro está asociado con otros elementos del sistema.';
    }
  } else if (errName === 'SequelizeUniqueConstraintError' || rawMsg.includes('Duplicate entry') || rawMsg.includes('unique constraint')) {
    statusCode = 400;
    if (rawMsg.toLowerCase().includes('nombre') || rawMsg.toLowerCase().includes('slug')) {
      friendlyMessage = 'Ya existe un registro con este nombre. Por favor ingresa uno diferente.';
    } else if (rawMsg.toLowerCase().includes('codigo')) {
      friendlyMessage = 'Ya existe un registro con este código en el sistema.';
    } else if (rawMsg.toLowerCase().includes('correo') || rawMsg.toLowerCase().includes('email')) {
      friendlyMessage = 'Ya existe un usuario registrado con este correo electrónico.';
    } else {
      friendlyMessage = 'Ya existe un registro con estos datos en el sistema. Por favor verifica los valores.';
    }
  } else if (errName === 'SequelizeValidationError') {
    statusCode = 400;
    if (Array.isArray(err.errors) && err.errors.length > 0) {
      friendlyMessage = err.errors.map(e => e.message).join('. ');
    } else {
      friendlyMessage = 'Los datos enviados no cumplen con el formato o las validaciones requeridas.';
    }
  } else if (errName === 'SequelizeConnectionError' || rawMsg.includes('ECONNREFUSED') || rawMsg.includes('connect')) {
    statusCode = 503;
    friendlyMessage = 'No se pudo conectar con la base de datos en este momento. Por favor reintenta en breve.';
  }

  res.status(statusCode).json({
    message: friendlyMessage,
    error: friendlyMessage,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
