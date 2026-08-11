const { FichaTecnica, DetalleFichaInsumo, Insumo, Product, Variante } = require('../../persistence/models');
const { resequenceTableIds } = require('../../infrastructure/utils/dbUtils');

class FichaTecnicaService {
  static formatFicha(f) {
    if (!f) return null;
    return {
      id: f.idFichaTecnica,
      idFichaTecnica: f.idFichaTecnica,
      idProducto: f.idProducto,
      idInsumo: f.idInsumo,
      idVariante: f.idVariante,
      tipo: f.tipo || (f.idInsumo ? 'INSUMO' : 'PRODUCTO'),
      procedimiento: f.procedimiento || f.descripcion || '',
      tiempoPreparacion: f.tiempoPreparacion || 0,
      rendimiento: f.rendimiento || '',
      especificaciones: f.especificaciones || '',
      caracteristicas: f.caracteristicas || '',
      informacionNutricional: f.informacionNutricional || '',
      condicionesAlmacenamiento: f.condicionesAlmacenamiento || '',
      vidaUtil: f.vidaUtil || '',
      observaciones: f.observaciones || '',
      fechaCreacion: f.fechaCreacion,
      producto: f.producto || null,
      insumoInfo: f.insumoInfo || null,
      variante: f.variante || null,
      detalles: (f.detalles || []).map(d => ({
        idDetalleFicha: d.idDetalleFicha,
        idInsumo: d.idInsumo,
        cantidad: Number(d.cantidad || 0),
        unidadMedida: d.unidadMedida || d.insumo?.unidadMedida || 'und',
        insumo: d.insumo || null
      }))
    };
  }

  static async getAll() {
    const fichas = await FichaTecnica.findAll({
      include: [
        {
          model: DetalleFichaInsumo,
          as: 'detalles',
          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
        },
        { model: Product, as: 'producto', attributes: ['idProducto', 'nombre', 'estado'] },
        { model: Insumo, as: 'insumoInfo', attributes: ['idInsumo', 'nombre', 'estado'] },
        { model: Variante, as: 'variante', attributes: ['idVariante', 'nombre', 'precio'] }
      ],
      order: [['idFichaTecnica', 'ASC']]
    });

    const filtered = fichas.filter(f => {
      const insumoActivo = f.insumoInfo === null || f.insumoInfo === undefined
        ? true
        : (f.insumoInfo.estado === null || f.insumoInfo.estado === undefined || f.insumoInfo.estado === 1);
      const productoActivo = f.producto === null || f.producto === undefined
        ? true
        : (f.producto.estado === null || f.producto.estado === undefined || f.producto.estado === 1);
      return insumoActivo && productoActivo;
    });

    return filtered.map(f => this.formatFicha(f));
  }

  static async getById(id) {
    const f = await FichaTecnica.findByPk(id, {
      include: [
        {
          model: DetalleFichaInsumo,
          as: 'detalles',
          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
        },
        { model: Product, as: 'producto' },
        { model: Insumo, as: 'insumoInfo' },
        { model: Variante, as: 'variante' }
      ]
    });
    if (!f) return null;
    return this.formatFicha(f);
  }

  static async getByProductoId(idProducto) {
    const f = await FichaTecnica.findOne({
      where: { idProducto },
      include: [
        {
          model: DetalleFichaInsumo,
          as: 'detalles',
          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
        },
        { model: Variante, as: 'variante' },
        { model: Product, as: 'producto', attributes: ['idProducto', 'nombre', 'estado'] }
      ]
    });
    if (f && f.producto && (f.producto.estado !== null && f.producto.estado !== undefined && f.producto.estado !== 1)) {
      return null;
    }
    return f ? this.formatFicha(f) : null;
  }

  static async getByInsumoId(idInsumo) {
    const f = await FichaTecnica.findOne({
      where: { idInsumo },
      include: [
        {
          model: DetalleFichaInsumo,
          as: 'detalles',
          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
        },
        { model: Variante, as: 'variante' },
        { model: Insumo, as: 'insumoInfo', attributes: ['idInsumo', 'nombre', 'estado'] }
      ]
    });
    if (f && f.insumoInfo && (f.insumoInfo.estado !== null && f.insumoInfo.estado !== undefined && f.insumoInfo.estado !== 1)) {
      return null;
    }
    return f ? this.formatFicha(f) : null;
  }

  static async resolveVarianteId(idProducto, idInsumo, inputVarianteId) {
    if (inputVarianteId !== undefined && inputVarianteId !== null) return parseInt(inputVarianteId);
    if (idProducto) {
      const v = await Variante.findOne({ where: { idProducto } });
      if (v) return v.idVariante;
      return 1;
    }
    // For insumos, idVariante defaults to 0 (No Aplica / Sin Variante) so it is never NULL in DB
    return 0;
  }

