const { Product, CategoriaProducto, Evento, Variante, ComboProducto, FichaTecnica, DetalleFichaInsumo, Insumo, DetalleVentaProducto } = require('../../persistence/models');

/**
 * Normaliza unidades de medida entre receta e inventario para calcular porciones disponibles.
 */
function convertToInsumoUnit(recetaCantidad, recetaUnidad, insumoUnidad) {
  const rCant = Number(recetaCantidad) || 0;
  const rUni = String(recetaUnidad || '').toLowerCase().trim();
  const iUni = String(insumoUnidad || '').toLowerCase().trim();

  if (rUni === iUni || !rUni || !iUni) return rCant;

  // Masa: receta en gramos, insumo en kilogramos o libras
  if ((rUni === 'g' || rUni === 'gr' || rUni.includes('gram')) && (iUni === 'kg' || iUni.includes('kilo'))) {
    return rCant / 1000;
  }
  if ((rUni === 'kg' || rUni.includes('kilo')) && (rUni === 'g' || iUni.includes('gram'))) {
    return rCant * 1000;
  }
  if ((rUni === 'g' || rUni === 'gr') && (iUni === 'lb' || iUni.includes('libra'))) {
    return rCant / 500;
  }

  // Volumen: receta en mililitros, insumo en litros
  if ((rUni === 'ml' || rUni.includes('mili')) && (iUni === 'l' || iUni === 'lt' || iUni.includes('litro'))) {
    return rCant / 1000;
  }
  if ((rUni === 'l' || rUni === 'lt') && (iUni === 'ml' || iUni.includes('mili'))) {
    return rCant * 1000;
  }

  return rCant;
}

class ProductService {
  /**
   * Sincroniza la tabla relacional detallecombo a partir de itemsCombo
   */
  static async syncItemsCombo(idCombo, itemsCombo = []) {
    if (!idCombo) return;
    try {
      await ComboProducto.destroy({ where: { idCombo } });
      if (Array.isArray(itemsCombo) && itemsCombo.length > 0) {
        const rows = itemsCombo
          .filter(it => it && (it.idProducto || it.id))
          .map(it => ({
            idCombo,
            idProducto: Number(it.idProducto || it.id),
            cantidad: Math.max(1, Number(it.cantidad || 1)),
            esOpcional: it.esOpcional ? 1 : 0,
            grupoSeleccion: it.grupoSeleccion || null
          }));
        if (rows.length > 0) {
          await ComboProducto.bulkCreate(rows);
        }
      }
    } catch (err) {
      console.warn(`Error sincronizando itemsCombo para producto #${idCombo}:`, err.message);
    }
  }

