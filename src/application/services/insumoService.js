const { Insumo, CategoriaInsumo, Proveedor } = require('../../persistence/models');

class InsumoService {
  static async getAll() {
    const insumos = await Insumo.findAll({
      where: { estado: 1 },
      include: [
        { model: CategoriaInsumo, as: 'categoria' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });

    return insumos.map(i => ({
      idInsumo: i.idInsumo,
      id: i.idInsumo,
      nombre: i.nombre,
      idCategoriaInsumo: i.idCategoriaInsumo,
      stock: parseFloat(i.stock || 0),
      stockMinimo: parseFloat(i.stockMinimo || 0),
      fechaExpedicion: i.fechaExpedicion || null,
      fechaVencimiento: i.fechaVencimiento || null,
      unidadMedida: i.unidadMedida,
      precioUnitario: parseFloat(i.precioUnitario || 0),
      idProveedor: i.idProveedor,
      descripcion: i.descripcion || '',
      estado: i.estado,
      categoriaNombre: i.categoria ? i.categoria.nombre : 'Sin Categoría',
      proveedorNombre: i.proveedor ? i.proveedor.nombre : 'Sin Proveedor'
    }));
  }

  static async getDeleted() {
    const insumos = await Insumo.findAll({
      where: { estado: 0 },
      include: [
        { model: CategoriaInsumo, as: 'categoria' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });

    return insumos.map(i => ({
      idInsumo: i.idInsumo,
      id: i.idInsumo,
      nombre: i.nombre,
      idCategoriaInsumo: i.idCategoriaInsumo,
      stock: parseFloat(i.stock || 0),
      stockMinimo: parseFloat(i.stockMinimo || 0),
      fechaExpedicion: i.fechaExpedicion || null,
      fechaVencimiento: i.fechaVencimiento || null,
      unidadMedida: i.unidadMedida,
      precioUnitario: parseFloat(i.precioUnitario || 0),
      idProveedor: i.idProveedor,
      descripcion: i.descripcion || '',
      estado: i.estado,
      categoriaNombre: i.categoria ? i.categoria.nombre : 'Sin Categoría',
      proveedorNombre: i.proveedor ? i.proveedor.nombre : 'Sin Proveedor'
    }));
  }

  static async getById(idInsumo) {
    const i = await Insumo.findByPk(idInsumo, {
      include: [
        { model: CategoriaInsumo, as: 'categoria' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });

    if (!i) {
      const error = new Error('Insumo no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return {
      idInsumo: i.idInsumo,
      id: i.idInsumo,
      nombre: i.nombre,
      idCategoriaInsumo: i.idCategoriaInsumo,
      stock: parseFloat(i.stock || 0),
      stockMinimo: parseFloat(i.stockMinimo || 0),
      fechaExpedicion: i.fechaExpedicion || null,
      fechaVencimiento: i.fechaVencimiento || null,
      unidadMedida: i.unidadMedida,
      precioUnitario: parseFloat(i.precioUnitario || 0),
      idProveedor: i.idProveedor,
      descripcion: i.descripcion || '',
      estado: i.estado,
      categoriaNombre: i.categoria ? i.categoria.nombre : 'Sin Categoría',
      proveedorNombre: i.proveedor ? i.proveedor.nombre : 'Sin Proveedor'
    };
  }

  static async create(insumoData) {
    const {
      nombre, idCategoriaInsumo, stock, stockMinimo,
      fechaExpedicion, fechaVencimiento, unidadMedida,
      precioUnitario, idProveedor, descripcion
    } = insumoData;

    if (!nombre) {
      const error = new Error('El nombre del insumo es requerido');
      error.statusCode = 400;
      throw error;
    }

    const insumo = await Insumo.create({
      nombre,
      idCategoriaInsumo: idCategoriaInsumo || null,
      stock: stock || 0,
      stockMinimo: stockMinimo || 0,
      fechaExpedicion: fechaExpedicion || null,
      fechaVencimiento: fechaVencimiento || null,
      unidadMedida: unidadMedida || 'und',
      precioUnitario: precioUnitario || 0,
      idProveedor: idProveedor || null,
      descripcion: descripcion || '',
      estado: 1
    });

    return this.getById(insumo.idInsumo);
  }

  static async update(idInsumo, insumoData) {
    const insumo = await Insumo.findByPk(idInsumo);
    if (!insumo) {
      const error = new Error('Insumo no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const {
      nombre, idCategoriaInsumo, stock, stockMinimo,
      fechaExpedicion, fechaVencimiento, unidadMedida,
      precioUnitario, idProveedor, descripcion, estado
    } = insumoData;

    if (nombre !== undefined) insumo.nombre = nombre;
    if (idCategoriaInsumo !== undefined) insumo.idCategoriaInsumo = idCategoriaInsumo;
    if (stock !== undefined) insumo.stock = stock;
    if (stockMinimo !== undefined) insumo.stockMinimo = stockMinimo;
    if (fechaExpedicion !== undefined) insumo.fechaExpedicion = fechaExpedicion || null;
    if (fechaVencimiento !== undefined) insumo.fechaVencimiento = fechaVencimiento || null;
    if (unidadMedida !== undefined) insumo.unidadMedida = unidadMedida;
    if (precioUnitario !== undefined) insumo.precioUnitario = precioUnitario;
    if (idProveedor !== undefined) insumo.idProveedor = idProveedor;
    if (descripcion !== undefined) insumo.descripcion = descripcion;
    if (estado !== undefined) insumo.estado = estado;

    await insumo.save();
    return this.getById(idInsumo);
  }

  static async softDelete(idInsumo) {
    const insumo = await Insumo.findByPk(idInsumo);
    if (!insumo) {
      const error = new Error('Insumo no encontrado');
      error.statusCode = 404;
      throw error;
    }
    insumo.estado = 0;
    await insumo.save();
    return { message: 'Insumo movido a la papelera' };
  }

  static async restore(idInsumo) {
    const insumo = await Insumo.findByPk(idInsumo);
    if (!insumo) {
      const error = new Error('Insumo no encontrado');
      error.statusCode = 404;
      throw error;
    }
    insumo.estado = 1;
    await insumo.save();
    return this.getById(idInsumo);
  }

  static async hardDelete(idInsumo) {
    const insumo = await Insumo.findByPk(idInsumo);
    if (!insumo) {
      const error = new Error('Insumo no encontrado');
      error.statusCode = 404;
      throw error;
    }
    await insumo.destroy();
    return { message: 'Insumo eliminado físicamente' };
  }
}

module.exports = InsumoService;
