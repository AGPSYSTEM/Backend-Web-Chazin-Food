const { Adicion, Insumo } = require('../../persistence/models');

class AdicionService {
  static async getAll() {
    return await Adicion.findAll({
      where: { estado: 1 },
      include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre'] }]
    });
  }

  static async getById(id) {
    const adicion = await Adicion.findByPk(id, {
      include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre'] }]
    });
    if (!adicion) {
      const error = new Error('Adición no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return adicion;
  }

  static async create(data) {
    const { idInsumo, nombre, descripcion, imagen, precio, estado } = data;

    if (!idInsumo || !nombre || precio === undefined) {
      const error = new Error('Insumo, nombre y precio son obligatorios para la adición');
      error.statusCode = 400;
      throw error;
    }

    const adicion = await Adicion.create({
      idInsumo,
      nombre: nombre.trim(),
      descripcion: descripcion || '',
      imagen: imagen || '',
      precio: parseFloat(precio),
      estado: estado === 'Inactivo' || estado === 0 ? 0 : 1
    });

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.registrarMovimiento({
      entidad: 'Adicion',
      idEntidad: adicion.idAdicion,
      accion: 'Creacion',
      detalles: `Se creó la adición ${adicion.nombre} por $${adicion.precio}`
    });

    return this.getById(adicion.idAdicion);
  }

  static async update(id, data) {
    const adicion = await Adicion.findByPk(id);
    if (!adicion) {
      const error = new Error('Adición no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const { idInsumo, nombre, descripcion, imagen, precio, estado } = data;
    
    if (idInsumo !== undefined) adicion.idInsumo = idInsumo;
    if (nombre !== undefined) adicion.nombre = nombre.trim();
    if (descripcion !== undefined) adicion.descripcion = descripcion;
    if (imagen !== undefined) adicion.imagen = imagen;
    if (precio !== undefined) adicion.precio = parseFloat(precio);
    if (estado !== undefined) adicion.estado = (estado === 'Activo' || estado === 1 || estado === '1') ? 1 : 0;

    await adicion.save();
    
    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.registrarMovimiento({
      entidad: 'Adicion',
      idEntidad: adicion.idAdicion,
      accion: 'Actualizacion',
      detalles: `Se actualizó la adición ${adicion.nombre}`
    });

    return this.getById(id);
  }

  static async softDelete(id) {
    const adicion = await Adicion.findByPk(id);
    if (!adicion) {
      const error = new Error('Adición no encontrada');
      error.statusCode = 404;
      throw error;
    }

    adicion.estado = 0;
    await adicion.save();

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.registrarMovimiento({
      entidad: 'Adicion',
      idEntidad: adicion.idAdicion,
      accion: 'Eliminacion (Soft)',
      detalles: `Se desactivó la adición ${adicion.nombre}`
    });

    return { message: 'Adición desactivada' };
  }
}

module.exports = AdicionService;
