const { Devolucion, Venta, DetalleVentaProducto, Variante, Product, Cliente, User, sequelize } = require('../../persistence/models');
const TrazabilidadService = require('./trazabilidadService');
const { ensureDevolucionSchema } = require('../../infrastructure/utils/dbUtils');

let _devolucionSchemaPromise = null;
function ensureDevolucionSchemaReady() {
  if (!_devolucionSchemaPromise) {
    _devolucionSchemaPromise = ensureDevolucionSchema().catch((err) => {
      console.warn('[DevolucionService] Advertencia asegurando columnas:', err?.message);
      _devolucionSchemaPromise = null;
    });
  }
  return _devolucionSchemaPromise;
}
const { Op } = require('sequelize');

const POLICIES = {
  MAX_DIAS: 2,
  MAX_HORAS: 48,
  MOTIVOS: [
    'Comida en mal estado',
    'Pedido incorrecto'
  ],
  RESOLUCIONES: [
    'Cambio de producto',
    'Devolución de dinero',
    'Cambio de producto y devolución de dinero'
  ],
  ESTADOS: ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'COMPLETADA'],
  ESTADOS_REEMBOLSO: ['PENDIENTE', 'REALIZADO', 'NO_VALIDO']
};

function parseJsonSafe(val, fallback = null) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (_) {
    return fallback || val;
  }
}

function formatCliente(c) {
  if (!c) return null;
  if (!c.usuario && c.correo !== undefined) return c;
  const u = c.usuario;
  const nombre = u ? `${u.nombre || ''} ${u.apellidos || ''}`.trim() : 'Cliente General';
  return {
    idCliente: c.idCliente,
    idUsuario: c.idUsuario,
    nombre: nombre || 'Cliente General',
    documento: u?.numeroDocumento || 'N/A',
    telefono: u?.telefono || 'N/A',
    correo: u?.email || 'N/A',
    email: u?.email || 'N/A',
    direccion: c.direccion || ''
  };
}

function calculateSaleEligibility(venta) {
  if (!venta) {
    return {
      elegible: false,
      razon: 'Venta no encontrada',
      horasRestantes: 0,
      diasTranscurridos: 0
    };
  }

  const obsVentaCheck = parseJsonSafe(venta.observaciones, {});
  if (obsVentaCheck && typeof obsVentaCheck === 'object' && obsVentaCheck.esDevolucion) {
    return {
      elegible: false,
      razon: 'Esta orden corresponde a una reposición gratuita por devolución y no admite una nueva devolución.',
      horasRestantes: 0,
      diasTranscurridos: 0,
      cumplePlazo: false,
      esVentaEntregada: true
    };
  }

  const fechaVenta = venta.fechaVenta ? new Date(venta.fechaVenta) : new Date();
  const ahora = new Date();
  const diffMs = ahora.getTime() - fechaVenta.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  const horasRestantes = Math.max(0, Math.round((POLICIES.MAX_HORAS - diffHours) * 10) / 10);
  const cumplePlazo = diffHours <= POLICIES.MAX_HORAS;

  const estadoEntrega = String(venta.estadoEntrega || '').toUpperCase();
  const esVentaEntregada = estadoEntrega === 'ENTREGADO' || estadoEntrega === 'LISTO' || estadoEntrega === 'COMPLETADA' || estadoEntrega === 'EN_CAMINO';

  if (!cumplePlazo) {
    return {
      elegible: false,
      razon: `Ha superado el plazo máximo de ${POLICIES.MAX_DIAS} días (${POLICIES.MAX_HORAS} horas) estipulado en la política de la empresa.`,
      horasRestantes: 0,
      diasTranscurridos: Math.round(diffDays * 10) / 10,
      cumplePlazo: false,
      esVentaEntregada
    };
  }

  return {
    elegible: true,
    razon: 'Dentro del plazo estipulado en la política (hasta 2 días)',
    horasRestantes,
    diasTranscurridos: Math.round(diffDays * 10) / 10,
    cumplePlazo: true,
    esVentaEntregada
  };
}

function isDineroResolution(tipoResolucion) {
  return String(tipoResolucion || '').toLowerCase().includes('dinero');
}

function isCambioProductoResolution(tipoResolucion) {
  return String(tipoResolucion || '').toLowerCase().includes('cambio');
}

function extractCleanDireccion(rawDir) {
  if (!rawDir) return '';
  if (typeof rawDir === 'object') {
    return rawDir.direccion || rawDir.address || '';
  }
  const str = String(rawDir).trim();
  if (str.startsWith('{')) {
    try {
      const parsed = JSON.parse(str);
      return parsed.direccion || parsed.address || '';
    } catch (_) {
      return '';
    }
  }
  return str;
}

