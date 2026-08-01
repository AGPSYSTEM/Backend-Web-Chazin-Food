const { Proveedor } = require('../../persistence/models');

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
    if (!nombre) {
      const error = new Error('El nombre del proveedor es requerido');
      error.statusCode = 400;
      throw error;
    }

    const finalNumeroDocumento = numeroDocumento || nit || documento || '';
    const finalCorreo = correo || email || '';
    const finalNombreContacto = nombreContacto || contacto || '';
    const idTipoProveedor = tipoPersona === 'Natural' ? 2 : 1;
    const estadoInt = estado === 'Activo' || estado === 1 ? 1 : 0;

    const proveedor = await Proveedor.create({
      nombre,
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

    if (nombre !== undefined) p.nombre = nombre;
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

  static async delete(idProveedor) {
    const p = await Proveedor.findByPk(idProveedor);
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }
    p.estado = 0;
    await p.save();
    return { message: 'Proveedor desactivado exitosamente' };
  }
}

module.exports = ProveedorService;
