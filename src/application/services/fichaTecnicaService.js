const { FichaTecnica, DetalleFichaInsumo, Insumo } = require('../../persistence/models');

class FichaTecnicaService {
  static async getAll() {
    const fichas = await FichaTecnica.findAll({
      include: [{
        model: DetalleFichaInsumo,
        as: 'detalles',
        include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
      }],
      order: [['idFichaTecnica', 'DESC']]
    });
    return fichas.map(f => ({
      id: f.idFichaTecnica,
      idFichaTecnica: f.idFichaTecnica,
      idVariante: f.idVariante,
      descripcion: f.descripcion,
      fechaCreacion: f.fechaCreacion,
      detalles: (f.detalles || []).map(d => ({
        idDetalleFicha: d.idDetalleFicha,
        idInsumo: d.idInsumo,
        cantidad: d.cantidad,
        insumo: d.insumo || null
      }))
    }));
  }

  static async getById(id) {
    const f = await FichaTecnica.findByPk(id, {
      include: [{
        model: DetalleFichaInsumo,
        as: 'detalles',
        include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
      }]
    });
    if (!f) {
      const error = new Error('Ficha técnica no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return {
      id: f.idFichaTecnica,
      idFichaTecnica: f.idFichaTecnica,
      idVariante: f.idVariante,
      descripcion: f.descripcion,
      fechaCreacion: f.fechaCreacion,
      detalles: (f.detalles || []).map(d => ({
        idDetalleFicha: d.idDetalleFicha,
        idInsumo: d.idInsumo,
        cantidad: d.cantidad,
        insumo: d.insumo || null
      }))
    };
  }

  static async create(data) {
    const ficha = await FichaTecnica.create({
      idVariante: data.idVariante,
      descripcion: data.descripcion || null
    });

    if (data.detalles && data.detalles.length > 0) {
      const detalles = data.detalles.map(d => ({
        idFichaTecnica: ficha.idFichaTecnica,
        idInsumo: d.idInsumo,
        cantidad: d.cantidad
      }));
      await DetalleFichaInsumo.bulkCreate(detalles);
    }

    return this.getById(ficha.idFichaTecnica);
  }

  static async update(id, data) {
    const f = await FichaTecnica.findByPk(id);
    if (!f) {
      const error = new Error('Ficha técnica no encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (data.idVariante !== undefined) f.idVariante = data.idVariante;
    if (data.descripcion !== undefined) f.descripcion = data.descripcion;
    await f.save();

    if (data.detalles) {
      await DetalleFichaInsumo.destroy({ where: { idFichaTecnica: id } });
      if (data.detalles.length > 0) {
        const detalles = data.detalles.map(d => ({
          idFichaTecnica: id,
          idInsumo: d.idInsumo,
          cantidad: d.cantidad
        }));
        await DetalleFichaInsumo.bulkCreate(detalles);
      }
    }

    return this.getById(id);
  }

  static async delete(id) {
    const f = await FichaTecnica.findByPk(id);
    if (!f) {
      const error = new Error('Ficha técnica no encontrada');
      error.statusCode = 404;
      throw error;
    }
    await DetalleFichaInsumo.destroy({ where: { idFichaTecnica: id } });
    await f.destroy();
    return { message: 'Ficha técnica eliminada exitosamente' };
  }
}

module.exports = FichaTecnicaService;
