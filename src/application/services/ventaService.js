const { Venta, DetalleVentaProducto, Cliente, User, Role } = require('../../persistence/models');

class VentaService {
  static formatVenta(v) {
    let obsData = {};
    if (v.observaciones) {
      try {
        obsData = typeof v.observaciones === 'string' && v.observaciones.startsWith('{')
          ? JSON.parse(v.observaciones)
          : { nota: v.observaciones };
      } catch (e) {
        obsData = { nota: v.observaciones };
      }
    }

    const clienteObj = v.cliente || {};
    const clienteUser = clienteObj.usuario || clienteObj.clienteInfo || v.usuario || {};
    
    // Dynamically derive client name from DB relationships without hardcoded strings
    const clienteNombre = obsData.clienteNombre || 
      (clienteUser.nombre ? `${clienteUser.nombre} ${clienteUser.apellidos || ''}`.trim() : null) ||
      (v.idCliente ? `Cliente #${v.idCliente}` : "Cliente General");

    const numeroVenta = obsData.codigoPedido || obsData.numeroVenta || `VEN-${String(v.idVenta).padStart(4, '0')}`;
    
    // Dynamic format of date/time in local Colombia timezone (Formato 12 horas con AM/PM)
    let horario = null;
    let fechaFormatted = null;
    if (v.fechaVenta) {
      const d = new Date(v.fechaVenta);
      if (!isNaN(d.getTime())) {
        horario = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Bogota' });
        fechaFormatted = d.toLocaleDateString('es-CO', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' });
      }
    }
    if (!horario && obsData.horario) {
      horario = obsData.horario;
    }
    horario = horario || "12:30 PM";

    const tipoEntrega = obsData.tipoEntrega || (
      (v.observaciones || "").toLowerCase().includes("recoger") || (v.observaciones || "").toLowerCase().includes("para llevar") || (v.observaciones || "").toLowerCase().includes("llevar")
        ? "Recoger"
        : "Domicilio"
    );
    const metodoPago = obsData.metodoPago || (
      (v.observaciones || "").toLowerCase().includes("tarjeta")
        ? "Tarjeta"
        : (v.observaciones || "").toLowerCase().includes("transfer") || (v.observaciones || "").toLowerCase().includes("nequi") || (v.observaciones || "").toLowerCase().includes("davi")
          ? "Transferencia"
          : "Efectivo"
    );
    const estadoPago = obsData.estadoPago || "Pagado";

    // Dynamic products from db details or order metadata
    let productos = [];
    if (Array.isArray(obsData.productos) && obsData.productos.length > 0) {
      productos = obsData.productos.map(p => {
        const itemAdds = (p.adiciones || []).map(a => {
          if (typeof a === 'object' && a !== null) {
            return {
              idAdicion: a.idAdicion || a.id,
              nombre: a.nombre,
              precio: Number(a.precio || 0),
              cantidad: Number(a.cantidad || 1)
            };
          }
          return {
            nombre: String(a),
            precio: 0,
            cantidad: 1
          };
        });

        const addsSum = itemAdds.reduce((s, a) => s + (Number(a.precio || 0) * Number(a.cantidad || 1)), 0);
        const pQty = Number(p.cantidad || 1);
        const pUnit = Number(p.precioUnitario || p.precio || 0);
        const pTot = Number(p.total || 0) > 0 ? Number(p.total) : (pUnit + addsSum) * pQty;

        return {
          id: p.id || p.idVariante || p.idDetalleVenta,
          idVariante: p.idVariante || p.id,
          nombre: p.nombre || p.nombreProducto || "Producto",
          cantidad: pQty,
          precioUnitario: pUnit,
          total: pTot,
          observaciones: p.observaciones || p.observacion || p.especificaciones || p.nota || "",
          adiciones: itemAdds
        };
      });
    } else if (v.detalles && v.detalles.length > 0) {
      productos = v.detalles.map(d => {
        let pName = d.variante?.producto?.nombre || d.variante?.nombre || null;
        let pAdiciones = [];
        let pObs = "";

        if (d.adiciones && d.adiciones.length > 0) {
          pAdiciones = d.adiciones.map(da => ({
            idAdicion: da.idAdicion,
            nombre: da.adicion?.nombre || `Adición #${da.idAdicion}`,
            precio: parseFloat(da.precioUnitario || da.adicion?.precio || 0),
            cantidad: Number(da.cantidad || 1)
          }));
        }

        if (d.observaciones) {
          try {
            if (typeof d.observaciones === 'string' && d.observaciones.startsWith('{')) {
              const parsedObs = JSON.parse(d.observaciones);
              pName = pName || parsedObs.nombre || parsedObs.nombreProducto;
              pObs = parsedObs.observaciones || parsedObs.observacion || parsedObs.nota || "";
              if (pAdiciones.length === 0 && Array.isArray(parsedObs.adiciones)) {
                pAdiciones = parsedObs.adiciones.map(a => typeof a === 'object' ? a : { nombre: String(a), precio: 0, cantidad: 1 });
              }
            } else {
              pObs = d.observaciones;
            }
          } catch (e) {
            pObs = d.observaciones;
          }
        }

        const addsSum = pAdiciones.reduce((s, a) => s + (Number(a.precio || 0) * Number(a.cantidad || 1)), 0);
        const pQty = Number(d.cantidad || 1);
        const pUnit = parseFloat(d.precioUnitario || 0);
        const pTot = parseFloat(d.subtotal || 0) > 0 ? parseFloat(d.subtotal) : (pUnit + addsSum) * pQty;

        return {
          id: d.idDetalleVenta || d.idVariante,
          idVariante: d.idVariante,
          nombre: pName || `Producto #${d.idVariante}`,
          cantidad: pQty,
          precioUnitario: pUnit,
          total: pTot,
          observaciones: pObs,
          adiciones: pAdiciones
        };
      });
    } else {
      // Sin detalles reales en BD: devolver array vacío (no inventar productos ficticios)
      productos = [];
    }

    let subtotal = parseFloat(v.subtotal) || 0;
    let total = parseFloat(v.total) || 0;
    let descuentoAplicado = parseFloat(v.descuentoAplicado || 0);

    // Si total o subtotal está en 0 en base de datos, calcular de productos o detalles
    if ((total === 0 || subtotal === 0) && Array.isArray(productos) && productos.length > 0) {
      subtotal = productos.reduce((acc, p) => acc + Number(p.total || 0), 0);
      descuentoAplicado = descuentoAplicado || (subtotal * (Number(obsData.descuentoPorcentaje || 0) / 100));
      total = Math.max(0, subtotal - descuentoAplicado);
    }

    // Dynamic extraction of client fidelity
    let clientMeta = {};
    if (clienteObj && clienteObj.direccion) {
      try {
        if (clienteObj.direccion.trim().startsWith('{')) {
          clientMeta = JSON.parse(clienteObj.direccion);
        }
      } catch (e) {
        clientMeta = {};
      }
    }
    const FidelidadService = require('./fidelidadService');
    const fidelidadInfo = FidelidadService.evaluarEstadoFidelidad(clientMeta.fidelidad || {
      tipo: clientMeta.tipo || (clienteObj.idUsuario ? 'Nuevo' : 'Mostrador'),
      comprasCiclo: clientMeta.ciclo !== undefined ? Number(clientMeta.ciclo) : (clientMeta.comprasCiclo || 0),
      comprasTotales: clientMeta.comprasTotales || 0,
      fechaInicioNivel: clientMeta.inicio || clientMeta.fechaInicioNivel || null,
      fechaVencimientoNivel: clientMeta.vence || clientMeta.fechaVencimientoNivel || null
    });

    // Calculate clear discount percentage
    let descuentoPorcentaje = obsData.descuentoPorcentaje || fidelidadInfo.descuentoPorcentaje || 0;
    if (descuentoAplicado > 0 && subtotal > 0) {
      descuentoPorcentaje = Math.round((descuentoAplicado / subtotal) * 100);
    } else if (subtotal > total && subtotal > 0) {
      descuentoAplicado = subtotal - total;
      descuentoPorcentaje = Math.round((descuentoAplicado / subtotal) * 100);
    }

    const iva = Math.round(subtotal * 0.19);
    const precioOriginal = subtotal > total ? subtotal : (total + descuentoAplicado);
    const montoDescuento = descuentoAplicado;

    let estadoStr = 'Pendiente';
    if (v.estadoEntrega === 'PREPARANDO') estadoStr = 'En Preparación';
    else if (v.estadoEntrega === 'LISTO') estadoStr = 'Listo';
    else if (v.estadoEntrega === 'ENTREGADO') estadoStr = 'Completada';
    else if (v.estadoEntrega === 'CANCELADO') estadoStr = 'Anulada';
    else if (v.estadoEntrega) estadoStr = v.estadoEntrega;

    const responsable = v.usuario ? {
      idUsuario: v.usuario.idUsuario,
      nombre: `${v.usuario.nombre} ${v.usuario.apellidos || ''}`.trim(),
      email: v.usuario.email,
      rol: v.usuario.rolInfo?.nombre || (v.usuario.idRol === 1 ? 'Administrador' : v.usuario.idRol === 2 ? 'Vendedor' : 'Empleado'),
      tieneCuenta: true,
      estado: v.usuario.estado || 'Activo'
    } : {
      idUsuario: null,
      nombre: 'Sistema / Online',
      rol: 'Online',
      tieneCuenta: false,
      estado: 'Activo'
    };

    return {
      id: v.idVenta,
      idVenta: v.idVenta,
      idDescuento: v.idDescuento || null,
      tipoVenta: v.tipoVenta || (tipoEntrega === 'Domicilio' ? 'DOMICILIO' : 'PUNTO_DE_VENTA'),
      numeroVenta,
      codigoPedido: numeroVenta,
      clienteNombre,
      cliente: clienteNombre,
      idCliente: v.idCliente,
      idUsuario: v.idUsuario,
      responsable,
      clienteFidelidad: {
        tipo: fidelidadInfo.tipo,
        descuentoPorcentaje: fidelidadInfo.descuentoPorcentaje,
        comprasCiclo: fidelidadInfo.comprasCiclo,
        enGracia: fidelidadInfo.enGracia,
        tieneCuenta: !!clienteObj.idUsuario
      },
      fecha: v.fechaVenta,
      fechaVenta: v.fechaVenta,
      fechaFormatted,
      horario,
      tipoEntrega,
      metodoPago,
      estadoPago,
      estadoEntrega: v.estadoEntrega,
      estado: estadoStr,
      subtotal,
      iva,
      precioOriginal,
      descuentoPorcentaje,
      montoDescuento,
      descuentoAplicado,
      total,
      observaciones: v.observaciones,
      productos,
      detalles: v.detalles || []
    };
  }

  static async getAll(filter = {}) {
    const { periodo, estado, search } = filter;
    const { Op } = require('sequelize');
    const where = {};

    if (periodo && periodo !== 'todos') {
      const now = new Date();
      if (periodo === 'hoy') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        where.fechaVenta = { [Op.gte]: startOfDay };
      } else if (periodo === '7dias') {
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        where.fechaVenta = { [Op.gte]: sevenDaysAgo };
      } else if (periodo === 'mes') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        where.fechaVenta = { [Op.gte]: startOfMonth };
      } else if (periodo === 'ano') {
        const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
        where.fechaVenta = { [Op.gte]: startOfYear };
      }
    }

