const { sequelize, Insumo, Product, Variante, FichaTecnica, DetalleFichaInsumo } = require('../src/persistence/models');
const VentaService = require('../src/application/services/ventaService');

async function testStockDeduction() {
  console.log('=== TEST DE DESCUENTO DE STOCK: COCA-COLA LIGHT / SIN AZÚCAR ===\n');

  try {
    // 1. Obtener insumos iniciales
    const insumoLight = await Insumo.findByPk(32);
    const insumoOriginal = await Insumo.findByPk(29);

    console.log(`Estado Inicial:`);
    console.log(`- Insumo 32 (Coca-Cola Sin Azúcar / Light): Stock = ${insumoLight.stock}`);
    console.log(`- Insumo 29 (Coca-Cola Original): Stock = ${insumoOriginal.stock}`);

    const initialLightStock = Number(insumoLight.stock);
    const initialOrigStock = Number(insumoOriginal.stock);

    // 2. Simular Venta de Coca-Cola Normal eligiendo variante "Coca-Cola Sin Azúcar / Light 400ml" (idVariante: 20)
    console.log('\n--- Realizando Venta de Coca-Cola seleccionando variante Coca-Cola Light (idVariante: 20) ---');
    const ventaLight = await VentaService.create({
      idUsuario: 1,
      tipoVenta: 'PUNTO_DE_VENTA',
      tipoEntrega: 'Mesa',
      metodoPago: 'Efectivo',
      subtotal: 4500,
      total: 4500,
      observaciones: 'Venta de prueba para verificar stock de Coca Light',
      items: [
        {
          idProducto: 8,
          idVariante: 20,
          nombre: 'Gaseosa Coca-Cola Sin Azúcar / Light (400 ml)',
          cantidad: 1,
          precioUnitario: 4500,
          subtotal: 4500,
          observaciones: 'Sabor: Coca-Cola Sin Azúcar / Light 400ml'
        }
      ]
    });

    console.log(`Venta creada con ID: #${ventaLight.idVenta}`);

    // 3. Verificar stocks tras la venta
    const postLight = await Insumo.findByPk(32);
    const postOrig = await Insumo.findByPk(29);

    console.log(`\nEstado Tras Venta de Coca-Cola Light:`);
    console.log(`- Insumo 32 (Coca-Cola Sin Azúcar / Light): Stock = ${postLight.stock} (Esperado: ${initialLightStock - 1})`);
    console.log(`- Insumo 29 (Coca-Cola Original): Stock = ${postOrig.stock} (Esperado: ${initialOrigStock})`);

    const passedLight = Number(postLight.stock) === initialLightStock - 1;
    const passedOrig = Number(postOrig.stock) === initialOrigStock;

    if (passedLight && passedOrig) {
      console.log('✅ ÉXITO: El stock se descontó correctamente de Coca-Cola Light (Insumo 32) y la Original quedó intacta.');
    } else {
      console.error('❌ ERROR: El stock no se descontó como se esperaba.');
      process.exit(1);
    }

    // 4. Probar cancelación y reintegro
    console.log('\n--- Cancelando la venta para verificar reintegro ---');
    await VentaService.cancelar(ventaLight.idVenta);

    const postCancelLight = await Insumo.findByPk(32);
    console.log(`- Insumo 32 tras cancelación: Stock = ${postCancelLight.stock} (Esperado: ${initialLightStock})`);

    // 5. Testear Venta de Coca-Cola Original
    console.log('\n--- Realizando Venta de Coca-Cola Original (fórmula base) ---');
    const ventaOrig = await VentaService.create({
      idUsuario: 1,
      tipoVenta: 'PUNTO_DE_VENTA',
      tipoEntrega: 'Mesa',
      metodoPago: 'Efectivo',
      subtotal: 4500,
      total: 4500,
      observaciones: 'Venta de prueba para verificar stock de Coca Original',
      items: [
        {
          idProducto: 8,
          nombre: 'Gaseosa Coca-Cola (400 ml)',
          cantidad: 1,
          precioUnitario: 4500,
          subtotal: 4500,
          observaciones: 'Sabor: Coca-Cola Original'
        }
      ]
    });

    const postOrigTestLight = await Insumo.findByPk(32);
    const postOrigTestOrig = await Insumo.findByPk(29);

    console.log(`- Insumo 29 (Original): Stock = ${postOrigTestOrig.stock} (Esperado: ${initialOrigStock - 1})`);
    console.log(`- Insumo 32 (Light): Stock = ${postOrigTestLight.stock} (Esperado: ${initialLightStock})`);

    if (Number(postOrigTestOrig.stock) === initialOrigStock - 1 && Number(postOrigTestLight.stock) === initialLightStock) {
      console.log('✅ ÉXITO: El stock de Coca-Cola Original se descontó de Insumo 29 y Coca-Cola Light no fue afectada.');
    } else {
      console.error('❌ ERROR: Insumo 29 no se descontó adecuadamente.');
      process.exit(1);
    }

    // Cancelar venta original para restaurar
    await VentaService.cancelar(ventaOrig.idVenta);
    const postCancelOrig = await Insumo.findByPk(29);
    console.log(`- Insumo 29 tras cancelación: Stock = ${postCancelOrig.stock} (Esperado: ${initialOrigStock})`);

    console.log('\n=== TODOS LOS TESTS PASARON SATISFACTORIAMENTE ===');
    process.exit(0);
  } catch (err) {
    console.error('Error durante el test:', err);
    process.exit(1);
  }
}

testStockDeduction();