function extractClienteMetaObj(rawDir) {
  if (!rawDir) return {};
  if (typeof rawDir === 'object') return rawDir;
  const str = String(rawDir).trim();
  if (str.startsWith('{')) {
    try {
      return JSON.parse(str) || {};
    } catch (_) {
      return {};
    }
  }
  return {};
}

function extractVentaDeliveryContext(venta) {
  if (!venta) return null;
  const obsObj = parseJsonSafe(venta.observaciones, {});
  const metaObs = obsObj && typeof obsObj === 'object' ? obsObj : {};
  const cli = venta.cliente || {};
  const cliMeta = extractClienteMetaObj(cli.direccion);
  const cliUser = cli.usuario || venta.usuario || {};
  const nombreDerivado = cliUser.nombre
    ? `${cliUser.nombre} ${cliUser.apellidos || ''}`.trim()
    : '';
  const tipoEntrega = metaObs.tipoEntrega
    || (String(venta.tipoVenta || '').toUpperCase() === 'DOMICILIO' ? 'Domicilio' : (metaObs.mesa ? 'En Mesa' : 'Recoger'));
  const direccion = metaObs.direccion
    || extractCleanDireccion(cli.direccion)
    || (tipoEntrega === 'Domicilio' ? 'Dirección registrada del cliente' : 'Recoger en Local');
  const telefono = metaObs.telefono || metaObs.celular || metaObs.clienteTelefono || cliUser.telefono || cliMeta.telefono || '';

  return {
    clienteNombre: metaObs.clienteNombre || nombreDerivado || 'Cliente General',
    direccion,
    telefono,
    tipoEntrega,
    mesa: metaObs.mesa || null,
    empaqueParaLlevar: Boolean(metaObs.empaqueParaLlevar),
    especificaciones: metaObs.especificaciones || metaObs.nota || '',
    tipoVenta: venta.tipoVenta || (tipoEntrega === 'Domicilio' ? 'DOMICILIO' : 'PUNTO_DE_VENTA'),
    origen: venta.origen || metaObs.origen || (tipoEntrega === 'Domicilio' ? 'ONLINE' : 'PUNTO_FISICO'),
    idUsuario: venta.idUsuario || cli.idUsuario || null,
    idCliente: venta.idCliente || null
  };
}

function validateAndNormalizeDatosReembolso(rawDatos, resolucionNorm, currentUser = null) {
  const requiereReembolso = isDineroResolution(resolucionNorm);
  if (!requiereReembolso) return null;

  const parsed = parseJsonSafe(rawDatos, null);
  const datos = parsed && typeof parsed === 'object' ? parsed : {};
  const banco = String(datos.banco || '').trim();
  const bancoFinal = banco.toLowerCase() === 'otro' && datos.bancoOtro
    ? String(datos.bancoOtro).trim()
    : banco;
  const esEfectivoPos = /efectivo|caja/i.test(bancoFinal);
  const userRolLower = String(currentUser?.rol || currentUser?.rolInfo?.nombre || '').toLowerCase();
  const esStaff = Boolean(
    currentUser && (
      Number(currentUser.idRol) === 1 ||
      Number(currentUser.idRol) === 2 ||
      userRolLower.includes('admin') ||
      userRolLower.includes('vendedor') ||
      userRolLower.includes('cajero')
    )
  );

  if (!bancoFinal) {
    throw new Error('Debes indicar la entidad o medio para el reembolso (ej. Bancolombia, Nequi o Daviplata).');
  }
  if (esEfectivoPos && !esStaff) {
    throw new Error('Para solicitudes web de reembolso debes ingresar una cuenta bancaria o billetera digital (Bancolombia, Nequi, Daviplata, etc.).');
  }

  const esBilletera = /nequi|daviplata/i.test(bancoFinal);
  const tipoCuentaRaw = String(datos.tipoCuenta || '').trim();
  const tipoCuenta = esEfectivoPos
    ? 'Caja / POS'
    : (esBilletera ? 'Billetera Digital / Celular' : (tipoCuentaRaw || 'Ahorros'));

  const numeroCuentaClean = String(datos.numeroCuenta || '').replace(/[\s-]+/g, '').trim();
  if (!esEfectivoPos) {
    if (!numeroCuentaClean) {
      throw new Error('Debes ingresar el número de cuenta bancaria o número de celular para realizar el reembolso.');
    }
    if (esBilletera && !/^3\d{9}$/.test(numeroCuentaClean)) {
      throw new Error(`Para ${bancoFinal}, el número de celular debe tener 10 dígitos e iniciar en 3 (ej. 3001234567).`);
    }
    if (!esBilletera && !/^\d{6,20}$/.test(numeroCuentaClean)) {
      throw new Error('El número de cuenta bancaria debe contener solo dígitos (entre 6 y 20 caracteres).');
    }
  }

  const titularNombre = String(datos.titularNombre || '').trim();
  if (titularNombre.length < 3) {
    throw new Error('Debes ingresar el nombre completo del titular de la cuenta para el reembolso.');
  }

  const titularTipoDocumento = String(datos.titularTipoDocumento || 'CC').trim().toUpperCase();
  const titularDocumento = String(datos.titularDocumento || '').replace(/[\s.]+/g, '').trim();
  if (titularDocumento.length < 5) {
    throw new Error('Debes ingresar el número de documento del titular de la cuenta.');
  }

  return {
    banco: bancoFinal,
    tipoCuenta,
    numeroCuenta: esEfectivoPos ? 'Efectivo en Caja' : numeroCuentaClean,
    titularNombre,
    titularTipoDocumento,
    titularDocumento,
    observacionesCuenta: String(datos.observacionesCuenta || '').trim()
  };
}

