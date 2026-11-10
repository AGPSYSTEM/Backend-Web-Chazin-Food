const { Venta, Cliente, User, DetalleVentaProducto, Variante, Product, Devolucion, sequelize } = require('./src/persistence/models');
const DevolucionService = require('./src/application/services/devolucionService');

async function runTests() {
  console.log('=== INICIO DE PRUEBAS DE DEVOLUCIÓN EN CLIENTE ===\n');

  // 1. Verificar políticas del servicio
  console.log('--- TEST 1: Consulta de Políticas de la Empresa ---');
  const politicas = DevolucionService.getPolicies();
  console.log('Plazo máximo:', politicas.MAX_DIAS, 'días (', politicas.MAX_HORAS, 'horas)');
  console.log('Motivos válidos:', politicas.MOTIVOS);
  console.log('Resoluciones válidas:', politicas.RESOLUCIONES);
  if (politicas.MAX_DIAS !== 2 || politicas.MAX_HORAS !== 48) {
    throw new Error('La política de plazo debe ser de 2 días (48 horas)');
  }
  if (!politicas.MOTIVOS.includes('Comida en mal estado') || !politicas.MOTIVOS.includes('Pedido incorrecto')) {
    throw new Error('Los motivos deben incluir "Comida en mal estado" y "Pedido incorrecto"');
  }
  console.log('-> TEST 1 PASADO CON ÉXITO\n');

  // 2. Buscar o crear una venta apta para la prueba
  console.log('--- TEST 2: Buscar o preparar venta para cliente ---');
  let venta = await Venta.findOne({
    order: [['idVenta', 'DESC']],
    include: [
      {
        model: Cliente,
        as: 'cliente',
        include: [{ model: User, as: 'usuario' }]
      },
      {
        model: DetalleVentaProducto,
        as: 'detalles',
        include: [{ model: Variante, as: 'variante', include: [{ model: Product, as: 'producto' }] }]
      }
    ]
  });

  if (!venta || !venta.detalles || venta.detalles.length === 0) {
    console.log('No se encontró venta con detalles, buscando variantes para crear una venta de prueba...');
    const variante = await Variante.findOne({ include: [{ model: Product, as: 'producto' }] });
    if (!variante) {
      throw new Error('No hay variantes para crear una venta de prueba');
    }
    let cliente = await Cliente.findOne();
    if (!cliente) {
      let user = await User.findOne();
      cliente = await Cliente.create({ idUsuario: user.idUsuario, direccion: 'Calle 10 # 20-30' });
    }

    venta = await Venta.create({
      idCliente: cliente.idCliente,
      fechaVenta: new Date(),
      estadoEntrega: 'ENTREGADO',
      estadoAprobacion: 'APROBADO',
      subtotal: Number(variante.precio || 15000),
      total: Number(variante.precio || 15000),
      metodoPago: 'Wompi'
    });

    await DetalleVentaProducto.create({
      idVenta: venta.idVenta,
      idVariante: variante.idVariante,
      cantidad: 2,
      precioUnitario: Number(variante.precio || 15000),
      subtotal: Number(variante.precio || 15000) * 2
    });

    venta = await Venta.findByPk(venta.idVenta, {
      include: [
        { model: Cliente, as: 'cliente', include: [{ model: User, as: 'usuario' }] },
        { model: DetalleVentaProducto, as: 'detalles', include: [{ model: Variante, as: 'variante', include: [{ model: Product, as: 'producto' }] }] }
      ]
    });
  }

  console.log(`Venta seleccionada: ID #${venta.idVenta}, Total: $${venta.total}, EstadoEntrega: ${venta.estadoEntrega}`);
  console.log(`Detalles: ${venta.detalles.length} producto(s) en venta.`);
  console.log('-> TEST 2 PASADO CON ÉXITO\n');

  // 3. Probar elegibilidad de la venta
  console.log('--- TEST 3: Verificación de Elegibilidad (checkVentaElegibilidad) ---');
  // Asegurar que la fecha sea reciente para que cumpla el plazo
  await venta.update({ fechaVenta: new Date(), estadoEntrega: 'ENTREGADO' });
  const elegibilidad = await DevolucionService.checkVentaElegibilidad(venta.idVenta);
  console.log('Elegible:', elegibilidad.elegible);
  console.log('Razón:', elegibilidad.politicaInfo.razon);
  console.log('Horas restantes:', elegibilidad.politicaInfo.horasRestantes);
  console.log('Productos disponibles devueltos en verificación:', elegibilidad.productos.length);
  if (!elegibilidad.elegible) {
    throw new Error('La venta reciente debe ser elegible');
  }
  console.log('-> TEST 3 PASADO CON ÉXITO\n');

  // 4. Probar rechazo si la venta supera los 2 días (48 horas)
  console.log('--- TEST 4: Verificación de Venta Fuera de Plazo (> 48h) ---');
  const tresDiasAtras = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  await venta.update({ fechaVenta: tresDiasAtras });
  const elegibilidadVencida = await DevolucionService.checkVentaElegibilidad(venta.idVenta);
  console.log('Venta de hace 3 días elegible?:', elegibilidadVencida.elegible);
  console.log('Razón devuelta:', elegibilidadVencida.politicaInfo.razon);
  if (elegibilidadVencida.elegible !== false) {
    throw new Error('Una venta de 3 días atrás NO debe ser elegible');
  }

  // Intentar crear devolución sobre venta vencida debe lanzar error
  let errorCapturado = false;
  try {
    await DevolucionService.create({
      idVenta: venta.idVenta,
      motivo: 'Comida en mal estado',
      tipoResolucion: 'Cambio de producto',
      descripcion: 'Prueba plazo vencido',
      productosDevueltos: [{ idVariante: venta.detalles[0].idVariante, cantidad: 1, precioUnitario: 1000 }]
    });
  } catch (err) {
    errorCapturado = true;
    console.log('Error capturado correctamente al intentar registrar fuera de plazo:', err.message);
  }
  if (!errorCapturado) {
    throw new Error('Debió lanzar error al registrar devolución fuera de plazo');
  }
  console.log('-> TEST 4 PASADO CON ÉXITO\n');

  // Restaurar fecha reciente para continuar
  await venta.update({ fechaVenta: new Date() });
  await Devolucion.destroy({ where: { idVenta: venta.idVenta } });

  // 5. Probar rechazo con motivo no permitido
  console.log('--- TEST 5: Verificación de Motivo No Permitido ---');
  let errorMotivo = false;
  try {
    await DevolucionService.create({
      idVenta: venta.idVenta,
      motivo: 'Ya no lo quiero porque cambié de opinión',
      tipoResolucion: 'Devolución de dinero',
      descripcion: 'Prueba motivo inválido',
      productosDevueltos: [{ idVariante: venta.detalles[0].idVariante, cantidad: 1, precioUnitario: 1000 }]
    });
  } catch (err) {
    errorMotivo = true;
    console.log('Error capturado por motivo inválido:', err.message);
  }
  if (!errorMotivo) {
    throw new Error('Debió rechazar un motivo fuera de política');
  }
  console.log('-> TEST 5 PASADO CON ÉXITO\n');

  // 6. Probar creación exitosa de devolución desde cliente
  console.log('--- TEST 6: Creación Exitosa de Solicitud de Devolución por Cliente ---');
  // Limpiar devoluciones anteriores de esta venta para prueba limpia
  await Devolucion.destroy({ where: { idVenta: venta.idVenta } });

  const detalle1 = venta.detalles[0];
  const prodSolicitud = [
    {
      idDetalleVenta: detalle1.idDetalleVenta,
      idVariante: detalle1.idVariante,
      nombre: detalle1.variante?.producto?.nombre || 'Producto Test',
      cantidad: 1,
      precioUnitario: Number(detalle1.precioUnitario || 12000)
    }
  ];

  const nuevaDev = await DevolucionService.create({
    idVenta: venta.idVenta,
    idCliente: venta.idCliente,
    motivo: 'Comida en mal estado',
    tipoResolucion: 'Cambio de producto y devolución de dinero',
    descripcion: 'El producto llegó con sabor ácido no característico.',
    productosDevueltos: prodSolicitud,
    valorDevuelto: Number(detalle1.precioUnitario || 12000)
  }, { idUsuario: venta.cliente?.idUsuario || null });

  console.log('Devolución creada con éxito:');
  console.log('Código:', nuevaDev.codigoDevolucion);
  console.log('Estado:', nuevaDev.estado);
  console.log('Motivo:', nuevaDev.motivo);
  console.log('Resolución:', nuevaDev.tipoResolucion);
  console.log('Productos devueltos:', nuevaDev.productosDevueltos);
  console.log('Valor devuelto:', nuevaDev.valorDevuelto);

  if (!nuevaDev.idDevolucion || nuevaDev.estado !== 'PENDIENTE') {
    throw new Error('La devolución debería tener ID y estado PENDIENTE');
  }
  console.log('-> TEST 6 PASADO CON ÉXITO\n');

  // 6b. Probar rechazo de solicitud duplicada mientras hay una activa
  console.log('--- TEST 6b: Verificación de Bloqueo de Solicitud Duplicada ---');
  let errorDuplicado = false;
  try {
    await DevolucionService.create({
      idVenta: venta.idVenta,
      idCliente: venta.idCliente,
      motivo: 'Pedido incorrecto',
      tipoResolucion: 'Cambio de producto',
      descripcion: 'Intento de solicitud duplicada',
      productosDevueltos: prodSolicitud,
      valorDevuelto: Number(detalle1.precioUnitario || 12000)
    });
  } catch (err) {
    errorDuplicado = true;
    console.log('Bloqueo de duplicado capturado correctamente:', err.message);
  }
  if (!errorDuplicado) {
    throw new Error('Debió bloquear la creación de una segunda devolución mientras una esté activa');
  }
  console.log('-> TEST 6b PASADO CON ÉXITO\n');

  // 7. Probar consulta de devoluciones del cliente (Mis Devoluciones)
  console.log('--- TEST 7: Consulta de Mis Devoluciones por Cliente ---');
  const misDevoluciones = await DevolucionService.getByCliente(venta.idCliente, venta.cliente?.idUsuario);
  console.log(`El cliente tiene ${misDevoluciones.length} devolución(es) registrada(s).`);
  const encontrada = misDevoluciones.find(d => Number(d.idDevolucion) === Number(nuevaDev.idDevolucion));
  if (!encontrada) {
    throw new Error('La devolución recién creada no aparece en las devoluciones del cliente');
  }
  console.log('Devolución encontrada en historial de cliente:', encontrada.codigoDevolucion, encontrada.estado);
  console.log('-> TEST 7 PASADO CON ÉXITO\n');

  // 8. Probar listado en módulo de administración y estadísticas
  console.log('--- TEST 8: Visualización en Módulo Admin y KPIs ---');
  const stats = await DevolucionService.getStats();
  console.log('Estadísticas globales de devoluciones:', stats);
  if (stats.pendientes < 1) {
    throw new Error('Debería haber al menos 1 devolución pendiente');
  }

  // 9. Probar cambio de estado por administrador (Resolución)
  console.log('--- TEST 9: Aprobación y Gestión por Administrador ---');
  const devActualizada = await DevolucionService.updateEstado(nuevaDev.idDevolucion, {
    estado: 'APROBADA',
    tipoResolucion: 'Cambio de producto',
    observacionesResolucion: 'Aprobado cambio en tienda física según política.'
  }, { idUsuario: 1 });

  console.log('Devolución actualizada:', devActualizada.codigoDevolucion, 'Nuevo Estado:', devActualizada.estado);
  if (devActualizada.estado !== 'APROBADA') {
    throw new Error('El estado debió cambiar a APROBADA');
  }
  console.log('-> TEST 9 PASADO CON ÉXITO\n');

  console.log('======================================================');
  console.log('TODAS LAS 9 PRUEBAS DE DEVOLUCIÓN DE CLIENTE PASARON CON ÉXITO.');
  console.log('======================================================');
  process.exit(0);
}

runTests().catch(err => {
  console.error('\n*** ERROR EN LAS PRUEBAS ***');
  console.error(err);
  process.exit(1);
});
