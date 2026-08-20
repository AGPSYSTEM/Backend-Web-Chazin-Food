const { Cliente, User, Role, Venta, DetalleVentaProducto } = require('../../persistence/models');
const { resetAutoIncrement, resequenceTableIds } = require('../../infrastructure/utils/dbUtils');
const { sanitizeTelefono, cleanNameAndLastName } = require('../../infrastructure/utils/validationUtils');
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
      tipo: calculatedTierFromPurchases,
      comprasCiclo: calculatedCicloFromPurchases,
      comprasTotales: comprasCount,
      fechaInicioNivel: meta.fechaInicioNivel || null,
      fechaVencimientoNivel: meta.fechaVencimientoNivel || null
    };

    const fidelidadEvaluada = FidelidadService.evaluarEstadoFidelidad(fidelidadActual, comprasCount);
    const tipo = fidelidadEvaluada.tipo;
    const descuentoPorcentaje = fidelidadEvaluada.descuentoPorcentaje;

    // Determine state: if no user account linked, client state is Inactivo/Pendiente
    let estadoStr = 'Activo';
    if (!c.idUsuario || c.estado === 0 || meta.estado === 'Inactivo' || meta.estado === 0) {
      estadoStr = 'Inactivo';
    } else if (c.usuario && (c.usuario.estado === 'INACTIVO' || c.usuario.estado === '0' || c.usuario.estado === 0)) {
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

    const direccionMeta = JSON.stringify({
      direccion: data.direccion || '',
      tipo,
      descuentoPorcentaje: descPorcent,
      nombre: cleanNom,
      apellidos: cleanApe,
      email: data.email || '',
      telefono: cleanTel,
      estado: estadoVal === 0 ? 'Inactivo' : 'Activo'
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

    const finalEstado = (!c.idUsuario || data.estado === 'Inactivo' || data.estado === 0) ? 0 : 1;
    c.direccion = JSON.stringify({
      direccion: newDireccionStr,
      tipo: newTipo,
      descuentoPorcentaje: newDesc,
      nombre: cleanNom,
      apellidos: cleanApe,
      email: data.email !== undefined ? data.email : existingMeta.email,
      telefono: cleanTel,
      estado: finalEstado === 0 ? 'Inactivo' : 'Activo'
    });

    if (data.estado !== undefined) c.estado = finalEstado;
    await c.save();

    if (c.usuario) {
      const nameChanged = data.nombre !== undefined || data.apellidos !== undefined;
      if (data.nombre !== undefined || data.apellidos !== undefined) {
        c.usuario.nombre = cleanNom;
        c.usuario.apellidos = cleanApe;
      }
      if (data.email !== undefined) c.usuario.email = data.email.trim();
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
        comprasCiclo: meta.ciclo || meta.comprasCiclo || 0,
        comprasTotales: meta.comprasTotales || 0,
        fechaInicioNivel: meta.fechaInicioNivel || meta.inicio,
        fechaVencimientoNivel: meta.fechaVencimientoNivel || meta.vence
      };

      const nuevaFidelidad = FidelidadService.registrarCompra(fidelidadActual);

      // Keep metadata compact to strictly fit inside VARCHAR(255)
      const compactMeta = {
        direccion: cleanDir,
        tipo: nuevaFidelidad.tipo,
        ciclo: nuevaFidelidad.comprasCiclo,
        inicio: nuevaFidelidad.fechaInicioNivel ? String(nuevaFidelidad.fechaInicioNivel).substring(0, 10) : null,
        vence: nuevaFidelidad.fechaVencimientoNivel ? String(nuevaFidelidad.fechaVencimientoNivel).substring(0, 10) : null
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
