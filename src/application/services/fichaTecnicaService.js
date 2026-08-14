const { Sequelize } = require('sequelize');
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
      varianteNombre: f.variante?.nombre || 'No aplica',
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
      detalles: (f.detalles || []).map((d) => ({
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
      where: { estado: 1 },
      include: [
        {
          model: DetalleFichaInsumo,
          as: 'detalles',
          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida', 'estado'] }]
        },
        { model: Product, as: 'producto', attributes: ['idProducto', 'nombre', 'estado'] },
        { model: Insumo, as: 'insumoInfo', attributes: ['idInsumo', 'nombre', 'estado'] },
        { model: Variante, as: 'variante', attributes: ['idVariante', 'nombre', 'precio'] }
      ],
      order: [['idFichaTecnica', 'ASC']]
    });

    const filtered = fichas.filter((f) => {
      const insumoActivo = !f.insumoInfo || f.insumoInfo.estado === null || f.insumoInfo.estado === undefined || f.insumoInfo.estado === 1;
      const productoActivo = !f.producto || f.producto.estado === null || f.producto.estado === undefined || f.producto.estado === 1;
      return insumoActivo && productoActivo;
    });

    return filtered.map((f) => this.formatFicha(f));
  }

  static async getById(id) {
    const f = await FichaTecnica.findOne({
      where: { idFichaTecnica: id, estado: 1 },
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
      where: { idProducto, estado: 1 },
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

    if (f && f.producto && f.producto.estado !== null && f.producto.estado !== undefined && f.producto.estado !== 1) {
      return null;
    }

    return f ? this.formatFicha(f) : null;
  }

  static async getByInsumoId(idInsumo) {
    const f = await FichaTecnica.findOne({
      where: { idInsumo, estado: 1 },
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

    if (f && f.insumoInfo && f.insumoInfo.estado !== null && f.insumoInfo.estado !== undefined && f.insumoInfo.estado !== 1) {
      return null;
    }

    return f ? this.formatFicha(f) : null;
  }

  static async resolveVarianteId(idProducto, idInsumo, inputVarianteId) {
    if (inputVarianteId !== undefined && inputVarianteId !== null) {
      return parseInt(inputVarianteId, 10);
    }

    if (idProducto) {
      const v = await Variante.findOne({ where: { idProducto } });
      if (v) return v.idVariante;
      return 1;
    }

    if (idInsumo) return 0;
    return null;
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
        descripcion: data.descripcion || data.caracteristicas || '',
        procedimiento: data.procedimiento || '',
        tiempoPreparacion: Number(data.tiempoPreparacion) || 0,
        rendimiento: data.rendimiento || '',
        especificaciones: data.especificaciones || '',
        caracteristicas: data.caracteristicas || '',
        informacionNutricional: data.informacionNutricional || '',
        condicionesAlmacenamiento: data.condicionesAlmacenamiento || '',
        vidaUtil: data.vidaUtil || '',
        observaciones: data.observaciones || '',
        fechaCreacion: Sequelize.literal("CONVERT_TZ(NOW(), '+00:00', '-05:00')")
      });
    } else {
      const updatePayload = {
        estado: 1,
        estado: 1
      });
    } else {
      await f.update({
        idProducto,
        idInsumo: 0,
        idVariante: resolvedVarianteId !== null ? resolvedVarianteId : f.idVariante,
        descripcion: data.descripcion !== undefined ? data.descripcion : (data.caracteristicas !== undefined ? data.caracteristicas : f.descripcion),
        procedimiento: data.procedimiento !== undefined ? data.procedimiento : f.procedimiento,
        tiempoPreparacion: data.tiempoPreparacion !== undefined ? Number(data.tiempoPreparacion) : f.tiempoPreparacion,
        rendimiento: data.rendimiento !== undefined ? data.rendimiento : f.rendimiento,
        especificaciones: data.especificaciones !== undefined ? data.especificaciones : f.especificaciones,
        caracteristicas: data.caracteristicas !== undefined ? data.caracteristicas : f.caracteristicas,
        informacionNutricional: data.informacionNutricional !== undefined ? data.informacionNutricional : f.informacionNutricional,
        condicionesAlmacenamiento: data.condicionesAlmacenamiento !== undefined ? data.condicionesAlmacenamiento : f.condicionesAlmacenamiento,
        vidaUtil: data.vidaUtil !== undefined ? data.vidaUtil : f.vidaUtil,
        observaciones: data.observaciones !== undefined ? data.observaciones : f.observaciones
      };
      if (f.estado === 0) {
        updatePayload.fechaCreacion = Sequelize.literal("CONVERT_TZ(NOW(), '+00:00', '-05:00')");
      }
      await f.update(updatePayload);
        observaciones: data.observaciones !== undefined ? data.observaciones : f.observaciones,
        estado: data.estado !== undefined ? data.estado : f.estado
      });
    }

    const inputDetalles = data.detalles || data.insumos || [];
    await DetalleFichaInsumo.destroy({ where: { idFichaTecnica: f.idFichaTecnica } });

    if (inputDetalles.length > 0) {
      const payload = inputDetalles.map((d) => ({
        idFichaTecnica: f.idFichaTecnica,
        idInsumo: d.idInsumo || d.id,
        cantidad: Number(d.cantidad || 1),
        unidadMedida: d.unidadMedida || 'und'
      }));
      await DetalleFichaInsumo.bulkCreate(payload);
    }

    await resequenceTableIds('fichatecnica', 'idFichaTecnica', [
      { table: 'detallefichainsumo', column: 'idFichaTecnica' }
    ]);

    return this.getById(f.idFichaTecnica);
  }

  static async saveForInsumo(idInsumo, data, options = {}) {
    let f = await FichaTecnica.findOne({ where: { idInsumo }, transaction: options.transaction });
    const resolvedVarianteId = await this.resolveVarianteId(null, idInsumo, data.idVariante);

    if (!f) {
      f = await FichaTecnica.create({
        idProducto: 0,
        idInsumo,
        idVariante: resolvedVarianteId,
        tipo: 'INSUMO',
        descripcion: data.descripcion || data.caracteristicas || '',
        procedimiento: data.procedimiento || '',
        tiempoPreparacion: Number(data.tiempoPreparacion) || 0,
        rendimiento: data.rendimiento || '',
        especificaciones: data.especificaciones || '',
        caracteristicas: data.caracteristicas || '',
        informacionNutricional: data.informacionNutricional || '',
        condicionesAlmacenamiento: data.condicionesAlmacenamiento || '',
        vidaUtil: data.vidaUtil || '',
        observaciones: data.observaciones || '',
        fechaCreacion: Sequelize.literal("CONVERT_TZ(NOW(), '+00:00', '-05:00')")
      }, { transaction: options.transaction });
    } else {
      const updatePayload = {
        estado: 1,
        estado: 1
      }, { transaction: options.transaction });
    } else {
      await f.update({
        idProducto: 0,
        idInsumo,
        idVariante: resolvedVarianteId !== null ? resolvedVarianteId : f.idVariante,
        descripcion: data.descripcion !== undefined ? data.descripcion : (data.caracteristicas !== undefined ? data.caracteristicas : f.descripcion),
        procedimiento: data.procedimiento !== undefined ? data.procedimiento : f.procedimiento,
        tiempoPreparacion: data.tiempoPreparacion !== undefined ? Number(data.tiempoPreparacion) : f.tiempoPreparacion,
        rendimiento: data.rendimiento !== undefined ? data.rendimiento : f.rendimiento,
        especificaciones: data.especificaciones !== undefined ? data.especificaciones : f.especificaciones,
        caracteristicas: data.caracteristicas !== undefined ? data.caracteristicas : f.caracteristicas,
        informacionNutricional: data.informacionNutricional !== undefined ? data.informacionNutricional : f.informacionNutricional,
        condicionesAlmacenamiento: data.condicionesAlmacenamiento !== undefined ? data.condicionesAlmacenamiento : f.condicionesAlmacenamiento,
        vidaUtil: data.vidaUtil !== undefined ? data.vidaUtil : f.vidaUtil,
        observaciones: data.observaciones !== undefined ? data.observaciones : f.observaciones
      };
      if (f.estado === 0) {
        updatePayload.fechaCreacion = Sequelize.literal("CONVERT_TZ(NOW(), '+00:00', '-05:00')");
      }
      await f.update(updatePayload, { transaction: options.transaction });
        observaciones: data.observaciones !== undefined ? data.observaciones : f.observaciones,
        estado: data.estado !== undefined ? data.estado : f.estado
      }, { transaction: options.transaction });
    }

    const inputDetalles = data.detalles || data.insumos || [];
    await DetalleFichaInsumo.destroy({
      where: { idFichaTecnica: f.idFichaTecnica },
      transaction: options.transaction
    });

    if (inputDetalles.length > 0) {
      const payload = inputDetalles.map((d) => ({
        idFichaTecnica: f.idFichaTecnica,
        idInsumo: d.idInsumo || d.id,
        cantidad: Number(d.cantidad || 1),
        unidadMedida: d.unidadMedida || 'und'
      }));
      await DetalleFichaInsumo.bulkCreate(payload, { transaction: options.transaction });
    }

    return options.skipReload ? f : this.getById(f.idFichaTecnica);
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
      idProducto: data.idProducto || null,
      idInsumo: data.idInsumo || null,
      idVariante: resolvedVarianteId,
      tipo: data.tipo || 'PRODUCTO',
      descripcion: data.descripcion || data.caracteristicas || null,
      procedimiento: data.procedimiento || null,
      tiempoPreparacion: Number(data.tiempoPreparacion) || 0,
      rendimiento: data.rendimiento || null,
      especificaciones: data.especificaciones || null,
      caracteristicas: data.caracteristicas || null,
      informacionNutricional: data.informacionNutricional || null,
      condicionesAlmacenamiento: data.condicionesAlmacenamiento || null,
      vidaUtil: data.vidaUtil || null,
      observaciones: data.observaciones || null,
      fechaCreacion: Sequelize.literal("CONVERT_TZ(NOW(), '+00:00', '-05:00')")
      estado: 1
    });

    const inputDetalles = data.detalles || data.insumos || [];
    if (inputDetalles.length > 0) {
      const detalles = inputDetalles.map((d) => ({
        idFichaTecnica: ficha.idFichaTecnica,
        idInsumo: d.idInsumo || d.id,
        cantidad: Number(d.cantidad || 1),
        unidadMedida: d.unidadMedida || 'und'
      }));
      await DetalleFichaInsumo.bulkCreate(detalles);
    }

    await resequenceTableIds('fichatecnica', 'idFichaTecnica', [
      { table: 'detallefichainsumo', column: 'idFichaTecnica' }
    ]);

    return this.getById(ficha.idFichaTecnica);
  }

  static async update(id, data) {
    const f = await FichaTecnica.findByPk(id);
    if (!f) {
      const error = new Error('Ficha técnica no encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (f.idInsumo) {
      f.idVariante = 0;
    } else if (data.idVariante !== undefined) {
      f.idVariante = data.idVariante;
    }

    if (data.idProducto !== undefined) f.idProducto = data.idProducto;
    if (data.idInsumo !== undefined) f.idInsumo = data.idInsumo;
    if (data.tipo !== undefined) f.tipo = data.tipo;
    if (data.descripcion !== undefined) f.descripcion = data.descripcion;
    if (data.procedimiento !== undefined) f.procedimiento = data.procedimiento;
    if (data.tiempoPreparacion !== undefined) f.tiempoPreparacion = Number(data.tiempoPreparacion);
    if (data.rendimiento !== undefined) f.rendimiento = data.rendimiento;
    if (data.especificaciones !== undefined) f.especificaciones = data.especificaciones;
    if (data.caracteristicas !== undefined) f.caracteristicas = data.caracteristicas;
    if (data.informacionNutricional !== undefined) f.informacionNutricional = data.informacionNutricional;
    if (data.condicionesAlmacenamiento !== undefined) f.condicionesAlmacenamiento = data.condicionesAlmacenamiento;
    if (data.vidaUtil !== undefined) f.vidaUtil = data.vidaUtil;
    if (data.observaciones !== undefined) f.observaciones = data.observaciones;
    if (data.estado !== undefined) f.estado = data.estado;

    await f.save();

    const inputDetalles = data.detalles || data.insumos;
    if (Array.isArray(inputDetalles)) {
      await DetalleFichaInsumo.destroy({ where: { idFichaTecnica: id } });
      if (inputDetalles.length > 0) {
        const detalles = inputDetalles.map((d) => ({
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

  static async softDeleteByInsumoId(idInsumo, options = {}) {
    await FichaTecnica.update(
      { estado: 0 },
      { where: { idInsumo }, transaction: options.transaction }
    );
  }

  static async restoreByInsumoId(idInsumo, options = {}) {
    await FichaTecnica.update(
      { estado: 1 },
      { where: { idInsumo }, transaction: options.transaction }
    );
  }
}

module.exports = FichaTecnicaService;