function formatDevolucionRow(rawRow) {
  const plain = typeof rawRow.get === 'function' ? rawRow.get({ plain: true }) : { ...rawRow };
  plain.entregaOriginal = extractVentaDeliveryContext(plain.venta);
  if (plain.cliente) {
    plain.cliente = formatCliente(plain.cliente);
  }
  if (plain.venta && plain.venta.cliente) {
    plain.venta.cliente = formatCliente(plain.venta.cliente);
  }
  plain.productosDevueltos = parseJsonSafe(plain.productosDevueltos, []);
  plain.datosReembolso = parseJsonSafe(plain.datosReembolso, null);
  plain.estadoReembolso = plain.estadoReembolso || (isDineroResolution(plain.tipoResolucion) ? 'PENDIENTE' : null);
  plain.referenciaReembolso = plain.referenciaReembolso || null;
  plain.idVentaReemplazo = plain.idVentaReemplazo || null;
  plain.codigoVentaReemplazo = plain.codigoVentaReemplazo
    || (plain.idVentaReemplazo ? `VEN-${String(plain.idVentaReemplazo).padStart(4, '0')}` : null);
  plain.codigoDevolucion = `DEV-${String(plain.idDevolucion || plain.id || 0).padStart(4, '0')}`;
  plain.codigoVenta = plain.venta ? `VEN-${String(plain.venta.idVenta || plain.venta.id || 0).padStart(4, '0')}` : `VEN-${plain.idVenta || ''}`;
  plain.politicaInfo = calculateSaleEligibility(plain.venta);
  return plain;
}

class DevolucionService {
  static getPolicies() {
    return POLICIES;
  }

  static async getAll(filters = {}) {
    await ensureDevolucionSchemaReady();
    const where = {};
    if (filters.estado && filters.estado !== 'TODOS') {
      where.estado = filters.estado;
    }
    if (filters.motivo && filters.motivo !== 'TODOS') {
      where.motivo = filters.motivo;
    }
    if (filters.tipoResolucion && filters.tipoResolucion !== 'TODOS') {
      where.tipoResolucion = filters.tipoResolucion;
    }
    if (filters.idCliente) {
      where.idCliente = filters.idCliente;
    }
    if (filters.idVenta) {
      where.idVenta = filters.idVenta;
    }

    const devoluciones = await Devolucion.findAll({
      where,
      include: [
        {
          model: Venta,
          as: 'venta',
          include: [
            {
              model: Cliente,
              as: 'cliente',
              include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono', 'numeroDocumento'], required: false }]
            },
            { model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] },
            {
              model: DetalleVentaProducto,
              as: 'detalles',
              include: [
                {
                  model: Variante,
                  as: 'variante',
                  include: [{ model: Product, as: 'producto', attributes: ['idProducto', 'nombre', 'precio', 'imagen'] }]
                }
              ]
            }
          ]
        },
        {
          model: Cliente,
          as: 'cliente',
          include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono', 'numeroDocumento'], required: false }]
        },
        {
          model: User,
          as: 'usuarioResolucion',
          attributes: ['idUsuario', 'nombre', 'apellidos', 'email']
        }
      ],
      order: [['idDevolucion', 'DESC']]
    });

