const { Proveedor, Insumo, Compra } = require('../../persistence/models');

class ProveedorService {
  static async getAll() {
    const proveedores = await Proveedor.findAll();
    return proveedores.map(p => ({
      idProveedor: p.idProveedor,
      id: p.idProveedor,
      nombre: p.nombre,
      idTipoProveedor: p.idTipoProveedor,
      tipoPersona: p.idTipoProveedor === 1 ? 'Jurídica' : 'Natural',
      idTipoDocumento: p.idTipoDocumento,
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
    }));
  }

  static async getById(idProveedor) {
    const p = await Proveedor.findByPk(idProveedor);
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return {
      idProveedor: p.idProveedor,
      id: p.idProveedor,
      nombre: p.nombre,
      idTipoProveedor: p.idTipoProveedor,
      tipoPersona: p.idTipoProveedor === 1 ? 'Jurídica' : 'Natural',
      idTipoDocumento: p.idTipoDocumento,
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
    const { nombre, numeroDocumento, nit, documento, telefono, correo, email, direccion, tipoPersona, estado, nombreContacto, contacto } = data;
    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre del proveedor es requerido');
      error.statusCode = 400;
      throw error;
    }

    const existing = await Proveedor.findOne({ where: { nombre: nombre.trim() } });
    if (existing) {
      const error = new Error('Ya existe un proveedor registrado con ese nombre');
      error.statusCode = 400;
      throw error;
    }

    const finalNumeroDocumento = numeroDocumento || nit || documento || '';
    const finalCorreo = correo || email || '';
    const finalNombreContacto = nombreContacto || contacto || '';
    const idTipoProveedor = tipoPersona === 'Natural' ? 2 : 1;
    const estadoInt = estado === 'Activo' || estado === 1 ? 1 : 0;

    const proveedor = await Proveedor.create({
      nombre: nombre.trim(),
      idTipoProveedor,
      idTipoDocumento: 1,
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

    const { nombre, numeroDocumento, nit, documento, telefono, correo, email, direccion, tipoPersona, estado, nombreContacto, contacto } = data;

    const finalNumeroDocumento = numeroDocumento !== undefined ? numeroDocumento : (nit !== undefined ? nit : documento);
    const finalCorreo = correo !== undefined ? correo : email;
    const finalNombreContacto = nombreContacto !== undefined ? nombreContacto : contacto;

    if (nombre !== undefined) p.nombre = nombre.trim();
    if (finalNumeroDocumento !== undefined) p.numeroDocumento = finalNumeroDocumento || '';
    if (telefono !== undefined) p.telefono = telefono || '';
    if (finalCorreo !== undefined) p.correo = finalCorreo || '';
    if (direccion !== undefined) p.direccion = direccion || '';
    if (finalNombreContacto !== undefined) p.nombreContacto = finalNombreContacto || '';
    if (tipoPersona !== undefined) p.idTipoProveedor = tipoPersona === 'Natural' ? 2 : 1;
    if (estado !== undefined) p.estado = estado === 'Activo' || estado === 1 ? 1 : 0;

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

    const insumosAsociados = await Insumo.count({ where: { idProveedor } });
    const comprasAsociadas = await Compra.count({ where: { idProveedor } });

    if (insumosAsociados > 0 || comprasAsociadas > 0) {
      const error = new Error(`No se puede eliminar el proveedor porque tiene ${insumosAsociados > 0 ? insumosAsociados + ' insumo(s)' : ''}${insumosAsociados > 0 && comprasAsociadas > 0 ? ' y ' : ''}${comprasAsociadas > 0 ? comprasAsociadas + ' compra(s)' : ''} asociado(s).`);
      error.statusCode = 400;
      throw error;
    }

    await p.destroy();
    const { resetAutoIncrement } = require('../../infrastructure/utils/dbUtils');
    await resetAutoIncrement('proveedor', 'idProveedor');

    return { message: 'Proveedor eliminado exitosamente' };
  }
}

module.exports = ProveedorService;