  static async saveForProducto(idProducto, data) {
    let f = await FichaTecnica.findOne({ where: { idProducto } });
    const resolvedVarianteId = await this.resolveVarianteId(idProducto, null, data.idVariante);

    if (!f) {
      f = await FichaTecnica.create({
        idProducto,
        idInsumo: 0,
        idVariante: resolvedVarianteId,
        tipo: 'PRODUCTO',
        descripcion: data.caracteristicas || data.descripcion || '',
        procedimiento: data.procedimiento || '',
        tiempoPreparacion: Number(data.tiempoPreparacion) || 0,
        rendimiento: data.rendimiento || '',
        especificaciones: data.especificaciones || '',
        caracteristicas: data.caracteristicas || '',
        informacionNutricional: data.informacionNutricional || '',
        condicionesAlmacenamiento: data.condicionesAlmacenamiento || '',
        vidaUtil: data.vidaUtil || '',
        observaciones: data.observaciones || ''
      });
    } else {
      await f.update({
        idVariante: resolvedVarianteId !== null ? resolvedVarianteId : f.idVariante,
        descripcion: data.caracteristicas !== undefined ? data.caracteristicas : (data.descripcion !== undefined ? data.descripcion : f.descripcion),
        procedimiento: data.procedimiento !== undefined ? data.procedimiento : f.procedimiento,
        tiempoPreparacion: data.tiempoPreparacion !== undefined ? Number(data.tiempoPreparacion) : f.tiempoPreparacion,
        rendimiento: data.rendimiento !== undefined ? data.rendimiento : f.rendimiento,
        especificaciones: data.especificaciones !== undefined ? data.especificaciones : f.especificaciones,
        caracteristicas: data.caracteristicas !== undefined ? data.caracteristicas : f.caracteristicas,
        informacionNutricional: data.informacionNutricional !== undefined ? data.informacionNutricional : f.informacionNutricional,
        condicionesAlmacenamiento: data.condicionesAlmacenamiento !== undefined ? data.condicionesAlmacenamiento : f.condicionesAlmacenamiento,
        vidaUtil: data.vidaUtil !== undefined ? data.vidaUtil : f.vidaUtil,
        observaciones: data.observaciones !== undefined ? data.observaciones : f.observaciones
      });
    }

    if (Array.isArray(data.detalles || data.insumos)) {
      const inputDetalles = data.detalles || data.insumos;
      await DetalleFichaInsumo.destroy({ where: { idFichaTecnica: f.idFichaTecnica } });
      if (inputDetalles.length > 0) {
        const payload = inputDetalles.map(d => ({
          idFichaTecnica: f.idFichaTecnica,
          idInsumo: d.idInsumo || d.id,
          cantidad: Number(d.cantidad || 1),
          unidadMedida: d.unidadMedida || 'und'
        }));
        await DetalleFichaInsumo.bulkCreate(payload);
      }
    }

    return this.getById(f.idFichaTecnica);
  }

  static async saveForInsumo(idInsumo, data) {
    let f = await FichaTecnica.findOne({ where: { idInsumo } });
    const resolvedVarianteId = await this.resolveVarianteId(null, idInsumo, data.idVariante);

    if (!f) {
      f = await FichaTecnica.create({
        idProducto: 0,
        idInsumo,
        idVariante: resolvedVarianteId,
        tipo: 'INSUMO',
        descripcion: data.caracteristicas || data.descripcion || '',
        procedimiento: data.procedimiento || '',
        tiempoPreparacion: Number(data.tiempoPreparacion) || 0,
        rendimiento: data.rendimiento || '',
        especificaciones: data.especificaciones || '',
        caracteristicas: data.caracteristicas || '',
        informacionNutricional: data.informacionNutricional || '',
        condicionesAlmacenamiento: data.condicionesAlmacenamiento || '',
        vidaUtil: data.vidaUtil || '',
        observaciones: data.observaciones || ''
      });
    } else {
      await f.update({
        idVariante: resolvedVarianteId !== null ? resolvedVarianteId : f.idVariante,
        descripcion: data.caracteristicas !== undefined ? data.caracteristicas : (data.descripcion !== undefined ? data.descripcion : f.descripcion),
        procedimiento: data.procedimiento !== undefined ? data.procedimiento : f.procedimiento,
        tiempoPreparacion: data.tiempoPreparacion !== undefined ? Number(data.tiempoPreparacion) : f.tiempoPreparacion,
        rendimiento: data.rendimiento !== undefined ? data.rendimiento : f.rendimiento,
        especificaciones: data.especificaciones !== undefined ? data.especificaciones : f.especificaciones,
        caracteristicas: data.caracteristicas !== undefined ? data.caracteristicas : f.caracteristicas,
        informacionNutricional: data.informacionNutricional !== undefined ? data.informacionNutricional : f.informacionNutricional,
        condicionesAlmacenamiento: data.condicionesAlmacenamiento !== undefined ? data.condicionesAlmacenamiento : f.condicionesAlmacenamiento,
        vidaUtil: data.vidaUtil !== undefined ? data.vidaUtil : f.vidaUtil,
        observaciones: data.observaciones !== undefined ? data.observaciones : f.observaciones
      });
    }

    if (Array.isArray(data.detalles || data.insumos)) {
      const inputDetalles = data.detalles || data.insumos;
      await DetalleFichaInsumo.destroy({ where: { idFichaTecnica: f.idFichaTecnica } });
      if (inputDetalles.length > 0) {
        const payload = inputDetalles.map(d => ({
          idFichaTecnica: f.idFichaTecnica,
          idInsumo: d.idInsumo || d.id,
          cantidad: Number(d.cantidad || 1),
          unidadMedida: d.unidadMedida || 'und'
        }));
        await DetalleFichaInsumo.bulkCreate(payload);
      }
    }

    return this.getById(f.idFichaTecnica);
  }

