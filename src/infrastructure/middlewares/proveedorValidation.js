const SOLO_NUMERICOS   = /^[\d.\-\s]+$/;
const SOLO_TELEFONO    = /^[\d\s+\-()]+$/;
const CONTIENE_NUMERO  = /\d/;

const validateCreateProveedor = (req, res, next) => {
  const errores = _validarCampos(req.body, true);
  if (errores.length > 0)
    return res.status(400).json({ mensaje: 'Error de validación en los datos del proveedor.', errores });
  next();
};

const validateUpdateProveedor = (req, res, next) => {
  const errores = _validarCampos(req.body, false);
  if (errores.length > 0)
    return res.status(400).json({ mensaje: 'Error de validación en los datos del proveedor.', errores });
  next();
};

function _validarCampos(data, esCreacion) {
  const errores = [];
  const { nombre, numeroDocumento, telefono, nombreContacto, correo } = data;

  if (esCreacion && (!nombre || !String(nombre).trim()))
    errores.push({ campo: 'nombre', mensaje: 'El nombre del proveedor es obligatorio.' });

  if (esCreacion && (!numeroDocumento || !String(numeroDocumento).trim()))
    errores.push({ campo: 'numeroDocumento', mensaje: 'El número de documento es obligatorio.' });
  else if (numeroDocumento !== undefined && String(numeroDocumento).trim() !== '') {
    if (!SOLO_NUMERICOS.test(String(numeroDocumento).trim()))
      errores.push({ campo: 'numeroDocumento', mensaje: 'El número de documento solo puede contener dígitos, puntos y guiones.' });
  }

  if (esCreacion && (!telefono || !String(telefono).trim()))
    errores.push({ campo: 'telefono', mensaje: 'El teléfono es obligatorio.' });
  else if (telefono !== undefined && String(telefono).trim() !== '') {
    if (!SOLO_TELEFONO.test(String(telefono).trim()))
      errores.push({ campo: 'telefono', mensaje: 'El teléfono solo puede contener dígitos. No se permiten letras.' });
  }

  if (esCreacion && (!nombreContacto || !String(nombreContacto).trim()))
    errores.push({ campo: 'nombreContacto', mensaje: 'La persona de contacto es obligatoria.' });
  else if (nombreContacto !== undefined && String(nombreContacto).trim() !== '') {
    if (CONTIENE_NUMERO.test(String(nombreContacto)))
      errores.push({ campo: 'nombreContacto', mensaje: 'El nombre de contacto no puede contener números.' });
  }

  if (correo !== undefined && String(correo).trim() !== '') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo).trim()))
      errores.push({ campo: 'correo', mensaje: 'El correo electrónico no tiene un formato válido.' });
  }

  return errores;
}

module.exports = { validateCreateProveedor, validateUpdateProveedor };
