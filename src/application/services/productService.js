const { Op } = require('sequelize');
const { Product, CategoriaProducto, Evento, Variante, VarianteInsumo, ComboProducto, FichaTecnica, DetalleFichaInsumo, Insumo, DetalleVentaProducto } = require('../../persistence/models');

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
  if ((rUni === 'kg' || rUni.includes('kilo')) && (iUni === 'g' || iUni === 'gr' || iUni.includes('gram'))) {
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

function isDummyOrBaseVariant(vName, pName) {
  if (!vName) return true;
  const vn = String(vName).trim().toLowerCase();
  const pn = String(pName || '').trim().toLowerCase();
  if (vn === pn) return true;
  if (vn === `${pn} - base` || vn === `${pn} - completo` || vn === `${pn} base` || vn === `${pn} completo`) return true;
  if (['base', 'estándar', 'estandar', 'completo', 'combo', 'única', 'unica'].includes(vn)) return true;
  if (vn.startsWith('porción individual') || vn.startsWith('porcion individual')) return true;
  if (vn === 'edición especial' || vn === 'edicion especial') return true;
  if (vn === 'edición especial burger fest' || vn === 'edicion especial burger fest') return true;
  if (vn === 'porción costeña grande' || vn === 'porcion costeña grande') return true;
  if (vn === 'salchipapa personal grande') return true;
  if (['perro especial', 'perro suizo gourmet', 'perro mexicano clásico', 'perro mexicano clasico', 'perro criollo gourmet'].includes(vn)) return true;
  if (vn === 'clásica 150g' || vn === 'clasica 150g') return true;
  if (vn === 'doble carne 300g' && pn.includes('doble carne')) return true;
  if (vn === 'pollo crispy 180g' && pn.includes('pollo crispy')) return true;
  if (vn === 'individual campesina' && pn.includes('campesina')) return true;
  if (vn === 'botella 500ml' && pn.includes('cristal')) return true;
  return false;
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
    const [products, fichas, allInsumos, ventasPorVariante] = await Promise.all([
      Product.findAll({
      attributes: ['idProducto', 'idCategoriaProducto', 'nombre', 'descripcion', 'imagen', 'estado', 'precio', 'categoria', 'adiciones', 'configuracionCombo'],
      include: [
        { model: CategoriaProducto, as: 'categoriaProducto', attributes: ['idCategoriaProducto', 'nombre'] },
        {
          model: Variante,
          as: 'variantes',
          attributes: ['idVariante', 'nombre', 'descripcion', 'precio', 'imagen', 'estado'],
          include: [
            {
              model: VarianteInsumo,
              as: 'insumosModificados',
              include: [
                { model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida', 'stock'] },
                { model: Insumo, as: 'insumoReemplazado', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }
              ]
            }
          ]
        },
        { 
          model: Evento, 
          as: 'eventos', 
          required: false, 
          where: { 
            estado: 1,
            [Op.or]: [
              { fechaFin: null },
              { fechaFin: { [Op.gte]: new Date().toISOString().split('T')[0] } }
            ]
          } 
        },
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
      }),

      // Cargar recetas para cálculo dinámico de stock
      FichaTecnica.findAll({
      where: { estado: 1 },
      include: [
        {
          model: DetalleFichaInsumo,
          as: 'detalles',
          include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'stock', 'unidadMedida', 'estado'] }]
        }
      ]
      }).catch(() => []),

      // Cargar todos los insumos para bebidas o productos directos sin ficha técnica
      Insumo.findAll({
        attributes: ['idInsumo', 'nombre', 'stock', 'unidadMedida', 'estado']
      }).catch(() => []),

      // Cargar historial de ventas por variante para contar ventas reales
      DetalleVentaProducto.findAll({
        attributes: ['idVariante', [DetalleVentaProducto.sequelize.fn('COUNT', DetalleVentaProducto.sequelize.col('idDetalleVenta')), 'totalVentas']],
        group: ['idVariante'],
        raw: true
      }).catch(() => [])
    ]);

    const fichaMap = new Map();
    fichas.forEach(f => {
      if (f.idProducto) fichaMap.set(f.idProducto, f);
    });
    const insumoByIdMap = new Map();
    allInsumos.forEach(ins => {
      insumoByIdMap.set(Number(ins.idInsumo), ins);
    });

    const resolveDirectInsumoStock = (prod) => {
      const rawName = String(prod?.nombre || '').toLowerCase();
      const pId = Number(prod?.idProducto || prod?.id || 0);
      let directInsumoId = null;
      if (rawName.includes('coca')) {
        directInsumoId = (rawName.includes('light') || rawName.includes('sin az') || rawName.includes('zero') || pId === 16) ? 32 : 29;
      } else if (rawName.includes('pepsi')) {
        directInsumoId = (rawName.includes('light') || rawName.includes('black') || rawName.includes('zero')) ? 34 : 33;
      } else if (((rawName.includes('postob') || rawName.includes('gaseosa')) && rawName.includes('uva')) || pId === 38) {
        directInsumoId = 47;
      } else if (((rawName.includes('postob') || rawName.includes('gaseosa')) && rawName.includes('naranja')) || pId === 39) {
        directInsumoId = 48;
      } else if (((rawName.includes('postob') || rawName.includes('gaseosa') || rawName.includes('kola')) && rawName.includes('colombiana')) || pId === 12) {
        directInsumoId = 35;
      } else if (((rawName.includes('postob') || rawName.includes('gaseosa')) && rawName.includes('manzana')) || pId === 9) {
        directInsumoId = 30;
      } else if (rawName.includes('sprite') || pId === 13) {
        directInsumoId = 36;
      } else if (((rawName.includes('cuatro') || rawName.includes('quatro')) && (rawName.includes('gaseosa') || rawName.includes('toronja'))) || pId === 14) {
        directInsumoId = 37;
      } else if ((rawName.includes('agua') && (rawName.includes('cristal') || rawName.includes('mineral') || rawName.includes('botella'))) || pId === 10) {
        directInsumoId = 31;
      }

      if (directInsumoId && insumoByIdMap.has(directInsumoId)) {
        const ins = insumoByIdMap.get(directInsumoId);
        const directStock = Math.max(0, Math.floor(Number(ins.stock || 0)));
        if (ins.estado === 0 && directStock <= 0) return 0;
        return directStock;
      }

      const matchedByName = allInsumos.find(ins => {
        const iName = String(ins.nombre || '').toLowerCase().trim();
        return iName && rawName && (iName === rawName || (rawName.startsWith(iName) && iName.length >= 6));
      });
      if (matchedByName) {
        const directStock = Math.max(0, Math.floor(Number(matchedByName.stock || 0)));
        if (matchedByName.estado === 0 && directStock <= 0) return 0;
        return directStock;
      }
      return null;
    };

    const computeSingleProductStock = (prod) => {
      if (!prod || prod.estado === 0) return 0;
      const ficha = fichaMap.get(prod.idProducto);
      if (ficha && Array.isArray(ficha.detalles) && ficha.detalles.length > 0) {
        let minPortions = Infinity;
        for (const det of ficha.detalles) {
          const insumo = det.insumo;
          const cantReq = Number(det.cantidad || 0);
          if (insumo && cantReq > 0) {
            const stockInsumo = Math.max(0, Number(insumo.stock || 0));
            if (stockInsumo <= 0) {
              minPortions = 0;
              break;
            }
            const cantConvertida = convertToInsumoUnit(cantReq, det.unidadMedida, insumo.unidadMedida);
            if (cantConvertida > 0) {
              const stockInsumo = Math.max(0, Number(insumo.stock || 0));
              const porciones = Math.floor(stockInsumo / cantConvertida);
              minPortions = Math.min(minPortions, porciones);
            }
          }
        }
        if (minPortions !== Infinity) return minPortions;
      }
      const directStock = resolveDirectInsumoStock(prod);
      if (directStock !== null) return directStock;
      return 0;
    };

    // Conteo de ventas por variante (ya precargado en paralelo)
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

        const isCombo = Boolean(cfgCombo?.esCombo || (p.categoria && String(p.categoria).toLowerCase().includes('combo')));
        const rawVars = Array.isArray(p.variantes) ? p.variantes : [];
        const hasOnlyDummy = rawVars.length === 1 && isDummyOrBaseVariant(rawVars[0]?.nombre, p.nombre);

        const variantes = (isCombo || hasOnlyDummy || rawVars.length === 0)
          ? []
          : rawVars.map(v => ({
              id: v.idVariante,
              idVariante: v.idVariante,
              nombre: v.nombre,
              descripcion: v.descripcion || '',
              precio: realPrecio,
              imagen: v.imagen || '',
              estado: v.estado !== undefined ? v.estado : 1,
              insumosModificados: Array.isArray(v.insumosModificados) ? v.insumosModificados.map(im => ({
                idVarianteInsumo: im.idVarianteInsumo,
                tipoAccion: im.tipoAccion,
                idInsumo: im.idInsumo,
                idInsumoReemplazado: im.idInsumoReemplazado,
                cantidad: Number(im.cantidad || 0),
                unidadMedida: im.unidadMedida,
                observaciones: im.observaciones,
                insumo: im.insumo ? { idInsumo: im.insumo.idInsumo, nombre: im.insumo.nombre, unidadMedida: im.insumo.unidadMedida, stock: im.insumo.stock } : null,
                insumoReemplazado: im.insumoReemplazado ? { idInsumo: im.insumoReemplazado.idInsumo, nombre: im.insumoReemplazado.nombre, unidadMedida: im.insumoReemplazado.unidadMedida } : null
              })) : []
            }));

        const idVariantePrincipal = rawVars[0]?.idVariante || p.idProducto;

        // Calcular número total de ventas históricas del producto (Ítem #104)
        let totalVentas = 0;
        if (rawVars.length > 0) {
          rawVars.forEach(v => {
            totalVentas += (ventasMap.get(Number(v.idVariante)) || 0);
          });
        } else {
          totalVentas = ventasMap.get(Number(p.idProducto)) || 0;
        }

        // Calcular stock real disponible según receta, insumo directo o productos del combo
        let stockDisponible = computeSingleProductStock(p);

        if (isCombo && Array.isArray(p.itemsCombo) && p.itemsCombo.length > 0) {
          let minCombo = stockDisponible;
          for (const it of p.itemsCombo) {
            const comp = it.productoComponente;
            const reqCompQty = Math.max(1, Number(it.cantidad || 1));
            if (comp) {
              if (comp.estado === 0) {
                minCombo = 0;
                break;
              }
              const compStock = computeSingleProductStock(comp);
              minCombo = Math.min(minCombo, Math.floor(compStock / reqCompQty));
            }
          }
          stockDisponible = minCombo;
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
          agotado: stockDisponible <= 0 || p.estado === 0,
          ventas: totalVentas,
          tieneVentas: totalVentas > 0,
          idCategoriaProducto: p.idCategoriaProducto,
          categoriaId: p.idCategoriaProducto,
          categoria: p.categoriaProducto ? p.categoriaProducto.nombre : (p.categoria || ''),
          estado: p.estado === 1 ? 'Activo' : 'Inactivo',
          esCombo: isCombo,
          configuracionCombo: cfgCombo,
          itemsCombo: itemsComboFormatted,
          variantes,
          idVariantePrincipal,
          tieneVariantes: variantes.length > 0,
          adiciones,
          eventos: p.eventos || []
        };
      });
  }

  static async getProductById(id) {
    const all = await this.getProducts();
    const found = all.find(p => Number(p.idProducto || p.id) === Number(id));
    if (!found) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return found;
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

    // Crear variantes enviadas o variante base por defecto
    const validVariants = Array.isArray(data.variantes)
      ? data.variantes.filter(v => v && v.nombre && v.nombre.trim() && v.nombre.trim().toLowerCase() !== nombre.trim().toLowerCase())
      : [];

    if (validVariants.length > 0) {
      for (const v of validVariants) {
        const newVar = await Variante.create({
          idProducto: product.idProducto,
          nombre: v.nombre.trim(),
          descripcion: v.descripcion || null,
          precio: finalPrecio,
          imagen: v.imagen || null,
          estado: normalizedEstado
        });

        if (Array.isArray(v.insumosModificados) && v.insumosModificados.length > 0) {
          for (const im of v.insumosModificados) {
            if (im.idInsumo && Number(im.cantidad) > 0) {
              await VarianteInsumo.create({
                idVariante: newVar.idVariante,
                tipoAccion: im.tipoAccion || 'AGREGAR',
                idInsumo: Number(im.idInsumo),
                idInsumoReemplazado: im.idInsumoReemplazado ? Number(im.idInsumoReemplazado) : null,
                cantidad: Number(im.cantidad),
                unidadMedida: im.unidadMedida || 'und',
                observaciones: im.observaciones || null
              });
            }
          }
        }
      }
    } else {
      await Variante.create({
        idProducto: product.idProducto,
        nombre: `${nombre.trim()} - base`,
        precio: finalPrecio,
        estado: normalizedEstado
      });
    }

    // Sincronizar items del combo si aplica (Ítems #97, #106)
    const comboItemsToSave = itemsCombo || (configuracionCombo?.itemsCombo) || (configuracionCombo?.productosAsociados);
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

    const { nombre, precio, descripcion, imagen, categoria, adiciones, estado, idCategoriaProducto, configuracionCombo, itemsCombo, variantes } = data;

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

    // Sincronizar variantes (nombre, precio, imagen, creación y actualización)
    if (Array.isArray(variantes)) {
      const basePrice = Number(p.precio) || 0;
      const existingVariantes = await Variante.findAll({ where: { idProducto: id } });
      const existingIds = existingVariantes.map(v => Number(v.idVariante));
      
      const filteredIncoming = variantes.filter(v => v && v.nombre && v.nombre.trim() && v.nombre.trim().toLowerCase() !== p.nombre.toLowerCase());

      if (filteredIncoming.length > 0) {
        const incomingIds = [];
        for (let i = 0; i < filteredIncoming.length; i++) {
          const v = filteredIncoming[i];
          const vNombre = v.nombre.trim();
          const vDesc = v.descripcion || null;
          const vPrecio = basePrice;
          const vImagen = v.imagen || null;
          let currentVarId = null;

          if (v.idVariante && existingIds.includes(Number(v.idVariante))) {
            currentVarId = Number(v.idVariante);
            await Variante.update(
              { nombre: vNombre, descripcion: vDesc, precio: vPrecio, imagen: vImagen },
              { where: { idVariante: currentVarId } }
            );
          } else if (existingVariantes[i]) {
            currentVarId = Number(existingVariantes[i].idVariante);
            await Variante.update(
              { nombre: vNombre, descripcion: vDesc, precio: vPrecio, imagen: vImagen },
              { where: { idVariante: currentVarId } }
            );
          } else {
            const newVar = await Variante.create({
              idProducto: id,
              nombre: vNombre,
              descripcion: vDesc,
              precio: vPrecio,
              imagen: vImagen,
              estado: p.estado
            });
            currentVarId = Number(newVar.idVariante);
          }
          incomingIds.push(currentVarId);

          // Sincronizar insumosModificados para esta variante
          await VarianteInsumo.destroy({ where: { idVariante: currentVarId } });
          if (Array.isArray(v.insumosModificados) && v.insumosModificados.length > 0) {
            for (const im of v.insumosModificados) {
              if (im.idInsumo && Number(im.cantidad) > 0) {
                await VarianteInsumo.create({
                  idVariante: currentVarId,
                  tipoAccion: im.tipoAccion || 'AGREGAR',
                  idInsumo: Number(im.idInsumo),
                  idInsumoReemplazado: im.idInsumoReemplazado ? Number(im.idInsumoReemplazado) : null,
                  cantidad: Number(im.cantidad),
                  unidadMedida: im.unidadMedida || 'und',
                  observaciones: im.observaciones || null
                });
              }
            }
          }
        }

        const toRemove = existingIds.filter(vId => !incomingIds.includes(vId));
        for (const removeId of toRemove) {
          const hasSales = await DetalleVentaProducto.findOne({ where: { idVariante: removeId } }).catch(() => null);
          if (!hasSales) {
            await VarianteInsumo.destroy({ where: { idVariante: removeId } }).catch(() => null);
            await Variante.destroy({ where: { idVariante: removeId } }).catch(() => null);
          }
        }
      } else {
        // El producto se guardó sin variantes adicionales (producto simple)
        if (existingVariantes.length > 0) {
          await Variante.update(
            { nombre: `${p.nombre.trim()} - base`, precio: basePrice },
            { where: { idVariante: existingVariantes[0].idVariante } }
          );
          await VarianteInsumo.destroy({ where: { idVariante: existingVariantes[0].idVariante } });
          for (let i = 1; i < existingVariantes.length; i++) {
            const remVar = existingVariantes[i];
            const hasSales = await DetalleVentaProducto.findOne({ where: { idVariante: remVar.idVariante } }).catch(() => null);
            if (!hasSales) {
              await VarianteInsumo.destroy({ where: { idVariante: remVar.idVariante } }).catch(() => null);
              await Variante.destroy({ where: { idVariante: remVar.idVariante } }).catch(() => null);
            }
          }
        }
      }
    } else if (precio !== undefined && precio !== null && precio !== '') {
      const nuevoPrecio = Number(precio) || 0;
      await Variante.update({ precio: nuevoPrecio }, { where: { idProducto: id } });
    }

    // Sincronizar items de combo si se enviaron (Ítems #97, #106)
    const comboItemsToSave = itemsCombo || (configuracionCombo && typeof configuracionCombo === 'object' ? (configuracionCombo.itemsCombo || configuracionCombo.productosAsociados) : null);
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
