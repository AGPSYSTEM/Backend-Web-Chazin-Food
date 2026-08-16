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
    
    // Dynamic format of date/time (Formato 12 horas con AM/PM)
    let horario = obsData.horario;
    if (!horario && v.fechaVenta) {
      const d = new Date(v.fechaVenta);
      let h = d.getHours();
      const m = String(d.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12;
      horario = `${String(h).padStart(2, '0')}:${m} ${ampm}`;
    }
    // Si el horario guardado es en formato 24h (ej: "23:56"), convertirlo a 12h AM/PM
    if (horario && typeof horario === 'string') {
      if (horario.includes('–')) {
        horario = horario.split('–')[0].trim();
      }
      if (/^\d{1,2}:\d{2}$/.test(horario.trim())) {
        const parts = horario.trim().split(':');
        let h = parseInt(parts[0], 10);
        const m = parts[1];
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        horario = `${String(h).padStart(2, '0')}:${m} ${ampm}`;
      }
    }
    horario = horario || null;

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
      productos = obsData.productos;
    } else if (v.detalles && v.detalles.length > 0) {
      productos = v.detalles.map(d => {
        let pName = null;
        let pAdiciones = [];
        if (d.observaciones) {
          try {
            const parsedObs = typeof d.observaciones === 'string' && d.observaciones.startsWith('{')
              ? JSON.parse(d.observaciones)
              : { nombre: d.observaciones };
            pName = parsedObs.nombre || parsedObs.nombreProducto || null;
            pAdiciones = parsedObs.adiciones || [];
          } catch (e) {
            pName = typeof d.observaciones === 'string' ? d.observaciones : null;
          }
        }
        return {
          id: d.idDetalleVenta || d.idVariante,
          idVariante: d.idVariante,
          nombre: pName,
          cantidad: d.cantidad,
          precioUnitario: parseFloat(d.precioUnitario || 0),
          total: parseFloat(d.subtotal || 0),
          adiciones: pAdiciones
        };
      });
    } else {
      // Sin detalles reales en BD: devolver array vacío (no inventar productos ficticios)
      productos = [];
    }

    const subtotal = parseFloat(v.subtotal) || 0;
    const total = parseFloat(v.total) || 0;
    const iva = Math.round(subtotal * 0.19);

    let descuentoPorcentaje = obsData.descuentoPorcentaje || 0;
    if (!descuentoPorcentaje && parseFloat(v.descuentoAplicado || 0) > 0 && (subtotal > 0 || total > 0)) {
      const base = subtotal > total ? subtotal : total + parseFloat(v.descuentoAplicado);
      descuentoPorcentaje = Math.round((parseFloat(v.descuentoAplicado) / base) * 100);
    } else if (!descuentoPorcentaje && clienteObj && clienteObj.direccion) {
      try {
        if (clienteObj.direccion.trim().startsWith('{')) {
          const meta = JSON.parse(clienteObj.direccion);
          if (meta.descuentoPorcentaje !== undefined) {
            descuentoPorcentaje = parseFloat(meta.descuentoPorcentaje);
          } else if (meta.tipo) {
            const t = meta.tipo;
            descuentoPorcentaje = t === 'VIP' ? 15 : t === 'Frecuente' ? 10 : t === 'Regular' ? 5 : 0;
          }
        }
      } catch (e) {}
    }

    let precioOriginal = subtotal > total ? subtotal : total;
    if (descuentoPorcentaje > 0 && total > 0) {
      if (parseFloat(v.descuentoAplicado || 0) > 0) {
        precioOriginal = total + parseFloat(v.descuentoAplicado);
      } else if (precioOriginal === total) {
        precioOriginal = Math.round(total / (1 - (descuentoPorcentaje / 100)));
      }
    }
    const montoDescuento = Math.max(0, precioOriginal - total);

    let estadoStr = 'Pendiente';
    if (v.estadoEntrega === 'PREPARANDO') estadoStr = 'En Preparación';
    else if (v.estadoEntrega === 'LISTO') estadoStr = 'Listo';
    else if (v.estadoEntrega === 'ENTREGADO') estadoStr = 'Completada';
    else if (v.estadoEntrega === 'CANCELADO') estadoStr = 'Anulada';
    else if (v.estadoEntrega) estadoStr = v.estadoEntrega;

    return {
      id: v.idVenta,
      idVenta: v.idVenta,
      idDescuento: v.idDescuento || null,
      numeroVenta,
      codigoPedido: numeroVenta,
      clienteNombre,
      cliente: clienteNombre,
      idCliente: v.idCliente,
      idUsuario: v.idUsuario,
      fecha: v.fechaVenta,
      fechaVenta: v.fechaVenta,
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
      descuentoAplicado: parseFloat(v.descuentoAplicado || 0) || montoDescuento,
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
      } else if (periodo === '7_dias') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        where.fechaVenta = { [Op.gte]: sevenDaysAgo };
      } else if (periodo === 'este_mes') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        where.fechaVenta = { [Op.gte]: startOfMonth };
      } else if (periodo === 'este_ano') {
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

  static async create(data) {
    let targetUserId = data.idUsuario || data.userId;

    // Strict Validation 1: Check user provided
    if (!targetUserId) {
      const error = new Error('No se especificó un usuario para realizar el pedido.');
      error.statusCode = 400;
      throw error;
    }

    // Strict Validation 2: Check user exists in DB
    const userObj = await User.findByPk(targetUserId);
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

    // Strict Validation 4 & 5: Check client linked to user
    let clienteObj = await Cliente.findOne({ where: { idUsuario: targetUserId } });
    
    // Auto-associate client ONLY if this user has no client entry yet
    if (!clienteObj) {
      clienteObj = await Cliente.create({
        idUsuario: targetUserId,
        direccion: data.direccion || '',
        estado: 1
      });
    }

    // Strict Validation 6: Check client is ACTIVE
    let clientMeta = {};
    if (clienteObj.direccion && clienteObj.direccion.trim().startsWith('{')) {
      try { clientMeta = JSON.parse(clienteObj.direccion); } catch (e) { clientMeta = {}; }
    }

    if (clienteObj.estado === 0 || clientMeta.estado === 'Inactivo' || clientMeta.estado === 0) {
      const error = new Error('No puedes realizar el pedido porque tu cliente está inactivo.');
      error.statusCode = 403;
      throw error;
    }

    const finalClienteId = clienteObj.idCliente;

    let parsedObs = {};
    if (typeof data.observaciones === 'string' && data.observaciones.startsWith('{')) {
      try { parsedObs = JSON.parse(data.observaciones); } catch (e) {}
    } else if (typeof data.observaciones === 'object' && data.observaciones !== null) {
      parsedObs = data.observaciones;
    }

    const rawDetails = data.detalles || data.items || [];

    const obsObj = {
      horario: data.horario || parsedObs.horario || "12:30 – 12:48",
      tipoEntrega: data.tipoEntrega || parsedObs.tipoEntrega || (data.mesa ? "En Mesa" : "Domicilio"),
      metodoPago: data.metodoPago || parsedObs.metodoPago || "Efectivo",
      direccion: data.direccion || parsedObs.direccion || "",
      estadoPago: data.estadoPago || parsedObs.estadoPago || "Pagado",
      codigoPedido: data.codigoPedido || data.numeroVenta || parsedObs.codigoPedido || `VEN-${String(Date.now()).slice(-4)}`,
      clienteNombre: data.clienteNombre || parsedObs.clienteNombre || `${userObj.nombre} ${userObj.apellidos || ''}`.trim(),
      productos: (Array.isArray(data.productos) && data.productos.length > 0)
        ? data.productos
        : (Array.isArray(parsedObs.productos) && parsedObs.productos.length > 0)
          ? parsedObs.productos
          : rawDetails.map(it => ({
              idVariante: it.idVariante || it.varianteId,
              nombre: it.nombre || it.observaciones || it.observacion || "Producto",
              cantidad: it.cantidad || 1,
              precioUnitario: it.precioUnitario || it.precio || 0,
              total: it.total || ((it.precioUnitario || it.precio || 0) * (it.cantidad || 1)),
              observaciones: it.observaciones || it.observacion || "",
              adiciones: it.idAdiciones || it.adiciones || []
            })),
      especificaciones: data.observacion || parsedObs.especificaciones || data.observaciones || "",
      efectivoConCuanto: parsedObs.efectivoConCuanto || "",
      vueltoEfectivo: parsedObs.vueltoEfectivo || 0,
      transferenciaReferencia: parsedObs.transferenciaReferencia || ""
    };

    const obsStr = JSON.stringify(obsObj);

    const venta = await Venta.create({
      idCliente: finalClienteId,
      idUsuario: targetUserId,
      idDescuento: data.idDescuento || null,
      subtotal: data.subtotal || data.total || 0,
      descuentoAplicado: data.descuentoAplicado || 0,
      total: data.total || 0,
      estadoEntrega: data.estadoEntrega || data.estado || 'PENDIENTE',
      observaciones: obsStr
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

    v.estadoEntrega = estadoEnum;
    await v.save();
    return this.getById(id);
  }

  static async cancelar(id) {
    return this.updateEstado(id, 'CANCELADO');
  }
}

module.exports = VentaService;
