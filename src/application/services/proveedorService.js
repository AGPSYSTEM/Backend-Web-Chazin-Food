const { Proveedor, TipoProveedor, TipoDocumento, Insumo, Compra } = require('../../persistence/models');

class ProveedorService {
  static async getTipos() {
    const [tiposProveedor, tiposDocumento] = await Promise.all([
      TipoProveedor.findAll({ raw: true }),
      TipoDocumento.findAll({ raw: true })
    ]);
    return { tiposProveedor, tiposDocumento };
  }

  static async getAll() {
    const proveedores = await Proveedor.findAll({
      include: [
        { model: TipoProveedor, as: 'tipoProveedor' },
        { model: TipoDocumento, as: 'tipoDocumento' }
      ]
    });
    return proveedores.map(p => this._mapProveedor(p));
  }

  static async getById(idProveedor) {
    const p = await Proveedor.findByPk(idProveedor, {
      include: [
        { model: TipoProveedor, as: 'tipoProveedor' },
        { model: TipoDocumento, as: 'tipoDocumento' }
      ]
    });
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return this._mapProveedor(p);
  }

  static _mapProveedor(p) {
    const docNombre = p.tipoDocumento ? p.tipoDocumento.nombre : (p.idTipoDocumento === 3 ? 'NIT' : 'CC');
    const isJuridica = p.idTipoDocumento === 3 || docNombre === 'NIT';
    const tipoProvNombre = p.tipoProveedor ? p.tipoProveedor.nombre : (p.idTipoProveedor === 2 ? 'Distribuidor' : p.idTipoProveedor === 3 ? 'Fabricante' : 'Mayorista');

    return {
      idProveedor: p.idProveedor,
      id: p.idProveedor,
      nombre: p.nombre,
      idTipoProveedor: p.idTipoProveedor || 1,
      tipoProveedor: tipoProvNombre,
      tipoProveedorNombre: tipoProvNombre,
      idTipoDocumento: p.idTipoDocumento || (isJuridica ? 3 : 1),
      tipoDocumento: docNombre,
      tipoPersona: isJuridica ? 'Jurídica' : 'Natural',
      numeroDocumento: p.numeroDocumento || '',
      nit: p.numeroDocumento || '',
      documento: p.numeroDocumento || '',
      telefono: p.telefono || '',
      correo: p.correo || '',
      email: p.correo || '',
      direccion: p.direccion || '',
      nombreContacto: p.nombreContacto || '',
      contacto: p.nombreContacto || '',
      estado: p.estado === 1 ? 'Activo' : 'Inactivo'
    };
  }

  static async create(data) {
    let {
      nombre, numeroDocumento, nit, documento, telefono, correo, email,
      direccion, tipoPersona, idTipoProveedor, tipoProveedor,
      idTipoDocumento, estado, nombreContacto, contacto
    } = data;

    const finalNumeroDocumento = numeroDocumento || nit || documento || '';
    const finalCorreo = correo || email || '';
    let finalNombreContacto = nombreContacto || contacto || '';

    // Validar nombre requerido
    if (!nombre || !String(nombre).trim()) {
      const error = new Error('El nombre del proveedor es requerido.');
      error.statusCode = 400;
      throw error;
    }

    const existing = await Proveedor.findOne({ where: { nombre: nombre.trim() } });
    if (existing) {
      const error = new Error('Ya existe un proveedor registrado con ese nombre');
      error.statusCode = 400;
      throw error;
    }

    // Determinar idTipoProveedor (1: Mayorista, 2: Distribuidor, 3: Fabricante)
    let parsedTipoProv = Number(idTipoProveedor);
    if (!parsedTipoProv || isNaN(parsedTipoProv)) {
      if (tipoProveedor === 'Distribuidor') parsedTipoProv = 2;
      else if (tipoProveedor === 'Fabricante') parsedTipoProv = 3;
      else parsedTipoProv = 1; // Mayorista
    }

    // Determinar idTipoDocumento y tipoPersona
    let parsedTipoDoc = Number(idTipoDocumento);
    const esJuridica = tipoPersona === 'Jurídica' || parsedTipoDoc === 3;
    if (esJuridica) {
      parsedTipoDoc = 3; // NIT
    } else {
      if (!parsedTipoDoc || parsedTipoDoc === 3) parsedTipoDoc = 1; // CC por defecto para Natural
    }

    // Si es Persona Natural y no viene nombre de contacto, autocompletar con el nombre principal
    if (!esJuridica && (!finalNombreContacto || !String(finalNombreContacto).trim())) {
      finalNombreContacto = nombre.trim();
    }

    const estadoInt = (estado === undefined || estado === 'Activo' || estado === 1 || estado === '1') ? 1 : 0;

    const proveedor = await Proveedor.create({
      nombre: nombre.trim(),
      idTipoProveedor: parsedTipoProv,
      idTipoDocumento: parsedTipoDoc,
      numeroDocumento: finalNumeroDocumento,
      telefono: telefono || '',
      correo: finalCorreo,
      direccion: direccion || '',
      nombreContacto: finalNombreContacto,
      estado: estadoInt
    });

    return this.getById(proveedor.idProveedor);
  }

