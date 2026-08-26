const { Op } = require('sequelize');
const { Cliente, User, Role, Venta, DetalleVentaProducto } = require('../../persistence/models');
const { resetAutoIncrement, resequenceTableIds } = require('../../infrastructure/utils/dbUtils');
const { sanitizeTelefono, cleanNameAndLastName, formatNombreCompleto, sanitizeDocumento } = require('../../infrastructure/utils/validationUtils');
const bcrypt = require('bcryptjs');
const EmailService = require('./emailService');
const FidelidadService = require('./fidelidadService');

class ClienteService {
  static async formatCliente(c) {
    let meta = {};
    let cleanDireccion = '';

    if (c.direccion) {
      const raw = String(c.direccion).trim();
      if (raw.startsWith('{')) {
        try {
          meta = JSON.parse(raw);
          if (meta && typeof meta === 'object') {
            cleanDireccion = typeof meta.direccion === 'string' ? meta.direccion : (meta.d || '');
          }
        } catch (e) {
          // Truncated / malformed JSON fallback via regex
          const match = raw.match(/"direccion"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/i) || raw.match(/"d"\s*:\s*"([^"]+)"/i);
          if (match && match[1]) {
            cleanDireccion = match[1];
          }
        }
      } else {
        cleanDireccion = raw;
      }
    }