  static async create(data) {
    if (data.idProducto) {
      return this.saveForProducto(data.idProducto, data);
    }
    if (data.idInsumo) {
      return this.saveForInsumo(data.idInsumo, data);
    }

    const resolvedVarianteId = await this.resolveVarianteId(null, null, data.idVariante);

    const ficha = await FichaTecnica.create({
      idVariante: resolvedVarianteId,
      tipo: data.tipo || 'PRODUCTO',
      procedimiento: data.procedimiento || data.descripcion || null,
      tiempoPreparacion: Number(data.tiempoPreparacion) || 0,
      rendimiento: data.rendimiento || null,
      especificaciones: data.especificaciones || null,
      caracteristicas: data.caracteristicas || null,
      informacionNutricional: data.informacionNutricional || null,
      condicionesAlmacenamiento: data.condicionesAlmacenamiento || null,
      vidaUtil: data.vidaUtil || null,
      observaciones: data.observaciones || null
    });

    const inputDetalles = data.detalles || data.insumos || [];
    if (inputDetalles.length > 0) {
      const detalles = inputDetalles.map(d => ({
        idFichaTecnica: ficha.idFichaTecnica,
        idInsumo: d.idInsumo || d.id,
        cantidad: Number(d.cantidad || 1),
        unidadMedida: d.unidadMedida || 'und'
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
    if (data.procedimiento !== undefined) f.procedimiento = data.procedimiento;
    if (data.tiempoPreparacion !== undefined) f.tiempoPreparacion = Number(data.tiempoPreparacion);
    if (data.rendimiento !== undefined) f.rendimiento = data.rendimiento;
    if (data.especificaciones !== undefined) f.especificaciones = data.especificaciones;
    if (data.caracteristicas !== undefined) f.caracteristicas = data.caracteristicas;
    if (data.informacionNutricional !== undefined) f.informacionNutricional = data.informacionNutricional;
    if (data.condicionesAlmacenamiento !== undefined) f.condicionesAlmacenamiento = data.condicionesAlmacenamiento;
    if (data.vidaUtil !== undefined) f.vidaUtil = data.vidaUtil;
    if (data.observaciones !== undefined) f.observaciones = data.observaciones;

    await f.save();

    const inputDetalles = data.detalles || data.insumos;
    if (Array.isArray(inputDetalles)) {
      await DetalleFichaInsumo.destroy({ where: { idFichaTecnica: id } });
      if (inputDetalles.length > 0) {
        const detalles = inputDetalles.map(d => ({
          idFichaTecnica: id,
          idInsumo: d.idInsumo || d.id,
          cantidad: Number(d.cantidad || 1),
          unidadMedida: d.unidadMedida || 'und'
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

    await resequenceTableIds('fichatecnica', 'idFichaTecnica', [
      { table: 'detallefichainsumo', column: 'idFichaTecnica' }
    ]);

    return { message: 'Ficha técnica eliminada exitosamente' };
  }

  static async deleteByInsumoId(idInsumo, options = {}) {
    const fichas = await FichaTecnica.findAll({
      where: { idInsumo },
      transaction: options.transaction
    });

    for (const ficha of fichas) {
      await DetalleFichaInsumo.destroy({
        where: { idFichaTecnica: ficha.idFichaTecnica },
        transaction: options.transaction
      });
      await ficha.destroy({ transaction: options.transaction });
    }
  }
}

module.exports = FichaTecnicaService;