  static async update(idProveedor, data) {
    const p = await Proveedor.findByPk(idProveedor);
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }

    let {
      nombre, numeroDocumento, nit, documento, telefono, correo, email,
      direccion, tipoPersona, idTipoProveedor, tipoProveedor,
      idTipoDocumento, estado, nombreContacto, contacto
    } = data;

    const finalNumeroDocumento = numeroDocumento !== undefined ? numeroDocumento : (nit !== undefined ? nit : documento);
    const finalCorreo = correo !== undefined ? correo : email;
    const finalNombreContacto = nombreContacto !== undefined ? nombreContacto : contacto;

    if (nombre !== undefined) p.nombre = nombre.trim();
    if (finalNumeroDocumento !== undefined) p.numeroDocumento = finalNumeroDocumento || '';
    if (telefono !== undefined) p.telefono = telefono || '';
    if (finalCorreo !== undefined) p.correo = finalCorreo || '';
    if (direccion !== undefined) p.direccion = direccion || '';
    if (finalNombreContacto !== undefined) p.nombreContacto = finalNombreContacto || '';

    // Actualizar tipo de proveedor
    if (idTipoProveedor !== undefined) {
      p.idTipoProveedor = Number(idTipoProveedor) || p.idTipoProveedor;
    } else if (tipoProveedor !== undefined) {
      if (tipoProveedor === 'Distribuidor') p.idTipoProveedor = 2;
      else if (tipoProveedor === 'Fabricante') p.idTipoProveedor = 3;
      else if (tipoProveedor === 'Mayorista') p.idTipoProveedor = 1;
    }

    // Actualizar tipo de documento / persona
    if (tipoPersona !== undefined) {
      if (tipoPersona === 'Jurídica') p.idTipoDocumento = 3;
      else if (p.idTipoDocumento === 3) p.idTipoDocumento = 1;
    }
    if (idTipoDocumento !== undefined) {
      p.idTipoDocumento = Number(idTipoDocumento) || p.idTipoDocumento;
    }

    if (estado !== undefined) p.estado = (estado === 'Activo' || estado === 1) ? 1 : 0;

    await p.save();
    return this.getById(idProveedor);
  }

  static async toggleEstado(idProveedor, estado) {
    const p = await Proveedor.findByPk(idProveedor);
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }

    let nuevoEstado = 1;
    if (estado !== undefined) {
      nuevoEstado = (estado === 'Activo' || estado === 1 || estado === '1' || estado === true) ? 1 : 0;
    } else {
      nuevoEstado = p.estado === 1 ? 0 : 1;
    }

    p.estado = nuevoEstado;
    await p.save();
    return this.getById(idProveedor);
  }

  static async delete(idProveedor) {
    const p = await Proveedor.findByPk(idProveedor);
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }

    p.estado = 0;
    await p.save();
    return { message: 'Proveedor inactivado exitosamente' };
  }

  static async restore(idProveedor) {
    const p = await Proveedor.findByPk(idProveedor);
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }
    p.estado = 1;
    await p.save();
    return this.getById(idProveedor);
  }

  static async deletePermanente(idProveedor) {
    const p = await Proveedor.findByPk(idProveedor);
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const insumosAsociados = await Insumo.count({ where: { idProveedor } });
    const comprasAsociadas = await Compra.count({ where: { idProveedor } });

    if (insumosAsociados > 0 || comprasAsociadas > 0) {
      const error = new Error(`No se puede eliminar el proveedor porque tiene ${insumosAsociados > 0 ? insumosAsociados + ' insumo(s)' : ''}${insumosAsociados > 0 && comprasAsociadas > 0 ? ' y ' : ''}${comprasAsociadas > 0 ? comprasAsociadas + ' compra(s)' : ''} asociado(s).`);
      error.statusCode = 400;
      throw error;
    }

    await p.destroy();

    const { resequenceTableIds } = require('../../infrastructure/utils/dbUtils');
    await resequenceTableIds('proveedor', 'idProveedor', ['insumo', 'compra']);

    return { message: 'Proveedor eliminado permanentemente' };
  }
}

module.exports = ProveedorService;