    return (devoluciones || []).map(d => {
      try {
        const plain = typeof d.get === 'function' ? d.get({ plain: true }) : d;
        if (plain.cliente) {
          plain.cliente = formatCliente(plain.cliente);
        }
        if (plain.venta && plain.venta.cliente) {
          plain.venta.cliente = formatCliente(plain.venta.cliente);
        }
        plain.productosDevueltos = parseJsonSafe(plain.productosDevueltos, []);
        plain.codigoDevolucion = `DEV-${String(plain.idDevolucion || plain.id || 0).padStart(4, '0')}`;
        plain.codigoVenta = plain.venta ? `VEN-${String(plain.venta.idVenta || plain.venta.id || 0).padStart(4, '0')}` : `VEN-${plain.idVenta || ''}`;
        Object.assign(plain, formatDevolucionRow(d));
        return plain;
      } catch (err) {
        console.warn('Error formateando fila de devolución:', err);
        return typeof d.get === 'function' ? d.get({ plain: true }) : d;
      }
    });
  }

  static async getById(id) {
    await ensureDevolucionSchemaReady();
    const d = await Devolucion.findByPk(id, {
      include: [
        {
          model: Venta,
          as: 'venta',
          include: [
            {
              model: Cliente,
              as: 'cliente',
              include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono', 'numeroDocumento'], required: false }]
            },
            { model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] },
            {
              model: DetalleVentaProducto,
              as: 'detalles',
              include: [
                {
                  model: Variante,
                  as: 'variante',
                  include: [{ model: Product, as: 'producto', attributes: ['idProducto', 'nombre', 'precio', 'imagen'] }]
                }
              ]
            }
          ]
        },
        {
          model: Cliente,
          as: 'cliente',
          include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono', 'numeroDocumento'], required: false }]
        },
        {
          model: User,
          as: 'usuarioResolucion',
          attributes: ['idUsuario', 'nombre', 'apellidos', 'email']
        }
      ]
    });

    if (!d) return null;

    const plain = d.get({ plain: true });
    plain.cliente = formatCliente(plain.cliente);
    if (plain.venta && plain.venta.cliente) {
      plain.venta.cliente = formatCliente(plain.venta.cliente);
    }
    plain.productosDevueltos = parseJsonSafe(plain.productosDevueltos, []);
    plain.codigoDevolucion = `DEV-${String(plain.idDevolucion).padStart(4, '0')}`;
    plain.codigoVenta = plain.venta ? `VEN-${String(plain.venta.idVenta).padStart(4, '0')}` : `VEN-${plain.idVenta}`;
    return formatDevolucionRow(d);
    return plain;
  }

  static async getByCliente(idCliente, idUsuario = null) {
    let resolvedClienteId = idCliente;
    if (!resolvedClienteId && idUsuario) {
      const cliente = await Cliente.findOne({ where: { idUsuario } });
      if (cliente) {
        resolvedClienteId = cliente.idCliente;
      }
    }

    if (!resolvedClienteId) {
      return [];
    }

    return this.getAll({ idCliente: resolvedClienteId });
  }

  static async getStats() {
    await ensureDevolucionSchemaReady();
    const devoluciones = await Devolucion.findAll({
      attributes: ['estado', 'valorDevuelto']
    });

    let total = devoluciones.length;
    let pendientes = 0;
    let aprobadas = 0;
    let completadas = 0;
    let rechazadas = 0;
    let totalValorDevuelto = 0;

    for (const d of devoluciones) {
      const est = String(d.estado || '').toUpperCase();
      if (est === 'PENDIENTE') pendientes++;
      else if (est === 'APROBADA') {
        aprobadas++;
        totalValorDevuelto += Number(d.valorDevuelto || 0);
      } else if (est === 'COMPLETADA') {
        completadas++;
        totalValorDevuelto += Number(d.valorDevuelto || 0);
      } else if (est === 'RECHAZADA') {
        rechazadas++;
      }
    }

    return {
      total,
      pendientes,
      aprobadas,
      completadas,
      rechazadas,
      totalValorDevuelto: Math.round(totalValorDevuelto * 100) / 100
    };
  }

  static async checkVentaElegibilidad(idVenta) {
    await ensureDevolucionSchemaReady();
    const venta = await Venta.findByPk(idVenta, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono', 'numeroDocumento'], required: false }]
        },
        {
          model: DetalleVentaProducto,
          as: 'detalles',
          include: [
            {
              model: Variante,
              as: 'variante',
              include: [{ model: Product, as: 'producto', attributes: ['idProducto', 'nombre', 'precio', 'imagen'] }]
            }
          ]
        },
        {
          model: Devolucion,
          as: 'devoluciones',
          attributes: ['idDevolucion', 'estado', 'motivo', 'fecha', 'valorDevuelto']
        }
      ]
    });

    if (!venta) {
      return {
        existe: false,
        elegible: false,
        mensaje: 'La venta especificada no existe.'
      };
    }

    const eligibility = calculateSaleEligibility(venta);
    const plainVenta = venta.get({ plain: true });

    // Extraer lista resumida de productos disponibles para devolución
    const productos = (plainVenta.detalles || []).map(det => {
      const nombre = det.variante?.producto?.nombre || 'Producto';
      const nombreVariante = det.variante?.nombre || '';
      const nombreCompleto = nombreVariante && nombreVariante !== 'Normal' && nombreVariante !== 'Estándar'
        ? `${nombre} (${nombreVariante})`
        : nombre;
      return {
        idDetalleVenta: det.idDetalleVenta,
        idVariante: det.idVariante,
        idProducto: det.variante?.producto?.idProducto,
        nombre: nombreCompleto,
        cantidadOriginal: det.cantidad,
        precioUnitario: Number(det.precioUnitario || 0),
        subtotal: Number(det.subtotal || 0),
        imagen: det.variante?.producto?.imagen || null
      };
    });

    return {
      existe: true,
      idVenta: venta.idVenta,
      codigoVenta: `VEN-${String(venta.idVenta).padStart(4, '0')}`,
      fechaVenta: venta.fechaVenta,
      totalVenta: Number(venta.total || 0),
      cliente: formatCliente(plainVenta.cliente),
      elegible: eligibility.elegible,
      politicaInfo: eligibility,
      productos,
      devolucionesPrevias: plainVenta.devoluciones || []
    };
  }

  static async create(data, currentUser = null) {
    await ensureDevolucionSchemaReady();
    const {
      idVenta,
      idCliente,
      motivo,
      tipoResolucion,
      descripcion,
      evidencia,
      productosDevueltos,
      valorDevuelto
    } = data;

    if (!idVenta) {
      throw new Error('Debe especificar la venta asociada a la devolución.');
    }

    const venta = await Venta.findByPk(idVenta, {
      include: [
        { model: Cliente, as: 'cliente' },
        {
          model: DetalleVentaProducto,
          as: 'detalles',
          include: [
            {
              model: Variante,
              as: 'variante',
              include: [{ model: Product, as: 'producto' }]
            }
          ]
        }
      ]
    });

    if (!venta) {
      throw new Error(`La venta #${idVenta} no existe.`);
    }

    // Validación de la política de plazo (máximo 2 días)
    const eligibility = calculateSaleEligibility(venta);
    if (!eligibility.elegible) {
      throw new Error(`No es posible registrar la devolución: ${eligibility.razon}`);
    }

    // Verificar si ya existe una solicitud de devolución activa para esta venta
    const devExistente = await Devolucion.findOne({
      where: {
        idVenta,
        estado: { [Op.in]: ['PENDIENTE', 'APROBADA'] }
      }
    });
    if (devExistente) {
      throw new Error(`Ya existe una solicitud de devolución en trámite (${devExistente.estado}) para esta venta.`);
    }

    // Validación de motivos según política de la empresa
    const motivoNorm = String(motivo || '').trim();
    const esMotivoValido = POLICIES.MOTIVOS.some(
      m => m.toLowerCase() === motivoNorm.toLowerCase()
    );
    if (!esMotivoValido) {
      throw new Error(`El motivo "${motivo}" no está permitido por la política. Motivos válidos: ${POLICIES.MOTIVOS.join(', ')}.`);
    }

    // Validación de tipo de resolución según política
    const resolucionNorm = String(tipoResolucion || POLICIES.RESOLUCIONES[0]).trim();
    const esResolucionValida = POLICIES.RESOLUCIONES.some(
      r => r.toLowerCase() === resolucionNorm.toLowerCase()
    );
    if (!esResolucionValida) {
      throw new Error(`Tipo de resolución inválido. Opciones válidas: ${POLICIES.RESOLUCIONES.join(', ')}.`);
    }

    // Resolver cliente
    let finalClienteId = idCliente || venta.idCliente;
    if (!finalClienteId && currentUser?.idUsuario) {
      const clienteEncontrado = await Cliente.findOne({ where: { idUsuario: currentUser.idUsuario } });
      if (clienteEncontrado) finalClienteId = clienteEncontrado.idCliente;
    }

    // Validar y estructurar productos devueltos
    let productosParsed = [];
    if (typeof productosDevueltos === 'string') {
      productosParsed = parseJsonSafe(productosDevueltos, []);
    } else if (Array.isArray(productosDevueltos)) {
      productosParsed = productosDevueltos;
    }

    if (!Array.isArray(productosParsed) || productosParsed.length === 0) {
      throw new Error('Debe especificar al menos un producto y su cantidad a devolver.');
    }

    // Validar cantidades contra los detalles de la venta
    let montoCalculado = 0;
    const detallesVenta = venta.detalles || [];

    for (const item of productosParsed) {
      const cant = Number(item.cantidad || 0);
      if (cant <= 0) {
        throw new Error(`La cantidad a devolver para ${item.nombre || 'el producto'} debe ser mayor a 0.`);
      }

      // Buscar coincidencia en detalles de la venta
      const detVenta = detallesVenta.find(d => Number(d.idVariante) === Number(item.idVariante));
      if (detVenta && cant > Number(detVenta.cantidad)) {
        throw new Error(`La cantidad a devolver (${cant}) excede la cantidad comprada (${detVenta.cantidad}) para el producto.`);
      }

      const precioUnit = Number(item.precioUnitario || detVenta?.precioUnitario || 0);
      item.precioUnitario = precioUnit;
      item.subtotal = Number((cant * precioUnit).toFixed(2));
      montoCalculado += item.subtotal;
    }

    const finalValorDevuelto = valorDevuelto !== undefined && valorDevuelto !== null
      ? Number(valorDevuelto)
      : (isDineroResolution(resolucionNorm) ? montoCalculado : 0);

    const datosReembolsoObj = validateAndNormalizeDatosReembolso(data.datosReembolso, resolucionNorm, currentUser);
    const estadoReembolsoInicial = isDineroResolution(resolucionNorm) ? 'PENDIENTE' : null;

    const nuevaDevolucion = await Devolucion.create({
      idVenta,
      idCliente: finalClienteId,
      motivo: motivoNorm,
      tipoResolucion: resolucionNorm,
      productosDevueltos: JSON.stringify(productosParsed),
      valorDevuelto: finalValorDevuelto,
      datosReembolso: datosReembolsoObj ? JSON.stringify(datosReembolsoObj) : null,
      estadoReembolso: estadoReembolsoInicial,
      descripcion: descripcion || null,
      evidencia: evidencia || null,
      fecha: new Date(),
      estado: 'PENDIENTE'
    });

    // Registrar en trazabilidad
    try {
      await TrazabilidadService.create({
        tipo: 'Solicitud Devolución',
        entidadNombre: `Devolución DEV-${String(nuevaDevolucion.idDevolucion).padStart(4, '0')}`,
        detalle: `Solicitud de devolución registrada para Venta VEN-${String(idVenta).padStart(4, '0')} (${motivoNorm} - ${resolucionNorm})`,
        motivo: motivoNorm,
        usuarioId: currentUser?.idUsuario || null
      });
    } catch (err) {
      console.warn('Advertencia al registrar trazabilidad de devolución:', err.message);
    }

    return this.getById(nuevaDevolucion.idDevolucion);
  }

  static async _crearOrdenReemplazoParaDevolucion(devolucion, currentUser = null) {
    const VentaService = require('./ventaService');
    const { DetalleVentaAdicion, Adicion } = require('../../persistence/models');

    const ventaOriginal = await Venta.findByPk(devolucion.idVenta, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
          include: [
            {
              model: User,
              as: 'usuario',
              attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono', 'numeroDocumento'],
              required: false
            }
          ]
        },
        {
          model: User,
          as: 'usuario',
          attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono'],
          required: false
        },
        {
          model: DetalleVentaProducto,
          as: 'detalles',
          include: [
            {
              model: Variante,
              as: 'variante',
              include: [{ model: Product, as: 'producto', attributes: ['idProducto', 'nombre', 'precio'] }]
            },
            {
              model: DetalleVentaAdicion,
              as: 'adiciones',
              include: [{ model: Adicion, as: 'adicion' }],
              required: false
            }
          ]
        }
      ]
    });

    if (!ventaOriginal) {
      throw new Error(`No se encontró la venta original #${devolucion.idVenta} para generar la reposición.`);
    }

    const plainVenta = ventaOriginal.get({ plain: true });
    const deliveryCtx = extractVentaDeliveryContext(plainVenta);
    const origObs = parseJsonSafe(plainVenta.observaciones, {});
    const obsProductos = Array.isArray(origObs?.productos) ? origObs.productos : [];
    const devProductos = parseJsonSafe(devolucion.productosDevueltos, []);

    const codigoDev = `DEV-${String(devolucion.idDevolucion).padStart(4, '0')}`;
    const codigoVen = origObs?.codigoPedido || origObs?.numeroVenta || `VEN-${String(ventaOriginal.idVenta).padStart(4, '0')}`;

    const sourceItems = Array.isArray(devProductos) && devProductos.length > 0
      ? devProductos
      : (plainVenta.detalles || []).map(d => ({
          idDetalleVenta: d.idDetalleVenta,
          idVariante: d.idVariante,
          idProducto: d.variante?.idProducto || d.variante?.producto?.idProducto,
          nombre: d.variante?.producto?.nombre || 'Producto',
          cantidad: Number(d.cantidad) || 1
        }));

    const detallesReemplazo = sourceItems.map((item) => {
      const detOrig = (plainVenta.detalles || []).find(
        (d) =>
          (item.idDetalleVenta && Number(d.idDetalleVenta) === Number(item.idDetalleVenta)) ||
          (item.idVariante && Number(d.idVariante) === Number(item.idVariante)) ||
          (item.idProducto && Number(d.variante?.idProducto) === Number(item.idProducto))
      );
      const obsMatch = obsProductos.find(
        (p) =>
          (item.idVariante && Number(p.idVariante) === Number(item.idVariante)) ||
          String(p.nombre || '').trim().toLowerCase() === String(item.nombre || '').trim().toLowerCase()
      );

      let adiciones = [];
      if (Array.isArray(obsMatch?.adiciones) && obsMatch.adiciones.length > 0) {
        adiciones = obsMatch.adiciones;
      } else if (Array.isArray(detOrig?.adiciones) && detOrig.adiciones.length > 0) {
        adiciones = detOrig.adiciones.map((a) => ({
          idAdicion: a.idAdicion || a.adicion?.idAdicion,
          nombre: a.adicion?.nombre || a.nombre || 'Adición',
          precio: 0,
          cantidad: Number(a.cantidad) || 1
        }));
      }

      return {
        idVariante: item.idVariante || detOrig?.idVariante || obsMatch?.idVariante || null,
        idProducto: item.idProducto || detOrig?.variante?.idProducto || detOrig?.variante?.producto?.idProducto || obsMatch?.idProducto || null,
        nombre: item.nombre || detOrig?.variante?.producto?.nombre || obsMatch?.nombre || 'Producto',
        cantidad: Math.max(1, Number(item.cantidad) || 1),
        precioUnitario: 0,
        subtotal: 0,
        observacion: `Reposición por devolución ${codigoDev}${obsMatch?.observaciones ? ` (${obsMatch.observaciones})` : ''}`,
        ingredientesRemovidos: Array.isArray(obsMatch?.ingredientesRemovidos) ? obsMatch.ingredientesRemovidos : [],
        personalizaciones: (obsMatch?.personalizaciones && typeof obsMatch.personalizaciones === 'object') ? obsMatch.personalizaciones : undefined,
        adiciones
      };
    });

    const specParts = [
      `DEVOLUCIÓN ${codigoDev} (Pedido original ${codigoVen})`,
      `Cambio de alimento: ${devolucion.motivo}`
    ];
    if (deliveryCtx.especificaciones) {
      specParts.push(`Obs. originales: ${deliveryCtx.especificaciones}`);
    }

    const ordenReemplazo = await VentaService.create({
      idUsuario: deliveryCtx.idUsuario || currentUser?.idUsuario,
      idCliente: devolucion.idCliente || deliveryCtx.idCliente || null,
      aprobadoPorUsuarioId: currentUser?.idUsuario || null,
      esDevolucion: true,
      idDevolucionAsociada: devolucion.idDevolucion,
      codigoDevolucionAsociada: codigoDev,
      idVentaOriginal: ventaOriginal.idVenta,
      codigoVentaOriginal: codigoVen,
      tipoVenta: deliveryCtx.tipoVenta,
      origen: deliveryCtx.origen,
      tipoEntrega: deliveryCtx.tipoEntrega,
      mesa: deliveryCtx.mesa,
      empaqueParaLlevar: deliveryCtx.empaqueParaLlevar,
      direccion: deliveryCtx.direccion,
      telefono: deliveryCtx.telefono,
      clienteNombre: deliveryCtx.clienteNombre,
      metodoPago: 'Devolución / Reposición',
      estadoPago: 'Reposición sin costo',
      estadoEntrega: 'PENDIENTE',
      estadoAprobacion: 'APROBADO',
      subtotal: 0,
      descuentoAplicado: 0,
      total: 0,
      especificaciones: specParts.join(' · '),
      detalles: detallesReemplazo
    });

    return { ordenReemplazo, deliveryCtx, codigoDev, codigoVen };
  }

  static async updateEstado(idDevolucion, updateData, currentUser = null) {
    await ensureDevolucionSchemaReady();
    const devolucion = await Devolucion.findByPk(idDevolucion, {
      include: [{ model: Venta, as: 'venta' }]
    });

    if (!devolucion) {
      throw new Error(`Devolución #${idDevolucion} no encontrada.`);
    }

    const { estado, motivoRechazo, accionRealizada, valorDevuelto, tipoResolucion, estadoReembolso, referenciaReembolso } = updateData;

    const estadoNorm = String(estado || '').toUpperCase().trim();
    if (!POLICIES.ESTADOS.includes(estadoNorm)) {
      throw new Error(`Estado inválido. Valores permitidos: ${POLICIES.ESTADOS.join(', ')}.`);
    }

    if (estadoNorm === 'RECHAZADA' && !motivoRechazo) {
      throw new Error('Debe especificar el motivo del rechazo de la devolución.');
    }

    let estadoReembolsoNorm = undefined;
    if (estadoReembolso !== undefined && estadoReembolso !== null && String(estadoReembolso).trim() !== '') {
      estadoReembolsoNorm = String(estadoReembolso).toUpperCase().trim();
      if (!POLICIES.ESTADOS_REEMBOLSO.includes(estadoReembolsoNorm)) {
        throw new Error(`Estado de reembolso inválido. Valores permitidos: ${POLICIES.ESTADOS_REEMBOLSO.join(', ')}.`);
      }
      if (estadoReembolsoNorm === 'NO_VALIDO' && !String(motivoRechazo || '').trim() && !String(referenciaReembolso || '').trim()) {
        throw new Error('Debe indicar el motivo por el cual el reembolso o los datos bancarios no son válidos.');
      }
    }

    devolucion.estado = estadoNorm;
    devolucion.fechaResolucion = new Date();
    devolucion.usuarioResolucionId = currentUser?.idUsuario || null;

    if (motivoRechazo !== undefined) devolucion.motivoRechazo = motivoRechazo;
    if (accionRealizada !== undefined) devolucion.accionRealizada = accionRealizada;
    if (valorDevuelto !== undefined) devolucion.valorDevuelto = Number(valorDevuelto);
    if (tipoResolucion !== undefined) devolucion.tipoResolucion = tipoResolucion;
    if (estadoReembolsoNorm !== undefined) devolucion.estadoReembolso = estadoReembolsoNorm;
    if (referenciaReembolso !== undefined) devolucion.referenciaReembolso = String(referenciaReembolso || '').trim() || null;

    if (estadoNorm === 'RECHAZADA' && isDineroResolution(devolucion.tipoResolucion) && devolucion.estadoReembolso !== 'REALIZADO' && !estadoReembolsoNorm) {
      devolucion.estadoReembolso = 'NO_VALIDO';
    }

    const resolucionFinal = devolucion.tipoResolucion;
    if ((estadoNorm === 'APROBADA' || estadoNorm === 'COMPLETADA') && isCambioProductoResolution(resolucionFinal) && !devolucion.idVentaReemplazo) {
      const { ordenReemplazo, deliveryCtx, codigoDev } = await this._crearOrdenReemplazoParaDevolucion(devolucion, currentUser);
      const codReemplazo = ordenReemplazo?.numeroVenta || (ordenReemplazo?.idVenta ? `VEN-${String(ordenReemplazo.idVenta).padStart(4, '0')}` : null);
      devolucion.idVentaReemplazo = ordenReemplazo?.idVenta || ordenReemplazo?.id || null;
      devolucion.codigoVentaReemplazo = codReemplazo;

      const resumenReposicion = `Orden de reposición generada (${codReemplazo || 'DEVOLUCIÓN'}) para ${deliveryCtx.clienteNombre} · ${deliveryCtx.tipoEntrega}${deliveryCtx.direccion ? ` (${deliveryCtx.direccion})` : ''}`;
      if (!devolucion.accionRealizada) {
        devolucion.accionRealizada = resumenReposicion;
      } else if (!String(devolucion.accionRealizada).includes(codReemplazo || codigoDev)) {
        devolucion.accionRealizada = `${devolucion.accionRealizada} | ${resumenReposicion}`;
      }
    }

    if (estadoReembolsoNorm === 'REALIZADO' && !devolucion.accionRealizada) {
      const refText = devolucion.referenciaReembolso ? ` (Ref: ${devolucion.referenciaReembolso})` : '';
      devolucion.accionRealizada = `Reembolso confirmado y ejecutado${refText}`;
    } else if (estadoReembolsoNorm === 'NO_VALIDO' && !devolucion.accionRealizada) {
      devolucion.accionRealizada = `Reembolso marcado como no válido: ${devolucion.motivoRechazo || devolucion.referenciaReembolso || 'Datos inválidos'}`;
    }

    await devolucion.save();

    // Registrar en trazabilidad
    try {
      const codigoDev = `DEV-${String(idDevolucion).padStart(4, '0')}`;
      const codigoVen = `VEN-${String(devolucion.idVenta).padStart(4, '0')}`;
      let detTraz = `Devolución ${codigoDev} actualizada a estado: ${estadoNorm}`;
      if (estadoNorm === 'RECHAZADA') {
        detTraz += `. Motivo: ${motivoRechazo}`;
      } else if (estadoNorm === 'COMPLETADA' && accionRealizada) {
        detTraz += `. Acción: ${accionRealizada}`;
      }

      await TrazabilidadService.create({
        tipo: `Devolución ${estadoNorm}`,
        entidadNombre: `Devolución ${codigoDev}`,
        detalle: `${detTraz} (Venta ${codigoVen})`,
        motivo: estadoNorm === 'RECHAZADA' ? motivoRechazo : devolucion.motivo,
        usuarioId: currentUser?.idUsuario || null
      });
    } catch (err) {
      console.warn('Advertencia al registrar trazabilidad de actualización de devolución:', err.message);
    }

    return this.getById(idDevolucion);
  }
}

DevolucionService.validateAndNormalizeDatosReembolso = validateAndNormalizeDatosReembolso;
DevolucionService.extractVentaDeliveryContext = extractVentaDeliveryContext;

module.exports = DevolucionService;