    if (estado && estado !== 'Todos') {
      if (estado === 'Pendiente') {
        where.estadoEntrega = { [Op.in]: ['PENDIENTE', 'Pendiente'] };
      } else if (estado === 'En Preparación') {
        where.estadoEntrega = { [Op.in]: ['PREPARANDO', 'En Preparación'] };
      } else if (estado === 'Completada') {
        where.estadoEntrega = { [Op.in]: ['ENTREGADO', 'LISTO', 'Completada'] };
      } else if (estado === 'Anulada') {
        where.estadoEntrega = { [Op.in]: ['CANCELADO', 'Anulada'] };
      }
    }

    const { Variante, Product, FichaTecnica, DetalleFichaInsumo, Insumo, DetalleVentaAdicion, Adicion } = require('../../persistence/models');
    const ventas = await Venta.findAll({
      where,
      include: [
        { 
          model: Cliente, 
          as: 'cliente',
          include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] }]
        },
        { 
          model: User, 
          as: 'usuario', 
          attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'estado', 'idRol'],
          include: [{ model: Role, as: 'rolInfo', attributes: ['idRol', 'nombre'] }]
        },
        { 
          model: DetalleVentaProducto, 
          as: 'detalles',
          include: [
            {
              model: Variante,
              as: 'variante',
              include: [
                {
                  model: Product,
                  as: 'producto',
                  include: [
                    {
                      model: FichaTecnica,
                      as: 'fichaTecnica',
                      include: [
                        {
                          model: DetalleFichaInsumo,
                          as: 'detalles',
                          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              model: DetalleVentaAdicion,
              as: 'adiciones',
              include: [{ model: Adicion, as: 'adicion' }]
            }
          ]
        }
      ],
      order: [['idVenta', 'DESC']]
    });

    return ventas.map(v => this.formatVenta(v));
  }

  static async getStats(filter = {}) {
    const list = await this.getAll(filter);
    const totalVentasSum = list.reduce((acc, v) => acc + Number(v.total || 0), 0);
    const pedidosCount = list.length;
    const ticketPromedioVal = pedidosCount > 0 ? Math.round(totalVentasSum / pedidosCount) : 0;
    const descOtorgadosSum = list.reduce((acc, v) => acc + Number(v.montoDescuento || v.descuentoAplicado || 0), 0);
    const uniqueClientsCount = new Set(list.map(v => v.idCliente || v.clienteNombre || v.cliente).filter(Boolean)).size || 1;
    const frecuenciaVal = pedidosCount > 0 ? parseFloat((pedidosCount / uniqueClientsCount).toFixed(1)) : 0.0;
    const tasaDescuentoVal = (totalVentasSum + descOtorgadosSum) > 0
      ? parseFloat(((descOtorgadosSum / (totalVentasSum + descOtorgadosSum)) * 100).toFixed(1))
      : 0.0;

    return {
      totalVentas: totalVentasSum,
      totalVentasFormatted: `$${totalVentasSum.toLocaleString('es-CO')}`,
      pedidosCount,
      ticketPromedio: ticketPromedioVal,
      ticketPromedioFormatted: `$${ticketPromedioVal.toLocaleString('es-CO')}`,
      totalDescuentos: descOtorgadosSum,
      totalDescuentosFormatted: `$${descOtorgadosSum.toLocaleString('es-CO')}`,
      frecuenciaCompra: frecuenciaVal,
      tasaDescuento: tasaDescuentoVal,
      uniqueClientsCount
    };
  }

  static async getById(id) {
    const { Variante, Product, FichaTecnica, DetalleFichaInsumo, Insumo, DetalleVentaAdicion, Adicion } = require('../../persistence/models');
    const v = await Venta.findByPk(id, {
      include: [
        { 
          model: Cliente, 
          as: 'cliente',
          include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] }]
        },
        { model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] },
        { 
          model: DetalleVentaProducto, 
          as: 'detalles',
          include: [
            {
              model: Variante,
              as: 'variante',
              include: [
                {
                  model: Product,
                  as: 'producto',
                  include: [
                    {
                      model: FichaTecnica,
                      as: 'fichaTecnica',
                      include: [
                        {
                          model: DetalleFichaInsumo,
                          as: 'detalles',
                          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              model: DetalleVentaAdicion,
              as: 'adiciones',
              include: [{ model: Adicion, as: 'adicion' }]
            }
          ]
        }
      ]
    });
    if (!v) {
      const error = new Error('Venta no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return this.formatVenta(v);
  }

  static async getOrCreateClienteMostrador() {
    let mostrador = await Cliente.findOne({
      where: {
        idUsuario: null
      }
    });

    if (!mostrador) {
      const metaStr = JSON.stringify({
        nombre: 'Cliente',
        apellidos: 'Mostrador',
        tipo: 'Nuevo',
        descuentoPorcentaje: 0,
        estado: 'Activo'
      });
      mostrador = await Cliente.create({
        idUsuario: null,
        direccion: metaStr,
        estado: 1
      });
    }
    return mostrador;
  }

  static async create(data) {
    let targetUserId = data.idUsuario || data.userId;

    // Strict Validation 1: Check user provided
    if (!targetUserId) {
      const error = new Error('No se especificó un usuario para realizar el pedido.');
      error.statusCode = 400;
      throw error;
    }

    // Strict Validation 2: Check user exists in DB
    const userObj = await User.findByPk(targetUserId, {
      include: [{ model: Role, as: 'rolInfo' }]
    });
    if (!userObj) {
      const error = new Error('El usuario especificado no existe en el sistema.');
      error.statusCode = 404;
      throw error;
    }

    // Strict Validation 3: Check user is ACTIVE
    if (userObj.estado === 'INACTIVO' || userObj.estado === '0' || userObj.estado === 0) {
      const error = new Error('Tu usuario está inactivo y no puedes realizar pedidos. Comunícate con el administrador para activar tu cuenta.');
      error.statusCode = 403;
      throw error;
    }

    // Determine if the operating user is staff (Admin, Vendedor, Cocinero)
    const userRole = userObj.idRol || (userObj.rolInfo ? userObj.rolInfo.nombre : null);
    const isStaff = (userRole === 1 || userRole === 2 || userRole === 3 || 
                     String(userRole).toLowerCase().includes('admin') || 
                     String(userRole).toLowerCase().includes('vendedor') || 
                     String(userRole).toLowerCase().includes('cocinero'));

    let finalClienteId = null;

    if (isStaff) {
      // Staff (Vendedor/Admin) creating POS sale -> seller is employee, NOT customer
      if (data.idCliente) {
        finalClienteId = Number(data.idCliente);
      } else {
        const mostrador = await this.getOrCreateClienteMostrador();
        finalClienteId = mostrador.idCliente;
      }
    } else {
      // Regular customer placing an order online
      let clienteObj = await Cliente.findOne({ where: { idUsuario: targetUserId } });
      if (!clienteObj) {
        clienteObj = await Cliente.create({
          idUsuario: targetUserId,
          direccion: data.direccion || '',
          estado: 1
        });
      }

      let clientMeta = {};
      if (clienteObj.direccion && clienteObj.direccion.trim().startsWith('{')) {
        try { clientMeta = JSON.parse(clienteObj.direccion); } catch (e) { clientMeta = {}; }
      }

      if (clienteObj.estado === 0 || clientMeta.estado === 'Inactivo' || clientMeta.estado === 0) {
        const error = new Error('No puedes realizar el pedido porque tu cliente está inactivo.');
        error.statusCode = 403;
        throw error;
      }

      finalClienteId = clienteObj.idCliente;
    }

    // Determinar y normalizar tipoVenta (PUNTO_DE_VENTA vs DOMICILIO)
    const rawTipoVenta = String(data.tipoVenta || "").toUpperCase();
    const rawEntrega = String(data.tipoEntrega || (data.mesa ? "En Mesa" : "")).toLowerCase();
    let resolvedTipoVenta = "PUNTO_DE_VENTA";

    if (rawTipoVenta.includes("DOMICILIO") || rawTipoVenta.includes("LINEA") || rawEntrega.includes("domicilio")) {
      resolvedTipoVenta = "DOMICILIO";
    } else {
      resolvedTipoVenta = "PUNTO_DE_VENTA";
    }

    // Si es venta rápida (PUNTO_DE_VENTA), asegurar que se asocie al responsable con rol Vendedor o Administrador
    let responsibleUserId = targetUserId;
    if (resolvedTipoVenta === "PUNTO_DE_VENTA") {
      if (!isStaff) {
        const { Op } = require('sequelize');
        const sellerUser = await User.findOne({
          include: [{ model: Role, as: 'rolInfo', where: { nombre: { [Op.like]: '%Vendedor%' } } }],
          where: { estado: { [Op.in]: [1, 'ACTIVO', '1'] } }
        }).catch(() => null);

        if (sellerUser) {
          responsibleUserId = sellerUser.idUsuario;
        }
      }
    }

    let parsedObs = {};
    if (typeof data.observaciones === 'string' && data.observaciones.startsWith('{')) {
      try { parsedObs = JSON.parse(data.observaciones); } catch (e) {}
    } else if (typeof data.observaciones === 'object' && data.observaciones !== null) {
      parsedObs = data.observaciones;
    }

    const rawDetails = data.detalles || data.items || [];

    let calculatedSubtotal = 0;
    for (const it of rawDetails) {
      const itPrice = Number(it.precioUnitario || it.precio || 0);
      const itQty = Number(it.cantidad || 1);
      const itAdds = Array.isArray(it.adiciones)
        ? it.adiciones.reduce((s, a) => s + (Number(a.precio || a.precioUnitario || 0)), 0)
        : 0;
      calculatedSubtotal += (itPrice + itAdds) * itQty;
    }

    const finalSubtotal = Number(data.subtotal) > 0 ? Number(data.subtotal) : calculatedSubtotal;
    let finalDescuento = Number(data.descuentoAplicado || data.descuento || 0);

    const ClienteService = require('./clienteService');
    if (finalDescuento === 0 && finalClienteId) {
      try {
        const clienteInfo = await ClienteService.getById(finalClienteId);
        if (clienteInfo && Number(clienteInfo.descuentoPorcentaje) > 0) {
          finalDescuento = Math.round(finalSubtotal * (Number(clienteInfo.descuentoPorcentaje) / 100));
        }
      } catch (e) {
        // Continue without blocking
      }
    }

    const finalTotal = Math.max(0, finalSubtotal - finalDescuento);

    const now = new Date();
    const formattedHorario = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Bogota' });

    const obsObj = {
      horario: data.horario || parsedObs.horario || formattedHorario,
      tipoEntrega: data.tipoEntrega || parsedObs.tipoEntrega || (data.mesa ? "En Mesa" : "Recoger"),
      metodoPago: data.metodoPago || parsedObs.metodoPago || "Efectivo",
      direccion: data.direccion || parsedObs.direccion || "Recoger en Local",
      estadoPago: data.estadoPago || parsedObs.estadoPago || "Pagado",
      codigoPedido: data.codigoPedido || data.numeroVenta || parsedObs.codigoPedido || `VEN-${String(Date.now()).slice(-4)}`,
      clienteNombre: data.clienteNombre || parsedObs.clienteNombre || `${userObj.nombre} ${userObj.apellidos || ''}`.trim(),
      productos: (Array.isArray(data.productos) && data.productos.length > 0)
        ? data.productos
        : (Array.isArray(parsedObs.productos) && parsedObs.productos.length > 0)
          ? parsedObs.productos
          : rawDetails.map(it => {
              const itPrice = Number(it.precioUnitario || it.precio || 0);
              const itQty = Number(it.cantidad || 1);
              const itAdds = Array.isArray(it.adiciones)
                ? it.adiciones.reduce((s, a) => s + (Number(a.precio || a.precioUnitario || 0)), 0)
                : 0;
              return {
                idVariante: it.idVariante || it.varianteId,
                nombre: it.nombre || it.observaciones || it.observacion || "Producto",
                cantidad: itQty,
                precioUnitario: itPrice,
                total: Number(it.subtotal || it.total) > 0 ? Number(it.subtotal || it.total) : (itPrice + itAdds) * itQty,
                observaciones: it.observaciones || it.observacion || "",
                adiciones: it.adiciones || it.idAdiciones || []
              };
            }),
      especificaciones: data.observacion || parsedObs.especificaciones || data.observaciones || "",
      efectivoConCuanto: parsedObs.efectivoConCuanto || (data.datosPago ? data.datosPago.efectivoConCuanto : null) || "",
      vueltoEfectivo: parsedObs.vueltoEfectivo || (data.datosPago ? data.datosPago.vueltoEfectivo : null) || 0,
      transferenciaReferencia: parsedObs.transferenciaReferencia || (data.datosPago ? data.datosPago.transferReferencia : null) || "",
      transferBanco: parsedObs.transferBanco || (data.datosPago ? data.datosPago.transferBanco : null) || "",
      tarjetaNumero: parsedObs.tarjetaNumero || (data.datosPago ? data.datosPago.tarjetaNumero : null) || "",
      estadoAprobacion: data.estadoAprobacion || parsedObs.estadoAprobacion || 'PENDIENTE'
    };

    const obsStr = JSON.stringify(obsObj);

    const venta = await Venta.create({
      idCliente: finalClienteId,
      idUsuario: responsibleUserId,
      idDescuento: data.idDescuento || null,
      tipoVenta: resolvedTipoVenta,
      subtotal: finalSubtotal,
      descuentoAplicado: finalDescuento,
      total: finalTotal,
      estadoEntrega: data.estadoEntrega || data.estado || 'ENTREGADO',
      observaciones: obsStr,
      estadoAprobacion: data.estadoAprobacion || 'PENDIENTE'
    });

    if (rawDetails.length > 0) {
      const { sequelize, DetalleVentaAdicion } = require('../../persistence/models');

      for (const d of rawDetails) {
        let chosenVarianteId = null;

        // 1. Verificar si d.idVariante existe directamente en la tabla `variante`
        if (d.idVariante) {
          try {
            const [matchById] = await sequelize.query(
              'SELECT idVariante FROM variante WHERE idVariante = :id LIMIT 1',
              { replacements: { id: d.idVariante } }
            );
            if (matchById && matchById.length > 0) {
              chosenVarianteId = matchById[0].idVariante;
            }
          } catch (e) {
            console.warn('Error al consultar idVariante:', e.message);
          }
        }

        // 2. Si no coincide, buscar si existe variante asociada al idProducto
        if (!chosenVarianteId) {
          const prodId = d.idProducto || d.idVariante;
          if (prodId) {
            try {
              const [matchByProd] = await sequelize.query(
                'SELECT idVariante FROM variante WHERE idProducto = :id LIMIT 1',
                { replacements: { id: prodId } }
              );
              if (matchByProd && matchByProd.length > 0) {
                chosenVarianteId = matchByProd[0].idVariante;
              }
            } catch (e) {
              console.warn('Error al consultar idProducto en variante:', e.message);
            }
          }
        }

        // 3. Si no hay coincidencia, tomar cualquier variante existente en la base de datos
        if (!chosenVarianteId) {
          try {
            const [anyVar] = await sequelize.query('SELECT idVariante FROM variante LIMIT 1');
            if (anyVar && anyVar.length > 0) {
              chosenVarianteId = anyVar[0].idVariante;
            }
          } catch (e) {
            console.warn('Error al buscar variante por defecto:', e.message);
          }
        }

        // 4. Si la tabla `variante` está completamente vacía, crear dinámicamente una variante estándar
        if (!chosenVarianteId) {
          try {
            const targetProdId = d.idProducto || d.idVariante || 1;
            const [prodCheck] = await sequelize.query(
              'SELECT idProducto, nombre, precio FROM producto WHERE idProducto = :id LIMIT 1',
              { replacements: { id: targetProdId } }
            );

            let finalProdId = targetProdId;
            let varNombre = d.observaciones || d.observacion || d.nombre || 'Estándar';
            let varPrecio = d.precioUnitario || d.precio || 0;

            if (!prodCheck || prodCheck.length === 0) {
              const [firstProd] = await sequelize.query('SELECT idProducto, nombre, precio FROM producto LIMIT 1');
              if (firstProd && firstProd.length > 0) {
                finalProdId = firstProd[0].idProducto;
                varNombre = firstProd[0].nombre;
                varPrecio = firstProd[0].precio;
              }
            } else {
              varNombre = prodCheck[0].nombre;
              varPrecio = prodCheck[0].precio;
            }

            await sequelize.query(
              'INSERT INTO variante (idProducto, nombre, precio, estado) VALUES (:idProducto, :nombre, :precio, 1)',
              { replacements: { idProducto: finalProdId, nombre: String(varNombre).slice(0, 80), precio: varPrecio } }
            );

            const [newVarRow] = await sequelize.query(
              'SELECT idVariante FROM variante WHERE idProducto = :idProducto ORDER BY idVariante DESC LIMIT 1',
              { replacements: { idProducto: finalProdId } }
            );
            if (newVarRow && newVarRow.length > 0) {
              chosenVarianteId = newVarRow[0].idVariante;
            }
          } catch (e) {
            console.error('Error creando variante dinámica:', e.message);
          }
        }

        if (chosenVarianteId) {
          const createdDetalle = await DetalleVentaProducto.create({
            idVenta: venta.idVenta,
            idVariante: chosenVarianteId,
            cantidad: d.cantidad || 1,
            precioUnitario: d.precioUnitario || d.precio || 0,
            subtotal: d.subtotal || ((d.precioUnitario || d.precio || 0) * (d.cantidad || 1)),
            observaciones: d.observaciones || d.observacion || d.nombre || null
          });

          // Descuento Automático de Insumos según Ficha Técnica del Producto
          try {
            const { FichaTecnica, DetalleFichaInsumo, Insumo, Variante } = require('../../persistence/models');
            let targetProductId = d.idProducto;
            if (!targetProductId && chosenVarianteId) {
              const varRow = await Variante.findByPk(chosenVarianteId);
              if (varRow && varRow.idProducto) targetProductId = varRow.idProducto;
            }
            if (!targetProductId && d.idVariante) {
              const varRow = await Variante.findByPk(d.idVariante);
              if (varRow && varRow.idProducto) targetProductId = varRow.idProducto;
            }

            if (targetProductId) {
              const ficha = await FichaTecnica.findOne({
                where: { idProducto: targetProductId, estado: 1 },
                include: [{ model: DetalleFichaInsumo, as: 'detalles' }]
              });

              if (ficha && Array.isArray(ficha.detalles)) {
                const itemQty = Number(d.cantidad || 1);
                for (const det of ficha.detalles) {
                  const cantPorPlato = Number(det.cantidad || 0);
                  const totalADescontar = cantPorPlato * itemQty;
                  if (totalADescontar > 0 && det.idInsumo) {
                    const insumo = await Insumo.findByPk(det.idInsumo);
                    if (insumo) {
                      const stockActual = Number(insumo.stock || 0);
                      const nuevoStock = Math.max(0, stockActual - totalADescontar);
                      insumo.stock = nuevoStock;
                      await insumo.save();
                    }
                  }
                }
              }
            }
          } catch (mrpErr) {
            console.warn('Error descontando insumos de receta:', mrpErr.message);
          }

          // Guardar adiciones si fueron enviadas
          const adicList = d.idAdiciones || d.adiciones || [];
          if (Array.isArray(adicList) && adicList.length > 0) {
            for (const adItem of adicList) {
              const adId = typeof adItem === 'object' ? (adItem.id || adItem.idAdicion) : adItem;
              if (adId) {
                try {
                  await DetalleVentaAdicion.create({
                    idDetalleVenta: createdDetalle.idDetalleVenta,
                    idAdicion: adId,
                    cantidad: 1,
                    precioUnitario: typeof adItem === 'object' ? (adItem.precio || 0) : 0,
                    subtotal: typeof adItem === 'object' ? (adItem.precio || 0) : 0
                  });
                } catch (errAd) {
                  console.warn('Error guardando DetalleVentaAdicion:', errAd.message);
                }
              }
            }
          }
        }
      }
    }

    // Trigger client loyalty progression
    if (finalClienteId) {
      ClienteService.registrarCompraFidelidad(finalClienteId).catch(err =>
        console.warn('Error registrando fidelidad:', err.message)
      );
    }

    return this.getById(venta.idVenta);
  }

  static async updateEstado(id, estado) {
    const v = await Venta.findByPk(id);
    if (!v) {
      const error = new Error('Venta no encontrada');
      error.statusCode = 404;
      throw error;
    }

    let estadoEnum = estado;
    if (estado === 'Pendiente') estadoEnum = 'PENDIENTE';
    else if (estado === 'En Preparación') estadoEnum = 'PREPARANDO';
    else if (estado === 'Listo') estadoEnum = 'LISTO';
    else if (estado === 'Completada' || estado === 'Entregado') estadoEnum = 'ENTREGADO';
    else if (estado === 'Anulada' || estado === 'CANCELADO') estadoEnum = 'CANCELADO';

    const estadoAnterior = v.estadoEntrega;
    v.estadoEntrega = estadoEnum;
    if (estadoEnum === 'CANCELADO') {
      v.estadoAprobacion = 'RECHAZADO';
    } else if (estadoEnum === 'PREPARANDO' || estadoEnum === 'LISTO' || estadoEnum === 'ENTREGADO') {
      v.estadoAprobacion = 'APROBADO';
    }
    await v.save();

    // Reintegrar insumos si la venta fue anulada/cancelada y no estaba ya cancelada
    if (estadoEnum === 'CANCELADO' && estadoAnterior !== 'CANCELADO') {
      try {
        const saleData = await this.getById(id);
        if (saleData && Array.isArray(saleData.detalles)) {
          const { FichaTecnica, DetalleFichaInsumo, Insumo, Variante } = require('../../persistence/models');
          for (const d of saleData.detalles) {
            let prodId = d.idProducto;
            if (!prodId && d.idVariante) {
              const varRow = await Variante.findByPk(d.idVariante);
              if (varRow) prodId = varRow.idProducto;
            }
            if (prodId) {
              const ficha = await FichaTecnica.findOne({
                where: { idProducto: prodId, estado: 1 },
                include: [{ model: DetalleFichaInsumo, as: 'detalles' }]
              });
              if (ficha && Array.isArray(ficha.detalles)) {
                const itemQty = Number(d.cantidad || 1);
                for (const det of ficha.detalles) {
                  const cantPorPlato = Number(det.cantidad || 0);
                  const totalARestaurar = cantPorPlato * itemQty;
                  if (totalARestaurar > 0 && det.idInsumo) {
                    const insumo = await Insumo.findByPk(det.idInsumo);
                    if (insumo) {
                      insumo.stock = Number(insumo.stock || 0) + totalARestaurar;
                      await insumo.save();
                    }
                  }
                }
              }
            }
          }
        }
      } catch (restockErr) {
        console.warn('Error reintegrando insumos por cancelación:', restockErr.message);
      }
    }

    if ((estadoEnum === 'ENTREGADO' || estadoEnum === 'APROBADO') && v.idCliente) {
      const ClienteService = require('./clienteService');
      ClienteService.registrarCompraFidelidad(v.idCliente).catch(err =>
        console.warn('Error registrando fidelidad en cambio de estado:', err.message)
      );
    }

    return this.getById(id);
  }

  static async cancelar(id) {
    return this.updateEstado(id, 'CANCELADO');
  }
}

module.exports = VentaService;
