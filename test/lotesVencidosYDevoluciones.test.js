const test = require('node:test');
const assert = require('node:assert/strict');

const InsumoService = require('../src/application/services/insumoService');
const DevolucionService = require('../src/application/services/devolucionService');
const VentaService = require('../src/application/services/ventaService');

test('isLoteExpiredByDateOrState detecta vencimiento por fecha <= hoy y respeta VENCIDO vs AGOTADO', () => {
  const today = '2026-11-13';

  assert.equal(
    InsumoService.isLoteExpiredByDateOrState({ estado: 'DISPONIBLE', fechaVencimiento: '2026-11-12' }, today),
    true
  );
  assert.equal(
    InsumoService.isLoteExpiredByDateOrState({ estado: 'DISPONIBLE', fechaVencimiento: '2026-11-13' }, today),
    true
  );
  assert.equal(
    InsumoService.isLoteExpiredByDateOrState({ estado: 'DISPONIBLE', fechaVencimiento: '2026-11-14' }, today),
    false
  );
  assert.equal(
    InsumoService.isLoteExpiredByDateOrState({ estado: 'VENCIDO', fechaVencimiento: '2027-01-01' }, today),
    true
  );
  assert.equal(
    InsumoService.isLoteExpiredByDateOrState({ estado: 'AGOTADO', fechaVencimiento: '2020-01-01' }, today),
    false
  );
  assert.equal(InsumoService.isLoteExpiredByDateOrState(null, today), false);
});

test('validateAndNormalizeDatosReembolso retorna null si la resolución no implica dinero', () => {
  assert.equal(
    DevolucionService.validateAndNormalizeDatosReembolso({ banco: '' }, 'Cambio de producto', { idRol: 3 }),
    null
  );
});

test('validateAndNormalizeDatosReembolso valida Bancolombia, Nequi, Daviplata y Otro correctamente', () => {
  const bancolombiaOk = DevolucionService.validateAndNormalizeDatosReembolso(
    {
      banco: 'Bancolombia',
      tipoCuenta: 'Corriente',
      numeroCuenta: '123-4567890-1',
      titularNombre: '  Laura Pérez ',
      titularTipoDocumento: 'cc',
      titularDocumento: '1.030.555.777',
      observacionesCuenta: '  Cuenta nómina '
    },
    'Devolución de dinero',
    { idRol: 3 }
  );
  assert.deepEqual(bancolombiaOk, {
    banco: 'Bancolombia',
    tipoCuenta: 'Corriente',
    numeroCuenta: '12345678901',
    titularNombre: 'Laura Pérez',
    titularTipoDocumento: 'CC',
    titularDocumento: '1030555777',
    observacionesCuenta: 'Cuenta nómina'
  });

  assert.throws(
    () =>
      DevolucionService.validateAndNormalizeDatosReembolso(
        {
          banco: 'Bancolombia',
          numeroCuenta: '12345',
          titularNombre: 'Laura Pérez',
          titularDocumento: '1030555777'
        },
        'Devolución de dinero',
        { idRol: 3 }
      ),
    /entre 6 y 20 caracteres/
  );

  const nequiOk = DevolucionService.validateAndNormalizeDatosReembolso(
    {
      banco: 'Nequi',
      numeroCuenta: '300 987 6543',
      titularNombre: 'Andrés Gómez',
      titularDocumento: '99887766'
    },
    'Cambio de producto y devolución de dinero',
    { idRol: 3 }
  );
  assert.equal(nequiOk.tipoCuenta, 'Billetera Digital / Celular');
  assert.equal(nequiOk.numeroCuenta, '3009876543');

  assert.throws(
    () =>
      DevolucionService.validateAndNormalizeDatosReembolso(
        {
          banco: 'Nequi',
          numeroCuenta: '2009876543',
          titularNombre: 'Andrés Gómez',
          titularDocumento: '99887766'
        },
        'Devolución de dinero',
        { idRol: 3 }
      ),
    /10 dígitos e iniciar en 3/
  );

  const daviOk = DevolucionService.validateAndNormalizeDatosReembolso(
    {
      banco: 'Daviplata',
      numeroCuenta: '3151234567',
      titularNombre: 'Sofía Castro',
      titularDocumento: '11223344'
    },
    'Devolución de dinero',
    { idRol: 3 }
  );
  assert.equal(daviOk.banco, 'Daviplata');
  assert.equal(daviOk.tipoCuenta, 'Billetera Digital / Celular');

  const otroOk = DevolucionService.validateAndNormalizeDatosReembolso(
    {
      banco: 'Otro',
      bancoOtro: 'Banco de Occidente',
      numeroCuenta: '0011223344',
      titularNombre: 'Mateo Díaz',
      titularDocumento: '44556677'
    },
    'Devolución de dinero',
    { idRol: 3 }
  );
  assert.equal(otroOk.banco, 'Banco de Occidente');
  assert.equal(otroOk.tipoCuenta, 'Ahorros');
});

