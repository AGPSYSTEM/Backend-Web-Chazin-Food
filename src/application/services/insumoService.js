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
    let {
      nombre, idCategoriaInsumo, stock, stockMinimo,
      fechaExpedicion, fechaVencimiento, unidadMedida,
      precioUnitario, idProveedor, descripcion,
      categoria, proveedor
    } = insumoData;

    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre del insumo es requerido');
      error.statusCode = 400;
      throw error;
    }

    if (!idCategoriaInsumo && categoria) {
      const cat = await CategoriaInsumo.findOne({ where: { nombre: categoria } });
      if (cat) idCategoriaInsumo = cat.idCategoriaInsumo;
    }

    if (!idProveedor && proveedor) {
      const prov = await Proveedor.findOne({ where: { nombre: proveedor } });
      if (prov) idProveedor = prov.idProveedor;
    }

    const existing = await Insumo.findOne({ where: { nombre: nombre.trim(), estado: 1 } });
    if (existing) {
      const error = new Error('Ya existe un insumo activo registrado con ese nombre');
      error.statusCode = 400;
      throw error;
    }

    const insumo = await Insumo.create({
      nombre: nombre.trim(),
      idCategoriaInsumo: idCategoriaInsumo || null,
      stock: stock !== undefined && stock !== null ? stock : 0,
      stockMinimo: stockMinimo !== undefined && stockMinimo !== null ? stockMinimo : 0,
      fechaExpedicion: fechaExpedicion || null,
      fechaVencimiento: fechaVencimiento || null,
      unidadMedida: unidadMedida || 'und',
      precioUnitario: precioUnitario !== undefined && precioUnitario !== null ? precioUnitario : 0,
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

    let {
      nombre, idCategoriaInsumo, stock, stockMinimo,
      fechaExpedicion, fechaVencimiento, unidadMedida,
      precioUnitario, idProveedor, descripcion, estado,
      categoria, proveedor
    } = insumoData;

    if (!idCategoriaInsumo && categoria) {
      const cat = await CategoriaInsumo.findOne({ where: { nombre: categoria } });
      if (cat) idCategoriaInsumo = cat.idCategoriaInsumo;
    }

    if (!idProveedor && proveedor) {
      const prov = await Proveedor.findOne({ where: { nombre: proveedor } });
      if (prov) idProveedor = prov.idProveedor;
    }

    if (nombre !== undefined) insumo.nombre = nombre.trim();
    if (idCategoriaInsumo !== undefined) insumo.idCategoriaInsumo = idCategoriaInsumo;
    if (stock !== undefined) insumo.stock = stock;
    if (stockMinimo !== undefined) insumo.stockMinimo = stockMinimo;
    if (fechaExpedicion !== undefined) insumo.fechaExpedicion = fechaExpedicion || null;
    if (fechaVencimiento !== undefined) insumo.fechaVencimiento = fechaVencimiento || null;
    if (unidadMedida !== undefined) insumo.unidadMedida = unidadMedida;
    if (precioUnitario !== undefined) insumo.precioUnitario = precioUnitario;
    if (idProveedor !== undefined) insumo.idProveedor = idProveedor;
    if (descripcion !== undefined) insumo.descripcion = descripcion;
    if (estado !== undefined) {
      insumo.estado = (estado === 'Activo' || estado === 1 || estado === '1') ? 1 : 0;
    }

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
    const { resetAutoIncrement } = require('../../infrastructure/utils/dbUtils');
    await resetAutoIncrement('insumo', 'idInsumo');
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

    const { resetAutoIncrement } = require('../../infrastructure/utils/dbUtils');
    await resetAutoIncrement('insumo', 'idInsumo');


    return { message: 'Insumo eliminado físicamente' };
  }
}

module.exports = InsumoService;
