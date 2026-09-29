const { Evento, Product, Variante, FichaTecnica, DetalleFichaInsumo } = require('../../persistence/models');

const stripEmojis = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/^\s*[-–—:]\s*/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

function evaluarVigenciaEvento(e, now = new Date()) {
  const rawInicio = e.fechaInicio;
  const rawFin = e.fechaFin;

  if (!rawFin) {
    return {
      estadoVigencia: 'PERMANENTE',
      estaVigente: e.estado === 1,
      diasRestantes: null,
      horasRestantes: null,
      urgente: false,
      label: 'Vigencia Permanente',
      shortLabel: 'Permanente',
      fechaInicio: rawInicio,
      fechaFin: null
    };
  }

  const finDate = new Date(`${rawFin}T23:59:59`);
  const inicioDate = rawInicio ? new Date(`${rawInicio}T00:00:00`) : null;

  const msRestantes = finDate.getTime() - now.getTime();
  const diasRestantes = Math.ceil(msRestantes / (1000 * 60 * 60 * 24));
  const horasRestantes = Math.max(0, Math.floor(msRestantes / (1000 * 60 * 60)));

  if (inicioDate && now < inicioDate) {
    const msHastaInicio = inicioDate.getTime() - now.getTime();
    const diasParaInicio = Math.ceil(msHastaInicio / (1000 * 60 * 60 * 24));
    return {
      estadoVigencia: 'PROGRAMADO',
      estaVigente: false,
      diasRestantes,
      horasRestantes,
      diasParaInicio,
      urgente: false,
      label: `Inicia en ${diasParaInicio} día${diasParaInicio !== 1 ? 's' : ''}`,
      shortLabel: `En ${diasParaInicio}d`,
      fechaInicio: rawInicio,
      fechaFin: rawFin
    };
  }

  if (msRestantes < 0) {
    const diasExpirado = Math.abs(diasRestantes);
    return {
      estadoVigencia: 'EXPIRADO',
      estaVigente: false,
      diasRestantes: 0,
      horasRestantes: 0,
      diasExpirado,
      urgente: false,
      label: `Finalizado hace ${diasExpirado} día${diasExpirado !== 1 ? 's' : ''}`,
      shortLabel: 'Finalizado',
      fechaInicio: rawInicio,
      fechaFin: rawFin
    };
  }

  // Activo dentro de la vigencia
  const urgente = diasRestantes <= 3;
  let label = `Quedan ${diasRestantes} días`;
  let shortLabel = `${diasRestantes}d restantes`;

  if (diasRestantes === 1) {
    label = `¡Último día! (Quedan ${horasRestantes}h)`;
    shortLabel = '¡Último día!';
  } else if (diasRestantes === 0) {
    label = `¡Termina hoy! (Quedan ${horasRestantes}h)`;
    shortLabel = 'Termina hoy';
  }

  return {
    estadoVigencia: 'ACTIVO',
    estaVigente: e.estado === 1,
    diasRestantes,
    horasRestantes,
    urgente,
    label,
    shortLabel,
    fechaInicio: rawInicio,
    fechaFin: rawFin
  };
}

class EventoService {
  static async getAll() {
    const eventos = await Evento.findAll({
      order: [['idEvento', 'ASC']],
      include: [
        {
          model: Product,
          as: 'producto',
          attributes: ['idProducto', 'nombre', 'precio', 'imagen'],
          required: false
        }
      ]
    });

    const now = new Date();
    return eventos.map((e) => {
      const vigencia = evaluarVigenciaEvento(e, now);
      return {
        id: e.idEvento,
        idEvento: e.idEvento,
        nombreEvento: e.nombreEvento,
        nombre: e.nombreEvento,
        descripcion: e.descripcion || '',
        fechaInicio: e.fechaInicio,
        fechaFin: e.fechaFin,
        estado: e.estado === 1 ? 'Activo' : 'Inactivo',
        idProducto: e.idProducto,
        tipoEvento: e.tipoEvento,
        icono: e.icono || '🎉',
        imagen: e.imagen || null,
        descuento: e.descuento,
        nuevoPrecio: e.nuevoPrecio,
        accionInsumo: e.accionInsumo,
        insumosAsociados: e.insumosAsociados ? (typeof e.insumosAsociados === 'string' ? JSON.parse(e.insumosAsociados) : e.insumosAsociados) : [],
        productosAsociados: e.productosAsociados ? (typeof e.productosAsociados === 'string' ? JSON.parse(e.productosAsociados) : e.productosAsociados) : [],
        producto: e.producto ? {
          id: e.producto.idProducto,
          idProducto: e.producto.idProducto,
          nombre: e.producto.nombre,
          precio: e.producto.precio,
          imagen: e.producto.imagen
        } : null,
        vigencia
      };
    });
  }