test('validateAndNormalizeDatosReembolso restringe Efectivo en Caja solo a staff POS', () => {
  const rawEfectivo = {
    banco: 'Efectivo en Caja',
    numeroCuenta: '',
    titularNombre: 'Camila Rojas',
    titularDocumento: '77889900'
  };

  assert.throws(
    () => DevolucionService.validateAndNormalizeDatosReembolso(rawEfectivo, 'Devolución de dinero', { idRol: 3 }),
    /solicitudes web/
  );

  const adminRes = DevolucionService.validateAndNormalizeDatosReembolso(rawEfectivo, 'Devolución de dinero', {
    idRol: 1,
    rol: 'Administrador'
  });
  assert.equal(adminRes.tipoCuenta, 'Caja / POS');
  assert.equal(adminRes.numeroCuenta, 'Efectivo en Caja');
});

test('extractVentaDeliveryContext extrae datos desde observaciones JSON y usa fallbacks de cliente', () => {
  const fromObs = DevolucionService.extractVentaDeliveryContext({
    idCliente: 42,
    idUsuario: 7,
    tipoVenta: 'DOMICILIO',
    origen: 'ONLINE',
    observaciones: JSON.stringify({
      clienteNombre: 'Pedro Morales',
      direccion: 'Calle 50 # 12-34',
      telefono: '3112223344',
      tipoEntrega: 'Domicilio',
      especificaciones: 'Sin cebolla'
    }),
    cliente: {
      idUsuario: 7,
      direccion: JSON.stringify({ direccion: 'Dirección backup' }),
      usuario: { nombre: 'Pedro', apellidos: 'Morales', telefono: '3000000000' }
    }
  });

  assert.equal(fromObs.idCliente, 42);
  assert.equal(fromObs.idUsuario, 7);
  assert.equal(fromObs.clienteNombre, 'Pedro Morales');
  assert.equal(fromObs.direccion, 'Calle 50 # 12-34');
  assert.equal(fromObs.telefono, '3112223344');
  assert.equal(fromObs.tipoEntrega, 'Domicilio');
  assert.equal(fromObs.especificaciones, 'Sin cebolla');

  const fallback = DevolucionService.extractVentaDeliveryContext({
    idCliente: 99,
    tipoVenta: 'DOMICILIO',
    observaciones: '{invalid json',
    cliente: {
      idUsuario: 15,
      direccion: JSON.stringify({ direccion: 'Carrera 80 # 10-20', telefono: '3209998877' }),
      usuario: { nombre: 'Juana', apellidos: 'López' }
    }
  });

  assert.equal(fallback.idCliente, 99);
  assert.equal(fallback.idUsuario, 15);
  assert.equal(fallback.clienteNombre, 'Juana López');
  assert.equal(fallback.direccion, 'Carrera 80 # 10-20');
  assert.equal(fallback.telefono, '3209998877');
});

test('VentaService.formatVenta preserva total $0 y trazabilidad en órdenes de reposición por devolución', () => {
  const formatted = VentaService.formatVenta({
    idVenta: 555,
    codigoPedido: 'DEV-REP-1234',
    subtotal: 0,
    total: 0,
    descuentoAplicado: 0,
    estadoEntrega: 'PENDIENTE',
    estadoAprobacion: 'APROBADO',
    tipoVenta: 'DOMICILIO',
    origen: 'ONLINE',
    observaciones: JSON.stringify({
      esDevolucion: true,
      idDevolucionAsociada: 12,
      codigoDevolucionAsociada: 'DEV-0012',
      idVentaOriginal: 500,
      codigoVentaOriginal: 'VEN-0500',
      direccion: 'Av Siempre Viva 742',
      telefono: '3101112233',
      tipoEntrega: 'Domicilio',
      productos: [
        { idProducto: 3, nombre: 'Hamburguesa Especial', cantidad: 1, precio: 0, total: 0 }
      ]
    })
  });

  assert.equal(formatted.esDevolucion, true);
  assert.equal(formatted.idDevolucionAsociada, 12);
  assert.equal(formatted.codigoDevolucionAsociada, 'DEV-0012');
  assert.equal(formatted.idVentaOriginal, 500);
  assert.equal(formatted.codigoVentaOriginal, 'VEN-0500');
  assert.equal(formatted.subtotal, 0);
  assert.equal(formatted.total, 0);
  assert.equal(formatted.precioOriginal, 0);
  assert.equal(formatted.direccion, 'Av Siempre Viva 742');
  assert.equal(formatted.telefono, '3101112233');
  assert.equal(formatted.productos.length, 1);
  assert.equal(formatted.productos[0].total, 0);
});