    // Defensive guarantee: cleanDireccion must NEVER be a raw JSON string
    if (cleanDireccion.startsWith('{')) {
      try {
        const p = JSON.parse(cleanDireccion);
        cleanDireccion = p.direccion || p.d || '';
      } catch {
        const m = cleanDireccion.match(/"direccion"\s*:\s*"([^"]+)"/i);
        cleanDireccion = m ? m[1] : '';
      }
    }

    // Fetch real DB transactions for this client
    let transacciones = [];
    let comprasCount = 0;
    let totalGastadoSum = 0;
    let ticketPromedioVal = 0;

    try {
      const ventasDB = await Venta.findAll({
        where: { idCliente: c.idCliente },
        order: [['idVenta', 'DESC']],
        include: [{ model: DetalleVentaProducto, as: 'detalles' }]
      });

      comprasCount = ventasDB.length;
      totalGastadoSum = ventasDB.reduce((sum, v) => sum + Number(v.total || 0), 0);
      ticketPromedioVal = comprasCount > 0 ? Math.round(totalGastadoSum / comprasCount) : 0;

      transacciones = ventasDB.map(v => {
        let prodNombre = "Pedido de Comida";
        if (v.detalles && v.detalles.length > 0) {
          prodNombre = v.detalles[0].observaciones || `Producto #${v.detalles[0].idVariante}`;
          if (v.detalles.length > 1) {
            prodNombre += ` + ${v.detalles.length - 1} más`;
          }
        }
        return {
          idTrans: v.codigoPedido || `VEN-${String(v.idVenta).padStart(4, '0')}`,
          fecha: v.fechaVenta ? new Date(v.fechaVenta).toLocaleDateString('es-CO') : 'Reciente',
          producto: prodNombre,
          total: `$${Number(v.total || 0).toLocaleString('es-CO')}`
        };
      });
    } catch (err) {
      console.warn(`Error cargando ventas para cliente #${c.idCliente}:`, err.message);
    }

    const calculatedTierFromPurchases = comprasCount >= 9 ? 'VIP' : comprasCount >= 6 ? 'Frecuente' : comprasCount >= 3 ? 'Regular' : 'Nuevo';
    const calculatedCicloFromPurchases = comprasCount % 3;

    // Dynamic Fidelity Assessment (Tiers: Nuevo, Regular 5%, Frecuente 10%, VIP 15% with 30-day streak and grace periods)
    const fidelidadActual = meta.fidelidad || {
      tipo: meta.tipo || calculatedTierFromPurchases,
      comprasCiclo: meta.ciclo !== undefined ? Number(meta.ciclo) : (meta.comprasCiclo !== undefined ? Number(meta.comprasCiclo) : calculatedCicloFromPurchases),
      comprasTotales: comprasCount,
      fechaInicioNivel: meta.inicio || meta.fechaInicioNivel || null,
      fechaVencimientoNivel: meta.vence || meta.fechaVencimientoNivel || null
    };

    const fidelidadEvaluada = FidelidadService.evaluarEstadoFidelidad(fidelidadActual, comprasCount);
    const tipo = fidelidadEvaluada.tipo;
    const descuentoPorcentaje = fidelidadEvaluada.descuentoPorcentaje;

    // Persist fixed dates / degradation into DB so remaining days decrement consistently
    const needsDatePersistence = fidelidadEvaluada.tipo !== 'Nuevo' && (!meta.vence || !meta.inicio);
    const needsStatePersistence = meta.tipo && meta.tipo !== fidelidadEvaluada.tipo;
    if (needsDatePersistence || needsStatePersistence) {
      try {
        const compactMeta = {
          direccion: cleanDireccion,
          tipo: fidelidadEvaluada.tipo,
          ciclo: fidelidadEvaluada.comprasCiclo,
          inicio: fidelidadEvaluada.fechaInicioNivel,
          vence: fidelidadEvaluada.fechaVencimientoNivel
        };
        c.direccion = JSON.stringify(compactMeta);
        await c.save();
      } catch (saveErr) {
        console.warn(`Error persistiendo fidelidad evaluada para cliente #${c.idCliente}:`, saveErr.message);
      }
    }

    // Determine state: if no user account linked or user account is not active, client state is Inactivo
    const isUserActive = Boolean(
      c.usuario &&
      (String(c.usuario.estado).toUpperCase() === 'ACTIVO' || c.usuario.estado === 1 || c.usuario.estado === true)
    );

    let estadoStr = 'Activo';
    if (!c.idUsuario || !c.usuario || !isUserActive || c.estado === 0 || c.estado === false || meta.estado === 'Inactivo' || meta.estado === 0) {
      estadoStr = 'Inactivo';
    }
    const rawNombre = c.usuario ? c.usuario.nombre : (meta.nombre || 'Cliente sin cuenta');
    const rawApellidos = c.usuario ? c.usuario.apellidos : (meta.apellidos || '');
    const { nombre: cleanNombre, apellidos: cleanApellidos } = cleanNameAndLastName(rawNombre, rawApellidos);
    const cleanTelefono = sanitizeTelefono(c.usuario ? c.usuario.telefono : (meta.telefono || ''));

    return {
      id: c.idCliente,
      idCliente: c.idCliente,
      idUsuario: c.idUsuario || null,
      tieneCuenta: !!c.idUsuario && !!c.usuario,
      cuentaActiva: Boolean(c.idUsuario && c.usuario && isUserActive),
      direccion: cleanDireccion,
      tipo,
      descuentoPorcentaje,
      fidelidad: fidelidadEvaluada,
      nombre: cleanNombre,
      apellidos: cleanApellidos,
      email: c.usuario ? c.usuario.email : (meta.email || ''),
      telefono: cleanTelefono,
      estado: estadoStr,
      compras: comprasCount,
      totalGastado: `$${totalGastadoSum.toLocaleString('es-CO')}`,
      ticketPromedio: comprasCount > 0 ? `$${Math.round(ticketPromedioVal / 1000)}K` : '$0',
      transacciones,
      usuario: c.usuario ? {
        id: c.usuario.idUsuario,
        nombre: cleanNombre,
        apellidos: cleanApellidos,
        email: c.usuario.email,
        telefono: cleanTelefono,
        estado: c.usuario.estado
      } : null
    };
  }

  static async getAll() {
    const clientes = await Cliente.findAll({
      order: [['idCliente', 'ASC']],
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono', 'estado', 'idRol'],
          include: [{ model: Role, as: 'rolInfo', attributes: ['idRol', 'nombre'] }]
        }
      ]
    });

    const result = [];
    for (const c of clientes) {
      // Exclude Cliente Mostrador placeholder (id 26 or Mostrador) from registered clients list
      if (c.idCliente === 26 || (c.direccion && c.direccion.toLowerCase().includes('cliente mostrador'))) {
        continue;
      }

      // Exclude staff users (Administrador, Vendedor, Cocinero) from client list
      if (c.usuario) {
        const userRolId = c.usuario.idRol;
        const rolNom = String(c.usuario.rolInfo?.nombre || '').toLowerCase();
        if (userRolId === 1 || userRolId === 2 || userRolId === 3 || 
            rolNom.includes('admin') || rolNom.includes('vendedor') || rolNom.includes('cocinero')) {
          continue;
        }
      }
      result.push(await this.formatCliente(c));
    }
    return result;
  }

  static async getClientesStats() {
    const list = await this.getAll();
    const totalCount = list.length;
    const vipCount = list.filter((c) => (c.tipo || (c.esVip ? 'VIP' : '')) === 'VIP').length;
    const frecuentesCount = list.filter((c) => (c.tipo || '') === 'Frecuente').length;
    const nuevosCount = list.filter((c) => (c.tipo || '') === 'Nuevo').length;

    return {
      total: totalCount,
      vip: vipCount,
      frecuentes: frecuentesCount,
      nuevos: nuevosCount
    };
  }

  static async getById(id) {
    const c = await Cliente.findByPk(id, {
      include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'telefono', 'estado'] }]
    });

    if (!c) {
      const error = new Error('Cliente no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return this.formatCliente(c);
  }

  static async create(data) {
    let idUsuario = data.idUsuario || null;
    const sinCuenta = data.sinCuenta || data.crearSinCuenta || (!data.contrasena && !idUsuario);
    const { nombre: cleanNom, apellidos: cleanApe } = cleanNameAndLastName(data.nombre, data.apellidos);
    const cleanTel = sanitizeTelefono(data.telefono);

    // Only create a user if sinCuenta is false and credentials/data provided
    if (!sinCuenta && !idUsuario && cleanNom && (data.email || data.contrasena)) {
      const clienteRol = await Role.findOne({ where: { nombre: 'Cliente' } });
      const defaultPass = data.contrasena || '123456';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPass, salt);

      const user = await User.create({
        nombre: cleanNom,
        apellidos: cleanApe,
        email: data.email ? data.email.trim() : `cliente_${Date.now()}@chazinfood.com`,
        telefono: cleanTel,
        contrasena: hashedPassword,
        idRol: clienteRol ? clienteRol.idRol : 4,
        estado: 'ACTIVO'
      });
      idUsuario = user.idUsuario;
    }

    const tipo = data.tipo || 'Nuevo';
    const defaultDesc = tipo === 'VIP' ? 15 : tipo === 'Frecuente' ? 10 : tipo === 'Regular' ? 5 : 0;
    const descPorcent = defaultDesc;

    // If client created without user account, it MUST be INACTIVO (0)
    const estadoVal = (sinCuenta || !idUsuario || data.estado === 'Inactivo' || data.estado === 0) ? 0 : 1;

    const now = new Date();
    const fechaVence = tipo !== 'Nuevo' ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : null;

    const direccionMeta = JSON.stringify({
      direccion: data.direccion || '',
      tipo,
      ciclo: 0,
      inicio: tipo !== 'Nuevo' ? now.toISOString() : null,
      vence: fechaVence
    });

    const cliente = await Cliente.create({
      idUsuario: idUsuario,
      direccion: direccionMeta,
      estado: estadoVal
    });

    await resetAutoIncrement('cliente', 'idCliente');
    return this.getById(cliente.idCliente);
  }

  static async update(id, data) {
    const c = await Cliente.findByPk(id, {
      include: [{ model: User, as: 'usuario' }]
    });

    if (!c) {
      const error = new Error('Cliente no encontrado');
      error.statusCode = 404;
      throw error;
    }

    let existingMeta = {};
    if (c.direccion && c.direccion.trim().startsWith('{')) {
      try {
        existingMeta = JSON.parse(c.direccion);
      } catch (e) {
        existingMeta = {};
      }
    } else {
      existingMeta = { direccion: c.direccion || '' };
    }

    const rawNom = data.nombre !== undefined ? data.nombre : existingMeta.nombre;
    const rawApe = data.apellidos !== undefined ? data.apellidos : existingMeta.apellidos;
    const { nombre: cleanNom, apellidos: cleanApe } = cleanNameAndLastName(rawNom, rawApe);
    const cleanTel = data.telefono !== undefined ? sanitizeTelefono(data.telefono) : existingMeta.telefono;

    const newDireccionStr = data.direccion !== undefined ? data.direccion : existingMeta.direccion || '';
    const newTipo = data.tipo !== undefined ? data.tipo : existingMeta.tipo || 'Nuevo';
    const defaultDesc = newTipo === 'VIP' ? 15 : newTipo === 'Frecuente' ? 10 : newTipo === 'Regular' ? 5 : 0;
    const newDesc = defaultDesc;

    // Handle account linkage / creation upon edit if requested
    if (data.crearCuenta && !c.idUsuario && data.email) {
      const clienteRol = await Role.findOne({ where: { nombre: 'Cliente' } });
      const defaultPass = data.contrasena || '123456';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPass, salt);

      const user = await User.create({
        nombre: cleanNom || 'Cliente',
        apellidos: cleanApe || '',
        email: data.email.trim(),
        telefono: cleanTel || '',
        contrasena: hashedPassword,
        idRol: clienteRol ? clienteRol.idRol : 4,
        estado: 'ACTIVO'
      });
      c.idUsuario = user.idUsuario;
    } else if (data.idUsuario !== undefined) {
      c.idUsuario = data.idUsuario;
    }

    const now = new Date();
    let newInicio = existingMeta.inicio || existingMeta.fechaInicioNivel || null;
    let newVence = existingMeta.vence || existingMeta.fechaVencimientoNivel || null;
    let newCiclo = existingMeta.ciclo !== undefined ? Number(existingMeta.ciclo) : (existingMeta.comprasCiclo !== undefined ? Number(existingMeta.comprasCiclo) : 0);

    if (data.tipo !== undefined && data.tipo !== existingMeta.tipo) {
      newInicio = newTipo !== 'Nuevo' ? now.toISOString() : null;
      newVence = newTipo !== 'Nuevo' ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : null;
      newCiclo = 0;
    } else if (newTipo !== 'Nuevo' && !newVence) {
      newInicio = now.toISOString();
      newVence = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    const finalEstado = (!c.idUsuario || data.estado === 'Inactivo' || data.estado === 0) ? 0 : 1;
    c.direccion = JSON.stringify({
      direccion: newDireccionStr,
      tipo: newTipo,
      ciclo: newCiclo,
      inicio: newInicio,
      vence: newVence
    });

    if (data.estado !== undefined) c.estado = finalEstado;
    await c.save();

    if (c.usuario) {
      const nameChanged = data.nombre !== undefined || data.apellidos !== undefined;
      if (nameChanged) {
        const newFullName = formatNombreCompleto(cleanNom, cleanApe).toLowerCase();
        const currentFullName = formatNombreCompleto(c.usuario.nombre, c.usuario.apellidos).toLowerCase();
        if (newFullName && newFullName !== currentFullName) {
          const otherUsers = await User.findAll({
            where: { idUsuario: { [Op.ne]: c.usuario.idUsuario } },
            attributes: ['idUsuario', 'nombre', 'apellidos']
          });
          const duplicateName = otherUsers.some(u => formatNombreCompleto(u.nombre, u.apellidos).toLowerCase() === newFullName);
          if (duplicateName) {
            const error = new Error(`Ya existe un usuario registrado con el nombre "${formatNombreCompleto(cleanNom, cleanApe)}"`);
            error.statusCode = 400;
            throw error;
          }
        }
        c.usuario.nombre = cleanNom;
        c.usuario.apellidos = cleanApe;
      }

      if (data.email !== undefined) {
        const finalEmail = data.email.trim().toLowerCase();
        if (finalEmail && finalEmail !== (c.usuario.email || '').toLowerCase()) {
          const existingEmail = await User.findOne({
            where: {
              email: finalEmail,
              idUsuario: { [Op.ne]: c.usuario.idUsuario }
            }
          });
          if (existingEmail) {
            const error = new Error('Ya existe un usuario registrado con este correo electrónico');
            error.statusCode = 400;
            throw error;
          }
          c.usuario.email = finalEmail;
        }
      }

      if (data.documento !== undefined || data.numeroDocumento !== undefined) {
        const targetTipoDoc = data.tipoDocumento || c.usuario.tipoDocumento || 'C.C.';
        const cleanDoc = sanitizeDocumento(data.documento || data.numeroDocumento, targetTipoDoc);
        const currentDoc = String(c.usuario.numeroDocumento || c.usuario.idUsuario || '');
        if (cleanDoc && cleanDoc !== currentDoc) {
          const existingDoc = await User.findOne({
            where: {
              idUsuario: { [Op.ne]: c.usuario.idUsuario },
              [Op.or]: [
                { numeroDocumento: cleanDoc },
                ...(!isNaN(parseInt(cleanDoc)) ? [{ idUsuario: parseInt(cleanDoc) }] : [])
              ]
            }
          });
          if (existingDoc) {
            const error = new Error(`Ya existe un usuario registrado con el número de documento "${cleanDoc}"`);
            error.statusCode = 400;
            throw error;
          }
          c.usuario.numeroDocumento = cleanDoc;
          if (data.tipoDocumento) c.usuario.tipoDocumento = data.tipoDocumento;
        }
      }

      if (data.telefono !== undefined) c.usuario.telefono = cleanTel;
      if (data.estado !== undefined) {
        c.usuario.estado = data.estado === 'Inactivo' || data.estado === 0 ? 'INACTIVO' : 'ACTIVO';
      }
      await c.usuario.save();

      // Send update notification email
      if (data.notificarEmail !== false) {
        EmailService.sendUserUpdatedEmail({
          email: c.usuario.email,
          nombre: c.usuario.nombre,
          apellidos: c.usuario.apellidos,
          modifiedFields: nameChanged ? 'Nombre / Apellidos' : 'Información de cuenta'
        }).catch(err => console.error('Background email notification error in cliente update:', err.message));
      }
    }

    return this.getById(id);
  }

  static async delete(id) {
    const c = await Cliente.findByPk(id);
    if (!c) {
      const error = new Error('Cliente no encontrado');
      error.statusCode = 404;
      throw error;
    }

    await c.destroy();
    await resequenceTableIds('cliente', 'idCliente', [{ table: 'venta', column: 'idCliente' }]);

    return { message: 'Cliente eliminado exitosamente' };
  }

  static async registrarCompraFidelidad(idCliente) {
    if (!idCliente) return null;
    try {
      const c = await Cliente.findByPk(idCliente);
      if (!c) return null;

      let meta = {};
      let cleanDir = '';
      if (c.direccion) {
        const raw = String(c.direccion).trim();
        if (raw.startsWith('{')) {
          try {
            meta = JSON.parse(raw);
            cleanDir = meta.direccion || '';
          } catch (e) {
            const match = raw.match(/"direccion"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/i);
            if (match) cleanDir = match[1];
          }
        } else {
          cleanDir = raw;
        }
      }

      const fidelidadActual = meta.fidelidad || {
        tipo: meta.tipo || 'Nuevo',
        comprasCiclo: meta.ciclo !== undefined ? Number(meta.ciclo) : (meta.comprasCiclo !== undefined ? Number(meta.comprasCiclo) : 0),
        comprasTotales: meta.comprasTotales || 0,
        fechaInicioNivel: meta.inicio || meta.fechaInicioNivel || null,
        fechaVencimientoNivel: meta.vence || meta.fechaVencimientoNivel || null
      };

      const nuevaFidelidad = FidelidadService.registrarCompra(fidelidadActual);

      // Keep metadata compact to strictly fit inside VARCHAR(255)
      const compactMeta = {
        direccion: cleanDir,
        tipo: nuevaFidelidad.tipo,
        ciclo: nuevaFidelidad.comprasCiclo,
        inicio: nuevaFidelidad.fechaInicioNivel,
        vence: nuevaFidelidad.fechaVencimientoNivel
      };

      c.direccion = JSON.stringify(compactMeta);
      await c.save();
      return nuevaFidelidad;
    } catch (err) {
      console.warn(`Error registrando compra de fidelidad para cliente #${idCliente}:`, err.message);
      return null;
    }
  }

  static getCatalogoFidelidad() {
    return FidelidadService.getCatalogoNiveles();
  }
}

module.exports = ClienteService;