  static async getById(id) {
    const e = await Evento.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'producto',
          attributes: ['idProducto', 'nombre', 'precio', 'imagen'],
          required: false
        }
      ]
    });
    if (!e) {
      const error = new Error('Evento no encontrado');
      error.statusCode = 404;
      throw error;
    }
    const vigencia = evaluarVigenciaEvento(e);
    return {
      id: e.idEvento,
      idEvento: e.idEvento,
      nombreEvento: e.nombreEvento,
      nombre: e.nombreEvento,
      descripcion: e.descripcion || '',
      fechaInicio: e.fechaInicio,
      fechaFin: e.fechaFin,
      estado: e.estado === 1 ? 'Activo' : 'Inactivo',
      idProducto: e.idProducto,
      tipoEvento: e.tipoEvento,
      icono: e.icono || '🎉',
      imagen: e.imagen || null,
      descuento: e.descuento,
      nuevoPrecio: e.nuevoPrecio,
      accionInsumo: e.accionInsumo,
      insumosAsociados: e.insumosAsociados ? (typeof e.insumosAsociados === 'string' ? JSON.parse(e.insumosAsociados) : e.insumosAsociados) : [],
      productosAsociados: e.productosAsociados ? (typeof e.productosAsociados === 'string' ? JSON.parse(e.productosAsociados) : e.productosAsociados) : [],
      producto: e.producto ? {
        id: e.producto.idProducto,
        idProducto: e.producto.idProducto,
        nombre: e.producto.nombre,
        precio: e.producto.precio,
        imagen: e.producto.imagen
      } : null,
      vigencia
    };
  }

  static async create(data) {
    const { 
      nombreEvento, nombre, descripcion, fechaInicio, fechaFin, estado,
      productoId, tipoEvento, icono, imagen, descuento, nuevoPrecio, accion, insumos, productos, isTemporal,
      crearComoProducto, productoNuevo
    } = data;
    const finalNombre = nombreEvento || nombre;

    if (!finalNombre || !finalNombre.trim()) {
      const error = new Error('El título/nombre del evento es obligatorio');
      error.statusCode = 400;
      throw error;
    }

    let finalProductoId = productoId ? Number(productoId) : null;

    // Bidireccional: Crear producto desde el evento si se solicita
    if (crearComoProducto) {
      const pData = productoNuevo || {};
      const fData = pData.fichaTecnica || {};
      const listaInsumos = (Array.isArray(fData.detalles) && fData.detalles.length > 0)
        ? fData.detalles
        : (Array.isArray(pData.insumosFicha) ? pData.insumosFicha : []);

      if (listaInsumos.length === 0) {
        const error = new Error('La ficha técnica es obligatoria para crear un producto. Debe incluir al menos un insumo o ingrediente base para costeo y receta.');
        error.statusCode = 400;
        throw error;
      }

      const prodNombre = pData.nombre || finalNombre;
      const prodDesc = pData.descripcion || descripcion || 'Edición especial de temporada festiva';
      const prodPrecio = pData.precio || (nuevoPrecio ? parseFloat(nuevoPrecio) * 1.15 : 25000);
      const prodCategoria = pData.idCategoriaProducto || 3; // Default a Hamburguesas
      const prodImagen = pData.imagen || '';

      const nuevoProd = await Product.create({
        idCategoriaProducto: prodCategoria,
        nombre: prodNombre,
        descripcion: prodDesc,
        precio: prodPrecio,
        imagen: prodImagen,
        adiciones: pData.adiciones ? (typeof pData.adiciones === 'string' ? pData.adiciones : JSON.stringify(pData.adiciones)) : '[]',
        configuracionCombo: pData.configuracionCombo ? (typeof pData.configuracionCombo === 'string' ? pData.configuracionCombo : JSON.stringify(pData.configuracionCombo)) : null,
        estado: pData.estado === 'Inactivo' || pData.estado === 0 ? 0 : 1
      });

      finalProductoId = nuevoProd.idProducto;

      // Crear Variantes (si vienen variantes personalizadas, crearlas; de lo contrario crear la predeterminada)
      let primaryVarianteId = null;
      if (Array.isArray(pData.variantes) && pData.variantes.length > 0) {
        for (let i = 0; i < pData.variantes.length; i++) {
          const v = pData.variantes[i];
          const createdV = await Variante.create({
            idProducto: nuevoProd.idProducto,
            nombre: v.nombre || (i === 0 ? 'Edición Especial' : `Opción #${i + 1}`),
            precio: v.precio !== undefined && v.precio !== "" ? Number(v.precio) : (nuevoPrecio || prodPrecio),
            estado: 1
          });
          if (i === 0) primaryVarianteId = createdV.idVariante;
        }
      } else {
        const nuevaVariante = await Variante.create({
          idProducto: nuevoProd.idProducto,
          nombre: 'Edición Especial',
          precio: nuevoPrecio || prodPrecio,
          estado: 1
        });
        primaryVarianteId = nuevaVariante.idVariante;
      }

      // Crear Ficha Técnica Oficial Completa
      const nuevaFicha = await FichaTecnica.create({
        idProducto: nuevoProd.idProducto,
        idVariante: primaryVarianteId,
        tipo: 'PRODUCTO',
        descripcion: fData.descripcion || `Ficha técnica oficial para ${prodNombre} (Producto de Evento)`,
        procedimiento: fData.procedimiento || pData.procedimiento || 'Preparar los ingredientes selectos con los más altos estándares artesanales. Cocinar a la plancha a fuego medio-alto, tostar pan con mantequilla clarificada, montar capas con salsa festiva y servir de inmediato.',
        tiempoPreparacion: Number(fData.tiempoPreparacion || pData.tiempoPreparacion) || 12,
        rendimiento: fData.rendimiento || pData.rendimiento || '1 porción',
        especificaciones: fData.especificaciones || '',
        caracteristicas: fData.caracteristicas || '',
        informacionNutricional: fData.informacionNutricional || '',
        condicionesAlmacenamiento: fData.condicionesAlmacenamiento || '',
        vidaUtil: fData.vidaUtil || '',
        observaciones: fData.observaciones || '',
        estado: 1
      });

      // Si vienen insumos para la ficha técnica, asociarlos
      if (listaInsumos.length > 0) {
        for (const item of listaInsumos) {
          const insId = item.idInsumo || item.id;
          if (insId) {
            await DetalleFichaInsumo.create({
              idFichaTecnica: nuevaFicha.idFichaTecnica,
              idInsumo: Number(insId),
              cantidad: Number(item.cantidad || 1),
              unidadMedida: item.unidadMedida || 'und'
            });
          }
        }
      }
    }

    const cleanNombre = stripEmojis(finalNombre);
    const cleanDesc = stripEmojis(descripcion || '');
    const cleanIcon = stripEmojis(icono || '') || 'party';

    const created = await Evento.create({
      nombreEvento: cleanNombre,
      descripcion: cleanDesc,
      fechaInicio: isTemporal ? fechaInicio : null,
      fechaFin: isTemporal ? fechaFin : null,
      estado: estado === 'Inactivo' || estado === 0 ? 0 : 1,
      idProducto: finalProductoId,
      tipoEvento: tipoEvento || 'EDICION_LIMITADA',
      icono: cleanIcon,
      imagen: imagen ? imagen.trim() : (productoNuevo?.imagen ? productoNuevo.imagen.trim() : null),
      descuento: descuento || null,
      nuevoPrecio: nuevoPrecio || null,
      accionInsumo: accion || null,
      insumosAsociados: insumos ? JSON.stringify(insumos) : null,
      productosAsociados: productos ? JSON.stringify(productos) : null
    });

    return this.getById(created.idEvento);
  }

  static async update(id, data) {
    const e = await Evento.findByPk(id);
    if (!e) {
      const error = new Error('Evento no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const { 
      nombreEvento, nombre, descripcion, fechaInicio, fechaFin, estado,
      productoId, tipoEvento, icono, imagen, descuento, nuevoPrecio, accion, insumos, productos, isTemporal
    } = data;
    const finalNombre = nombreEvento || nombre;

    if (finalNombre !== undefined && finalNombre.trim()) {
      e.nombreEvento = stripEmojis(finalNombre);
    }
    if (descripcion !== undefined) e.descripcion = stripEmojis(descripcion);
    if (icono !== undefined) e.icono = stripEmojis(icono) || 'party';
    if (isTemporal !== undefined) {
      if (isTemporal) {
        if (fechaInicio !== undefined) e.fechaInicio = fechaInicio;
        if (fechaFin !== undefined) e.fechaFin = fechaFin;
      } else {
        e.fechaInicio = null;
        e.fechaFin = null;
      }
    } else {
       if (fechaInicio !== undefined) e.fechaInicio = fechaInicio;
       if (fechaFin !== undefined) e.fechaFin = fechaFin;
    }
    
    if (estado !== undefined) e.estado = estado === 'Activo' || estado === 1 ? 1 : 0;
    if (productoId !== undefined) e.idProducto = productoId;
    if (tipoEvento !== undefined) e.tipoEvento = tipoEvento;
    if (icono !== undefined) e.icono = icono;
    if (imagen !== undefined) e.imagen = imagen ? imagen.trim() : null;
    if (descuento !== undefined) e.descuento = descuento;
    if (nuevoPrecio !== undefined) e.nuevoPrecio = nuevoPrecio;
    if (accion !== undefined) e.accionInsumo = accion;
    if (insumos !== undefined) e.insumosAsociados = insumos ? JSON.stringify(insumos) : null;
    if (productos !== undefined) e.productosAsociados = productos ? JSON.stringify(productos) : null;

    await e.save();
    return this.getById(id);
  }

  static async delete(id) {
    const e = await Evento.findByPk(id);
    if (!e) {
      const error = new Error('Evento no encontrado');
      error.statusCode = 404;
      throw error;
    }

    await e.destroy();

    // Reorder IDs if needed to maintain gapless sequence
    const all = await Evento.findAll({ order: [['idEvento', 'ASC']] });
    for (let i = 0; i < all.length; i++) {
      if (all[i].idEvento !== i + 1) {
        await Evento.update({ idEvento: i + 1 }, { where: { idEvento: all[i].idEvento } });
      }
    }

    return { message: 'Evento eliminado correctamente' };
  }
}

module.exports = EventoService;
