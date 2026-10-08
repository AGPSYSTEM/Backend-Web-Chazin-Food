const { User, Cliente, sequelize } = require('../../persistence/models');

function cleanNameAndLastName(nombre = '', apellidos = '') {
  let cleanNombre = (nombre || '').trim();
  let cleanApellidos = (apellidos || '').trim();

  // If cleanApellidos is present and cleanNombre ends with cleanApellidos:
  if (cleanApellidos) {
    while (cleanNombre.toLowerCase().endsWith(cleanApellidos.toLowerCase())) {
      cleanNombre = cleanNombre.slice(0, cleanNombre.length - cleanApellidos.length).trim();
    }
  }

  // If cleanNombre has repeating subphrases at the end:
  for (let iter = 0; iter < 5; iter++) {
    const w = cleanNombre.split(/\s+/);
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

  // If cleanNombre still ends with cleanApellidos after stripping internal repeats:
  if (cleanApellidos) {
    while (cleanNombre.toLowerCase().endsWith(cleanApellidos.toLowerCase())) {
      cleanNombre = cleanNombre.slice(0, cleanNombre.length - cleanApellidos.length).trim();
    }
  }

  return { nombre: cleanNombre, apellidos: cleanApellidos };
}

async function runCleanup() {
  try {
    const users = await User.findAll();
    console.log(`Found ${users.length} users to clean up.`);

    for (const u of users) {
      const oldNombre = u.nombre;
      const oldApellidos = u.apellidos;
      const { nombre, apellidos } = cleanNameAndLastName(u.nombre, u.apellidos);

      let tel = (u.telefono || '').replace(/\D/g, '');
      if (tel.length > 10) {
        tel = tel.slice(0, 10);
      }

      u.nombre = nombre;
      u.apellidos = apellidos;
      u.telefono = tel;
      await u.save();

      console.log(`User #${u.idUsuario}: "${oldNombre}" | "${oldApellidos}" -> "${u.nombre}" | "${u.apellidos}" (Tel: ${u.telefono})`);
    }

    // Also clean client metadata JSON if any
    const clientes = await Cliente.findAll();
    for (const c of clientes) {
      if (c.direccion && c.direccion.trim().startsWith('{')) {
        try {
          const meta = JSON.parse(c.direccion);
          let modified = false;
          if (meta.nombre || meta.apellidos) {
            const cleaned = cleanNameAndLastName(meta.nombre, meta.apellidos);
            meta.nombre = cleaned.nombre;
            meta.apellidos = cleaned.apellidos;
            modified = true;
          }
          if (meta.telefono && meta.telefono.replace(/\D/g, '').length > 10) {
            meta.telefono = meta.telefono.replace(/\D/g, '').slice(0, 10);
            modified = true;
          }
          if (modified) {
            c.direccion = JSON.stringify(meta);
            await c.save();
          }
        } catch (e) {
          // ignore
        }
      }
    }

    console.log('Cleanup completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
}

runCleanup();
