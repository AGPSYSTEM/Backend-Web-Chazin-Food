const { Devolucion, Venta, DetalleVentaProducto, Variante, Product, Cliente, User, sequelize } = require('../../persistence/models');
const TrazabilidadService = require('./trazabilidadService');
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
  ESTADOS: ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'COMPLETADA']
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

class DevolucionService {
  static getPolicies() {
    return POLICIES;
  }

  static async getAll(filters = {}) {
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
        plain.politicaInfo = calculateSaleEligibility(plain.venta);
        return plain;
      } catch (err) {
        console.warn('Error formateando fila de devolución:', err);
        return typeof d.get === 'function' ? d.get({ plain: true }) : d;
      }
    });
  }

  static async getById(id) {
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
    plain.politicaInfo = calculateSaleEligibility(plain.venta);
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
      const rawProdName = det.variante?.producto?.nombre || '';
      const rawVarName = det.variante?.nombre || '';
      const isSystemZero = Number(det.idVariante) === 0 || rawProdName.startsWith('__SISTEMA') || rawVarName.startsWith('__SISTEMA');
      const fallbackObs = det.observaciones && !String(det.observaciones).startsWith('{') ? det.observaciones : 'Producto eliminado';
      const nombre = !isSystemZero && rawProdName ? rawProdName : fallbackObs;
      const nombreVariante = !isSystemZero ? rawVarName : '';
      const nombreCompleto = nombreVariante && nombreVariante !== 'Normal' && nombreVariante !== 'Estándar'
        ? `${nombre} (${nombreVariante})`
        : nombre;
      return {
        idDetalleVenta: det.idDetalleVenta,
        idVariante: det.idVariante,
        idProducto: isSystemZero ? null : det.variante?.producto?.idProducto,
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
      : (resolucionNorm.includes('Devolución de dinero') ? montoCalculado : 0);

    const nuevaDevolucion = await Devolucion.create({
      idVenta,
      idCliente: finalClienteId,
      motivo: motivoNorm,
      tipoResolucion: resolucionNorm,
      productosDevueltos: JSON.stringify(productosParsed),
      valorDevuelto: finalValorDevuelto,
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

  static async updateEstado(idDevolucion, updateData, currentUser = null) {
    const devolucion = await Devolucion.findByPk(idDevolucion, {
      include: [{ model: Venta, as: 'venta' }]
    });

    if (!devolucion) {
      throw new Error(`Devolución #${idDevolucion} no encontrada.`);
    }

    const { estado, motivoRechazo, accionRealizada, valorDevuelto, tipoResolucion } = updateData;

    const estadoNorm = String(estado || '').toUpperCase().trim();
    if (!POLICIES.ESTADOS.includes(estadoNorm)) {
      throw new Error(`Estado inválido. Valores permitidos: ${POLICIES.ESTADOS.join(', ')}.`);
    }

    if (estadoNorm === 'RECHAZADA' && !motivoRechazo) {
      throw new Error('Debe especificar el motivo del rechazo de la devolución.');
    }

    devolucion.estado = estadoNorm;
    devolucion.fechaResolucion = new Date();
    devolucion.usuarioResolucionId = currentUser?.idUsuario || null;

    if (motivoRechazo !== undefined) devolucion.motivoRechazo = motivoRechazo;
    if (accionRealizada !== undefined) devolucion.accionRealizada = accionRealizada;
    if (valorDevuelto !== undefined) devolucion.valorDevuelto = Number(valorDevuelto);
    if (tipoResolucion !== undefined) devolucion.tipoResolucion = tipoResolucion;

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

module.exports = DevolucionService;
