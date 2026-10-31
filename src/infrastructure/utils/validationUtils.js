/**
 * Reglas de validación y formateo de nombres y documentos para Backend Chazin Food (Colombia)
 */

function sanitizeTelefono(value = '') {
  return String(value || '').replace(/\D/g, '').slice(0, 10);
}

function sanitizeDocumento(value = '', tipoDoc = 'C.C.') {
  const norm = String(tipoDoc || 'C.C.').trim().toUpperCase();
  let val = String(value || '');
  if (
    norm.includes('C.E.') ||
    norm === 'CE' ||
    norm.includes('PASAPORTE') ||
    norm.includes('PPT') ||
    norm.includes('OTRO')
  ) {
    val = val.replace(/[^a-zA-Z0-9\-]/g, '');
    return val.slice(0, 20);
  } else if (norm.includes('NIT')) {
    val = val.replace(/\D/g, '');
    return val.slice(0, 15);
  } else if (norm.includes('T.I.') || norm === 'TI') {
    val = val.replace(/\D/g, '');
    return val.slice(0, 11);
  } else {
    // C.C. or default
    val = val.replace(/\D/g, '');
    return val.slice(0, 10);
  }
}

function isValidEmailStrict(email = '') {
  const str = String(email || '').trim();
  if (!str || !str.includes('@')) return false;
  const parts = str.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (!/^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*$/.test(local)) return false;
  const labels = domain.split('.');
  if (labels.length < 2) return false;
  for (const label of labels) {
    if (!label || !/^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(label)) return false;
  }
  const tld = labels[labels.length - 1];
  if (!/^[a-zA-Z]{2,}$/.test(tld)) return false;
  return true;
}

function isValidPersonName(val = '') {
  const str = String(val || '').trim();
  if (!str || str.length < 2) return false;
  if (str.includes('@') || /\d/.test(str)) return false;
  return true;
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


function isValidDocumento(value = '', tipoDoc = 'C.C.') {
  const clean = sanitizeDocumento(value, tipoDoc);
  if (!clean) return false;
  const norm = String(tipoDoc || 'C.C.').trim().toUpperCase();
  if (norm.includes('T.I.') || norm === 'TI') {
    return clean.length >= 10 && clean.length <= 11;
  }
  return clean.length >= 6;
}

module.exports = {
  isValidDocumento,
  sanitizeTelefono,
  sanitizeDocumento,
  cleanNameAndLastName,
  formatNombreCompleto,
  isValidEmailStrict,
  isValidPersonName
};
