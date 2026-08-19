/**
 * Reglas de validación y formateo de nombres y documentos para Backend Chazin Food (Colombia)
 */

function sanitizeTelefono(value = '') {
  return String(value || '').replace(/\D/g, '').slice(0, 10);
}

function sanitizeDocumento(value = '', tipoDoc = 'C.C.') {
  const norm = String(tipoDoc || 'C.C.').trim().toUpperCase();
  let val = String(value || '');
  if (norm.includes('C.E.') || norm.includes('CE') || norm.includes('PASAPORTE')) {
    val = val.replace(/[^a-zA-Z0-9\-]/g, '');
    return val.slice(0, 20);
  } else if (norm.includes('T.I.') || norm.includes('TI')) {
    val = val.replace(/\D/g, '');
    return val.slice(0, 11);
  } else {
    // C.C. or default
    val = val.replace(/\D/g, '');
    return val.slice(0, 10);
  }
}

function cleanNameAndLastName(nombre = '', apellidos = '') {
  let cleanNombre = (nombre || '').trim();
  let cleanApellidos = (apellidos || '').trim();

  // If cleanApellidos is present and cleanNombre ends with cleanApellidos:
  if (cleanApellidos) {
    while (cleanNombre.toLowerCase().endsWith(cleanApellidos.toLowerCase())) {
      cleanNombre = cleanNombre.slice(0, cleanNombre.length - cleanApellidos.length).trim();
    }
  }

  // Remove duplicate phrases inside cleanNombre (e.g. "García López García López")
  for (let iter = 0; iter < 5; iter++) {
    const w = cleanNombre.split(/\s+/).filter(Boolean);
    let modified = false;
    for (let len = 1; len <= 3; len++) {
      if (w.length >= len * 2) {
        const tail1 = w.slice(-len).join(' ').toLowerCase();
        const tail2 = w.slice(-len * 2, -len).join(' ').toLowerCase();
        if (tail1 === tail2) {
          cleanNombre = w.slice(0, -len).join(' ');
          modified = true;
          break;
        }
      }
    }
    if (!modified) break;
  }

  if (cleanApellidos) {
    while (cleanNombre.toLowerCase().endsWith(cleanApellidos.toLowerCase())) {
      cleanNombre = cleanNombre.slice(0, cleanNombre.length - cleanApellidos.length).trim();
    }
  }

  return { nombre: cleanNombre, apellidos: cleanApellidos };
}

function formatNombreCompleto(nombre = '', apellidos = '') {
  const cleaned = cleanNameAndLastName(nombre, apellidos);
  if (!cleaned.nombre && !cleaned.apellidos) return '';
  if (!cleaned.apellidos) return cleaned.nombre;
  if (!cleaned.nombre) return cleaned.apellidos;
  return `${cleaned.nombre} ${cleaned.apellidos}`.trim();
}

module.exports = {
  sanitizeTelefono,
  sanitizeDocumento,
  cleanNameAndLastName,
  formatNombreCompleto
};