  static async getProducts() {
    const products = await Product.findAll({
      attributes: ['idProducto', 'idCategoriaProducto', 'nombre', 'descripcion', 'imagen', 'estado', 'precio', 'categoria', 'adiciones', 'configuracionCombo'],
      include: [
        { model: CategoriaProducto, as: 'categoriaProducto', attributes: ['idCategoriaProducto', 'nombre'] },
        { model: Variante, as: 'variantes', attributes: ['idVariante', 'nombre', 'precio'] },
        { model: Evento, as: 'eventos', required: false, where: { estado: 1 } },
        {
          model: ComboProducto,
          as: 'itemsCombo',
          required: false,
          include: [
            {
              model: Product,
              as: 'productoComponente',
              attributes: ['idProducto', 'nombre', 'precio', 'imagen', 'estado']
            }
          ]
        }
      ]
    });

    // Cargar recetas para cálculo dinámico de stock
    const fichas = await FichaTecnica.findAll({
      where: { estado: 1 },
      include: [
        {
          model: DetalleFichaInsumo,
          as: 'detalles',
          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'stock', 'unidadMedida'] }]
        }
      ]
    }).catch(() => []);
    const fichaMap = new Map();
    fichas.forEach(f => {
      if (f.idProducto) fichaMap.set(f.idProducto, f);
    });

    // Cargar historial de ventas por variante para contar ventas reales
    const ventasPorVariante = await DetalleVentaProducto.findAll({
      attributes: ['idVariante', [DetalleVentaProducto.sequelize.fn('COUNT', DetalleVentaProducto.sequelize.col('idDetalleVenta')), 'totalVentas']],
      group: ['idVariante'],
      raw: true
    }).catch(() => []);
    const ventasMap = new Map();
    ventasPorVariante.forEach(v => {
      ventasMap.set(Number(v.idVariante), Number(v.totalVentas || 0));
    });

    return products
      .filter(p => p.idProducto !== 0 && !p.nombre?.startsWith('__SISTEMA'))
      .map(p => {
        let adiciones = [];
        try {
          adiciones = typeof p.adiciones === 'string' ? JSON.parse(p.adiciones) : (p.adiciones || []);
        } catch (e) {
          adiciones = [];
        }

        let cfgCombo = null;
        try {
          cfgCombo = typeof p.configuracionCombo === 'string' ? JSON.parse(p.configuracionCombo) : (p.configuracionCombo || null);
        } catch (e) {
          cfgCombo = null;
        }

        const realPrecio = p.precio !== undefined && p.precio !== null && parseFloat(p.precio) > 0
          ? parseFloat(p.precio)
          : (p.variantes?.[0] ? parseFloat(p.variantes[0].precio || 0) : 0);

        // Forzar que las variantes tengan el mismo precio del producto (Ítem #100)
        const variantes = Array.isArray(p.variantes) && p.variantes.length > 0
          ? p.variantes.map(v => ({ id: v.idVariante, idVariante: v.idVariante, nombre: v.nombre, precio: realPrecio }))
          : [{ id: p.idProducto, idVariante: p.idProducto, nombre: p.nombre, precio: realPrecio }];

        // Calcular número total de ventas históricas del producto (Ítem #104)
        let totalVentas = 0;
        variantes.forEach(v => {
          totalVentas += (ventasMap.get(Number(v.idVariante)) || 0);
        });

        // Calcular stock real disponible según receta o productos del combo
        let stockDisponible = 50;
        const ficha = fichaMap.get(p.idProducto);
        const isCombo = Boolean(cfgCombo?.esCombo || (p.categoria && String(p.categoria).toLowerCase().includes('combo')));

        if (ficha && Array.isArray(ficha.detalles) && ficha.detalles.length > 0) {
          let minPortions = Infinity;
          for (const det of ficha.detalles) {
            const insumo = det.insumo;
            const cantReq = Number(det.cantidad || 0);
            if (insumo && cantReq > 0) {
              const cantConvertida = convertToInsumoUnit(cantReq, det.unidadMedida, insumo.unidadMedida);
              if (cantConvertida > 0) {
                const stockInsumo = Math.max(0, Number(insumo.stock || 0));
                const porciones = Math.floor(stockInsumo / cantConvertida);
                minPortions = Math.min(minPortions, porciones);
              }
            }
          }
          if (minPortions !== Infinity) {
            stockDisponible = minPortions;
          }
        } else if (isCombo && Array.isArray(p.itemsCombo) && p.itemsCombo.length > 0) {
          let minCombo = Infinity;
          for (const it of p.itemsCombo) {
            const comp = it.productoComponente;
            if (comp && comp.estado === 0) {
              minCombo = 0;
              break;
            }
          }
          if (minCombo !== Infinity && minCombo === 0) stockDisponible = 0;
        }

        if (p.estado === 0) stockDisponible = 0;

        const itemsComboFormatted = (p.itemsCombo || []).map(it => ({
          idDetalleCombo: it.idDetalleCombo,
          idCombo: it.idCombo,
          idProducto: it.idProducto,
          cantidad: it.cantidad,
          esOpcional: Boolean(it.esOpcional),
          grupoSeleccion: it.grupoSeleccion,
          producto: it.productoComponente ? {
            id: it.productoComponente.idProducto,
            idProducto: it.productoComponente.idProducto,
            nombre: it.productoComponente.nombre,
            precio: parseFloat(it.productoComponente.precio || 0),
            imagen: it.productoComponente.imagen || '',
            estado: it.productoComponente.estado
          } : null
        }));

        return {
          _id: p.idProducto,
          id: p.idProducto,
          idProducto: p.idProducto,
          nombre: p.nombre,
          precio: realPrecio,
          descripcion: p.descripcion || '',
          imagen: p.imagen || '',
          stock: stockDisponible,
          ventas: totalVentas,
          idCategoriaProducto: p.idCategoriaProducto,
          categoriaId: p.idCategoriaProducto,
          categoria: p.categoriaProducto ? p.categoriaProducto.nombre : (p.categoria || ''),
          estado: p.estado === 1 ? 'Activo' : 'Inactivo',
          esCombo: isCombo,
          configuracionCombo: cfgCombo,
          itemsCombo: itemsComboFormatted,
          variantes,
          adiciones,
          eventos: p.eventos || []
        };
      });
  }

  static async getProductById(id) {
    const p = await Product.findByPk(id, {
      attributes: ['idProducto', 'idCategoriaProducto', 'nombre', 'descripcion', 'imagen', 'estado', 'precio', 'categoria', 'adiciones', 'configuracionCombo'],
      include: [
        { model: CategoriaProducto, as: 'categoriaProducto', attributes: ['idCategoriaProducto', 'nombre'] },
        { model: Variante, as: 'variantes', attributes: ['idVariante', 'nombre', 'precio'] },
        { model: Evento, as: 'eventos', required: false, where: { estado: 1 } },
        {
          model: ComboProducto,
          as: 'itemsCombo',
          required: false,
          include: [
            {
              model: Product,
              as: 'productoComponente',
              attributes: ['idProducto', 'nombre', 'precio', 'imagen', 'estado']
            }
          ]
        }
      ]
    });
    if (!p) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    let adiciones = [];
    try {
      adiciones = typeof p.adiciones === 'string' ? JSON.parse(p.adiciones) : (p.adiciones || []);
    } catch (e) {
      adiciones = [];
    }

    let cfgCombo = null;
    try {
      cfgCombo = typeof p.configuracionCombo === 'string' ? JSON.parse(p.configuracionCombo) : (p.configuracionCombo || null);
    } catch (e) {
      cfgCombo = null;
    }

    const realPrecio = p.precio !== undefined && p.precio !== null && parseFloat(p.precio) > 0
      ? parseFloat(p.precio)
      : (p.variantes?.[0] ? parseFloat(p.variantes[0].precio || 0) : 0);

    const variantes = Array.isArray(p.variantes) && p.variantes.length > 0
      ? p.variantes.map(v => ({ id: v.idVariante, idVariante: v.idVariante, nombre: v.nombre, precio: realPrecio }))
      : [{ id: p.idProducto, idVariante: p.idProducto, nombre: p.nombre, precio: realPrecio }];

    // Conteo de ventas históricas
    const varianteIds = variantes.map(v => v.idVariante);
    const ventasCount = varianteIds.length > 0
      ? await DetalleVentaProducto.count({ where: { idVariante: varianteIds } }).catch(() => 0)
      : 0;

    // Calcular stock dinámico
    const ficha = await FichaTecnica.findOne({
      where: { idProducto: id, estado: 1 },
      include: [
        {
          model: DetalleFichaInsumo,
          as: 'detalles',
          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'stock', 'unidadMedida'] }]
        }
      ]
    }).catch(() => null);

    let stockDisponible = 50;
    const isCombo = Boolean(cfgCombo?.esCombo || (p.categoria && String(p.categoria).toLowerCase().includes('combo')));

    if (ficha && Array.isArray(ficha.detalles) && ficha.detalles.length > 0) {
      let minPortions = Infinity;
      for (const det of ficha.detalles) {
        const insumo = det.insumo;
        const cantReq = Number(det.cantidad || 0);
        if (insumo && cantReq > 0) {
          const cantConvertida = convertToInsumoUnit(cantReq, det.unidadMedida, insumo.unidadMedida);
          if (cantConvertida > 0) {
            const stockInsumo = Math.max(0, Number(insumo.stock || 0));
            const porciones = Math.floor(stockInsumo / cantConvertida);
            minPortions = Math.min(minPortions, porciones);
          }
        }
      }
      if (minPortions !== Infinity) stockDisponible = minPortions;
    }

    if (p.estado === 0) stockDisponible = 0;

    const itemsComboFormatted = (p.itemsCombo || []).map(it => ({
      idDetalleCombo: it.idDetalleCombo,
      idCombo: it.idCombo,
      idProducto: it.idProducto,
      cantidad: it.cantidad,
      esOpcional: Boolean(it.esOpcional),
      grupoSeleccion: it.grupoSeleccion,
      producto: it.productoComponente ? {
        id: it.productoComponente.idProducto,
        idProducto: it.productoComponente.idProducto,
        nombre: it.productoComponente.nombre,
        precio: parseFloat(it.productoComponente.precio || 0),
        imagen: it.productoComponente.imagen || '',
        estado: it.productoComponente.estado
      } : null
    }));

    return {
      _id: p.idProducto,
      id: p.idProducto,
      idProducto: p.idProducto,
      nombre: p.nombre,
      precio: realPrecio,
      descripcion: p.descripcion || '',
      imagen: p.imagen || '',
      stock: stockDisponible,
      ventas: ventasCount,
      idCategoriaProducto: p.idCategoriaProducto,
      categoriaId: p.idCategoriaProducto,
      categoria: p.categoriaProducto ? p.categoriaProducto.nombre : (p.categoria || ''),
      estado: p.estado === 1 ? 'Activo' : 'Inactivo',
      esCombo: isCombo,
      configuracionCombo: cfgCombo,
      itemsCombo: itemsComboFormatted,
      variantes,
      adiciones,
      eventos: p.eventos || []
    };
  }

  static async createProduct(data) {
    const { nombre, precio, descripcion, imagen, categoria, adiciones, idCategoriaProducto, estado, configuracionCombo, itemsCombo } = data;
    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre del producto es obligatorio');
      error.statusCode = 400;
      throw error;
    }

    const existing = await Product.findOne({ where: { nombre: nombre.trim() } });
    if (existing) {
      const error = new Error('Ya existe un producto registrado con ese nombre');
      error.statusCode = 400;
      throw error;
    }

    const normalizedCategoria = typeof categoria === 'string' ? categoria.trim() : '';
    let resolvedCatId = idCategoriaProducto;
    let resolvedCatNombre = normalizedCategoria;

    if (!resolvedCatId && normalizedCategoria) {
      const catObj = await CategoriaProducto.findOne({ where: { nombre: normalizedCategoria } });
      if (catObj) {
        resolvedCatId = catObj.idCategoriaProducto;
        resolvedCatNombre = catObj.nombre;
      }
    } else if (resolvedCatId) {
      const catObj = await CategoriaProducto.findByPk(resolvedCatId);
      if (catObj) resolvedCatNombre = catObj.nombre;
    }

    if (!resolvedCatId) {
      const firstCat = await CategoriaProducto.findOne();
      resolvedCatId = firstCat ? firstCat.idCategoriaProducto : 1;
      resolvedCatNombre = firstCat ? firstCat.nombre : 'General';
    }

    const normalizedEstado = estado === 'Inactivo' || estado === 0 || estado === '0' ? 0 : 1;
    const finalPrecio = (precio !== undefined && precio !== null && precio !== '') ? Number(precio) : 0.00;

    let comboConfigStr = null;
    if (configuracionCombo) {
      comboConfigStr = typeof configuracionCombo === 'string' ? configuracionCombo : JSON.stringify(configuracionCombo);
    } else if (Array.isArray(itemsCombo) && itemsCombo.length > 0) {
      comboConfigStr = JSON.stringify({ esCombo: true, itemsCombo });
    }

    const product = await Product.create({
      idCategoriaProducto: resolvedCatId,
      nombre: nombre.trim(),
      descripcion: descripcion || '',
      imagen: imagen || '',
      categoria: resolvedCatNombre,
      precio: finalPrecio,
      estado: normalizedEstado,
      adiciones: adiciones ? (typeof adiciones === 'string' ? adiciones : JSON.stringify(adiciones)) : '[]',
      configuracionCombo: comboConfigStr
    });

    // Crear variante base con el mismo precio del producto
    await Variante.create({
      idProducto: product.idProducto,
      nombre: `${nombre.trim()} - base`,
      precio: finalPrecio,
      estado: normalizedEstado
    });

    // Sincronizar items del combo si aplica (Ítems #97, #106)
    const comboItemsToSave = itemsCombo || (configuracionCombo?.itemsCombo);
    if (Array.isArray(comboItemsToSave) && comboItemsToSave.length > 0) {
      await this.syncItemsCombo(product.idProducto, comboItemsToSave);
    }

    return this.getProductById(product.idProducto);
  }

  static async updateProduct(id, data) {
    const p = await Product.findByPk(id);
    if (!p) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Requisito 104: Restricción de edición si el producto ya cuenta con ventas asociadas
    const variantes = await Variante.findAll({ where: { idProducto: id } });
    const varianteIds = variantes.map(v => v.idVariante);
    let tieneVentas = false;
    if (varianteIds.length > 0) {
      const inVenta = await DetalleVentaProducto.findOne({ where: { idVariante: varianteIds } });
      if (inVenta) tieneVentas = true;
    }

    if (tieneVentas) {
      // Solo permitir cambiar estado (Activo/Inactivo) si ya tiene ventas
      const keys = Object.keys(data);
      const isOnlyEstado = keys.every(k => data[k] === undefined || k === 'estado');
      if (!isOnlyEstado) {
        const error = new Error('No es posible editar las características de este producto porque ya cuenta con ventas registradas en el sistema para garantizar la integridad histórica y contable.');
        error.statusCode = 400;
        throw error;
      }
    }

    const { nombre, precio, descripcion, imagen, categoria, adiciones, estado, idCategoriaProducto, configuracionCombo, itemsCombo } = data;

    // Requisito 105: Coherencia de Categoría (impedir pasar comida a bebidas o viceversa)
    if (idCategoriaProducto || categoria) {
      const currentCat = await CategoriaProducto.findByPk(p.idCategoriaProducto);
      let targetCat = null;
      if (idCategoriaProducto) {
        targetCat = await CategoriaProducto.findByPk(idCategoriaProducto);
      } else if (categoria) {
        targetCat = await CategoriaProducto.findOne({ where: { nombre: categoria } });
      }

      if (currentCat && targetCat && currentCat.idCategoriaProducto !== targetCat.idCategoriaProducto) {
        const isCurrentDrink = /bebida|refresco|gaseosa|jugo/i.test(currentCat.nombre || '');
        const isTargetDrink = /bebida|refresco|gaseosa|jugo/i.test(targetCat.nombre || '');
        if (isCurrentDrink !== isTargetDrink) {
          const error = new Error(`Cambio de categoría incoherente: no se permite cambiar un producto de tipo "${isCurrentDrink ? 'Bebida' : 'Comida'}" a "${isTargetDrink ? 'Bebida' : 'Comida'}".`);
          error.statusCode = 400;
          throw error;
        }
        p.idCategoriaProducto = targetCat.idCategoriaProducto;
        p.categoria = targetCat.nombre;
      }
    }

    if (nombre !== undefined) p.nombre = nombre.trim();
    if (descripcion !== undefined) p.descripcion = descripcion;
    if (imagen !== undefined) p.imagen = imagen;
    if (precio !== undefined && precio !== null && precio !== '') {
      p.precio = Number(precio) || 0;
    }
    if (estado !== undefined) {
      p.estado = estado === 'Activo' || estado === 1 ? 1 : 0;
    }
    if (adiciones !== undefined) {
      p.adiciones = typeof adiciones === 'string' ? adiciones : JSON.stringify(adiciones);
    }
    if (configuracionCombo !== undefined) {
      p.configuracionCombo = typeof configuracionCombo === 'string' ? configuracionCombo : JSON.stringify(configuracionCombo);
    }

    await p.save();

    // Sincronizar precio en variantes (Ítem #100)
    if (precio !== undefined && precio !== null && precio !== '') {
      const nuevoPrecio = Number(precio) || 0;
      await Variante.update({ precio: nuevoPrecio }, { where: { idProducto: id } });
    }

    // Sincronizar items de combo si se enviaron (Ítems #97, #106)
    const comboItemsToSave = itemsCombo || (configuracionCombo && typeof configuracionCombo === 'object' ? configuracionCombo.itemsCombo : null);
    if (comboItemsToSave !== undefined) {
      await this.syncItemsCombo(id, comboItemsToSave || []);
    }

    return this.getProductById(id);
  }

  static async deleteProduct(id) {
    const p = await Product.findByPk(id);
    if (!p) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Paso 1: Verificar SIEMPRE el historial de ventas antes de eliminar fichas o registros
    const variantes = await Variante.findAll({ where: { idProducto: id } });
    const varianteIds = variantes.map(v => v.idVariante);

    if (varianteIds.length > 0) {
      const inVenta = await DetalleVentaProducto.findOne({ where: { idVariante: varianteIds } });
      if (inVenta) {
        // Desactivación lógica preservando receta histórica e integridad de pedidos previos
        p.estado = 0;
        await p.save();
        return { message: 'Producto desactivado (con historial de ventas)' };
      }
    }

    // Paso 2: Si NO tiene ventas, eliminar dependencias asociadas
    try {
      await Evento.destroy({ where: { idProducto: id } });
    } catch (_) {}

    try {
      await ComboProducto.destroy({ where: { idCombo: id } });
    } catch (_) {}

    try {
      const ficha = await FichaTecnica.findOne({ where: { idProducto: id } });
      if (ficha) {
        await DetalleFichaInsumo.destroy({ where: { idFichaTecnica: ficha.idFichaTecnica } });
        await ficha.destroy();
      }
    } catch (_) {}

    if (varianteIds.length > 0) {
      await Variante.destroy({ where: { idProducto: id } });
    }

    await p.destroy();
    const { resetAutoIncrement } = require('../../infrastructure/utils/dbUtils');
    await resetAutoIncrement('producto', 'idProducto');
    return { message: 'Producto eliminado correctamente' };
  }
}

module.exports = ProductService;
