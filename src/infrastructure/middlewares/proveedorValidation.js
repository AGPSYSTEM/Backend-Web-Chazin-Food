const { isValidEmailStrict } = require('../utils/validationUtils');

const SOLO_TELEFONO = /^[\d\s+\-()]+$/;

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
  const { nombre, numeroDocumento, nit, documento, telefono, nombreContacto, contacto, correo, email, tipoPersona, idTipoDocumento } = data;

  const finalDoc = numeroDocumento !== undefined ? numeroDocumento : (nit !== undefined ? nit : documento);
  const finalCorreo = correo !== undefined ? correo : email;
  const finalContacto = nombreContacto !== undefined ? nombreContacto : contacto;

  // Validación de Razón Social / Nombre (Ítem #71)
  if (esCreacion && (!nombre || !String(nombre).trim())) {
    errores.push({ campo: 'nombre', mensaje: 'El nombre o razón social del proveedor es obligatorio.' });
  } else if (nombre !== undefined && String(nombre).trim() !== '') {
    const normNombre = String(nombre).trim();
    if (normNombre.length < 2 || !/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(normNombre)) {
      errores.push({ campo: 'nombre', mensaje: 'La razón social / nombre solo puede contener letras, números y espacios (sin guiones ni caracteres especiales como -, ., &, @, #).' });
    }
  }

  // Validación de Número de Documento / NIT (Ítem #72: sin puntos ni guiones)
  const docVal = finalDoc !== undefined ? String(finalDoc).trim() : '';
  if (esCreacion && !docVal) {
    errores.push({ campo: 'numeroDocumento', mensaje: 'El número de documento / NIT es obligatorio.' });
  } else if (docVal) {
    if (!/^\d+$/.test(docVal)) {
      errores.push({ campo: 'numeroDocumento', mensaje: 'El número de documento solo puede contener dígitos numéricos, sin puntos ni guiones.' });
    } else if (docVal.length < 6 || docVal.length > 20) {
      errores.push({ campo: 'numeroDocumento', mensaje: 'El número de documento debe tener entre 6 y 20 dígitos.' });
    }
  }

  // Validación de Teléfono
  if (esCreacion && (!telefono || !String(telefono).trim())) {
    errores.push({ campo: 'telefono', mensaje: 'El teléfono es obligatorio.' });
  } else if (telefono !== undefined && String(telefono).trim() !== '') {
    const cleanTel = String(telefono).replace(/\D/g, '');
    if (!SOLO_TELEFONO.test(String(telefono).trim()) || cleanTel.length < 7) {
      errores.push({ campo: 'telefono', mensaje: 'El teléfono debe ser un número válido (mínimo 7 dígitos, sin letras).' });
    }
  }

  // Persona Natural vs Jurídica para Nombre de Contacto (Ítem #66)
  const esNatural = String(tipoPersona || '').toLowerCase().includes('natural') || (Number(idTipoDocumento) && Number(idTipoDocumento) !== 3);
  if (esCreacion && !esNatural && (!finalContacto || !String(finalContacto).trim())) {
    errores.push({ campo: 'nombreContacto', mensaje: 'La persona de contacto es obligatoria para personas jurídicas.' });
  } else if (finalContacto !== undefined && String(finalContacto).trim() !== '') {
    if (/\d/.test(String(finalContacto)) || String(finalContacto).includes('@')) {
      errores.push({ campo: 'nombreContacto', mensaje: 'El nombre de contacto no puede contener números ni el símbolo @.' });
    }
  }

  // Correo electrónico estricto (Ítem #73)
  if (finalCorreo !== undefined && String(finalCorreo).trim() !== '') {
    if (!isValidEmailStrict(String(finalCorreo).trim())) {
      errores.push({ campo: 'correo', mensaje: 'El correo electrónico no tiene un formato válido o contiene caracteres no permitidos.' });
    }
  }

  return errores;
}

module.exports = { validateCreateProveedor, validateUpdateProveedor };
