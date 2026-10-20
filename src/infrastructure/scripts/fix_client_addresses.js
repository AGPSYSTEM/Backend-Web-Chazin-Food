const { Cliente } = require('../../persistence/models');

async function fixClientAddresses() {
  const clients = await Cliente.findAll();
  console.log(`Verificando ${clients.length} clientes...`);

  for (const c of clients) {
    if (!c.direccion) continue;
    const raw = String(c.direccion).trim();

    if (raw.startsWith('{')) {
      let cleanDir = '';
      let metaObj = {};

      try {
        metaObj = JSON.parse(raw);
        cleanDir = metaObj.direccion || metaObj.d || '';
      } catch (err) {
        // Recover from truncated JSON
        const matchDir = raw.match(/"direccion"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/i);
        if (matchDir && matchDir[1]) {
          cleanDir = matchDir[1];
        }
        const matchTipo = raw.match(/"tipo"\s*:\s*"([^"]+)"/i);
        if (matchTipo && matchTipo[1]) {
          metaObj.tipo = matchTipo[1];
        }
        const matchCiclo = raw.match(/"comprasCiclo"\s*:\s*(\d+)/i) || raw.match(/"ciclo"\s*:\s*(\d+)/i);
        if (matchCiclo && matchCiclo[1]) {
          metaObj.ciclo = Number(matchCiclo[1]);
        }
      }

      // Compact payload that strictly fits in VARCHAR(255)
      const compactMeta = {
        direccion: cleanDir,
        tipo: metaObj.tipo || 'Nuevo',
        ciclo: metaObj.ciclo || metaObj.comprasCiclo || 0
      };

      if (metaObj.vence || metaObj.fechaVencimientoNivel) {
        compactMeta.vence = metaObj.vence || String(metaObj.fechaVencimientoNivel).substring(0, 10);
      }

      c.direccion = JSON.stringify(compactMeta);
      await c.save();
      console.log(`[OK] Cliente #${c.idCliente} Dirección arreglada: "${cleanDir}"`);
    }
  }
  console.log('¡Limpieza de direcciones finalizada con éxito!');
  process.exit(0);
}

fixClientAddresses().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
