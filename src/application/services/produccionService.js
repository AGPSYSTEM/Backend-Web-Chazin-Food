const { Venta, DetalleVentaProducto, DetalleVentaAdicion, Adicion, Variante, Product, FichaTecnica, DetalleFichaInsumo, Insumo, Cliente, User } = require('../../persistence/models');

const getProductEmoji = (nombre = "") => {
  const n = (nombre || "").toLowerCase();
  if (n.includes("hambur")) return "🍔";
  if (n.includes("perro") || n.includes("hot dog")) return "🌭";
  if (n.includes("pollo") || n.includes("broaster") || n.includes("alita")) return "🍗";
  if (n.includes("salchipapa") || n.includes("papa")) return "🍟";
  if (n.includes("pizza")) return "🍕";
  if (n.includes("combo")) return "🍱";
  if (n.includes("gaseosa") || n.includes("bebida") || n.includes("jugo") || n.includes("coca")) return "🥤";
  if (n.includes("postre") || n.includes("torta")) return "🍰";
  return "🍽️";
};

class ProduccionService {
  static async getAll() {
    try {
      const ventas = await Venta.findAll({
        include: [
          {
            model: Cliente,
            as: 'cliente',
            include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos', 'telefono'] }]
          },
          { model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] },
          {
            model: DetalleVentaProducto,
            as: 'detalles',
            include: [
              {
                model: Variante,
                as: 'variante',
                include: [
                  {
                    model: Product,
                    as: 'producto',
                    include: [
                      {
                        model: FichaTecnica,
                        as: 'fichaTecnica',
                        include: [
                          {
                            model: DetalleFichaInsumo,
                            as: 'detalles',
                            include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                model: DetalleVentaAdicion,
                as: 'adiciones',
                include: [{ model: Adicion, as: 'adicion' }]
              }
            ]
          }
        ],
        order: [['idVenta', 'DESC']]
      });

      return ventas.map((v) => {
        let obsObj = {};
        if (v.observaciones) {
          try {
            obsObj = typeof v.observaciones === 'string' && v.observaciones.startsWith('{')
              ? JSON.parse(v.observaciones)
              : { nota: v.observaciones };
          } catch (e) {
            obsObj = { nota: v.observaciones };
          }
        }

        const clienteObj = v.cliente || {};
        const clienteUser = clienteObj.usuario || v.usuario || {};
        const clienteNombre = obsObj.clienteNombre ||
          (clienteUser.nombre ? `${clienteUser.nombre} ${clienteUser.apellidos || ''}`.trim() : null) ||
          (v.idCliente ? `Cliente #${v.idCliente}` : "Cliente Mostrador");

        const codigo = obsObj.codigoPedido || obsObj.numeroVenta || `VEN-${String(v.idVenta).padStart(4, '0')}`;

        // Format dates
        let fechaStr = new Date().toISOString().split("T")[0];
        let horaStr = "12:00 PM";
        if (v.fechaVenta) {
          const d = new Date(v.fechaVenta);
          fechaStr = d.toISOString().split("T")[0];
          let h = d.getHours();
          const m = String(d.getMinutes()).padStart(2, '0');
          const ampm = h >= 12 ? 'PM' : 'AM';
          h = h % 12 || 12;
          horaStr = `${String(h).padStart(2, '0')}:${m} ${ampm}`;
        }

        // Format items and technical sheet (recipe) data
        const productosList = [];
        let totalItemsCount = 0;

        if (v.detalles && v.detalles.length > 0) {
          for (const d of v.detalles) {
            const prod = d.variante?.producto;
            const ft = prod?.fichaTecnica;
            const qty = Number(d.cantidad) || 1;
            totalItemsCount += qty;

            let itemNombre = d.observaciones || d.variante?.nombre || prod?.nombre || `Producto #${d.idVariante || d.idDetalleVenta}`;
            if (prod?.nombre && d.variante?.nombre && prod.nombre !== d.variante.nombre) {
              itemNombre = `${prod.nombre} (${d.variante.nombre})`;
            } else if (prod?.nombre) {
              itemNombre = prod.nombre;
            }

            // Parse any custom JSON in d.observaciones
            let itemObs = "";
            let itemAdiciones = [];
            if (d.observaciones) {
              try {
                if (typeof d.observaciones === 'string' && d.observaciones.startsWith('{')) {
                  const parsed = JSON.parse(d.observaciones);
                  itemObs = parsed.nota || parsed.observaciones || parsed.especificaciones || "";
                  if (parsed.nombre && !prod?.nombre) itemNombre = parsed.nombre;
                  if (Array.isArray(parsed.adiciones)) itemAdiciones = parsed.adiciones;
                } else {
                  itemObs = d.observaciones;
                }
              } catch (e) {
                itemObs = d.observaciones;
              }
            }

            // Include real db adiciones
            if (d.adiciones && d.adiciones.length > 0) {
              itemAdiciones = d.adiciones.map(a => a.adicion?.nombre || `Adición #${a.idAdicion}`);
            }

            // Clean itemObs: do not repeat product name or dump raw addition list
            if (itemObs) {
              const normObs = itemObs.toLowerCase().trim();
              const normName = itemNombre.toLowerCase().trim();
              const normProdName = (prod?.nombre || "").toLowerCase().trim();
              const normVarName = (d.variante?.nombre || "").toLowerCase().trim();

              if (normObs === normName || normObs === normProdName || normObs === normVarName) {
                itemObs = "";
              } else if (normObs.startsWith(normName) || normObs.startsWith(normProdName) || normObs.startsWith(normVarName)) {
                // If it contains (+...) extract into itemAdiciones if empty
                if (itemObs.includes("(+") || itemObs.includes("( +")) {
                  const match = itemObs.match(/\(\s*\+([^)]+)\)/);
                  if (match && match[1]) {
                    const extracted = match[1].split(',').map(s => s.trim()).filter(Boolean);
                    if (extracted.length > 0 && itemAdiciones.length === 0) {
                      itemAdiciones = extracted;
                    }
                  }
                }
                itemObs = "";
              }
            }

            // Build recipe / ficha técnica if exists
            let receta = null;
            if (ft) {
              const ingredientes = (ft.detalles || []).map(det => ({
                idInsumo: det.idInsumo,
                nombre: det.insumo?.nombre || `Insumo #${det.idInsumo}`,
                cantidad: `${det.cantidad || 1} ${det.unidadMedida || det.insumo?.unidadMedida || 'und'}`
              }));

              const rawPasos = ft.procedimiento || ft.descripcion || "";
              const pasos = rawPasos
                ? rawPasos.split("\n").map(p => p.trim()).filter(Boolean)
                : ["Preparar los ingredientes según porciones", "Cocinar y montar según estándares de la casa"];

              receta = {
                idFichaTecnica: ft.idFichaTecnica,
                idProducto: ft.idProducto,
                tiempoPreparacion: ft.tiempoPreparacion ? `${ft.tiempoPreparacion} min` : "12 min",
                rendimiento: ft.rendimiento || "1 porción",
                especificaciones: ft.especificaciones || "",
                caracteristicas: ft.caracteristicas || "",
                informacionNutricional: ft.informacionNutricional || "",
                condicionesAlmacenamiento: ft.condicionesAlmacenamiento || "",
                vidaUtil: ft.vidaUtil || "",
                ingredientes,
                pasos
              };
            }

            productosList.push({
              id: d.idDetalleVenta,
              idProducto: prod?.idProducto || null,
              idVariante: d.idVariante,
              nombre: itemNombre,
              cantidad: qty,
              precioUnitario: parseFloat(d.precioUnitario || 0),
              total: parseFloat(d.subtotal || 0),
              observaciones: itemObs,
              adiciones: itemAdiciones,
              receta
            });
          }
        } else if (Array.isArray(obsObj.productos) && obsObj.productos.length > 0) {
          for (const p of obsObj.productos) {
            const qty = Number(p.cantidad) || 1;
            totalItemsCount += qty;
            let pObs = p.observaciones || p.nota || "";
            if (pObs.toLowerCase().trim() === (p.nombre || "").toLowerCase().trim()) {
              pObs = "";
            }

            productosList.push({
              id: p.id || p.idVariante || Math.random(),
              idProducto: p.idProducto || null,
              idVariante: p.idVariante || null,
              nombre: p.nombre || "Producto",
              cantidad: qty,
              precioUnitario: parseFloat(p.precio || p.precioUnitario || 0),
              total: parseFloat(p.total || 0),
              observaciones: pObs,
              adiciones: p.adiciones || [],
              receta: p.receta || null
            });
          }
        }

        // Map delivery/production status
        let estadoStr = "En Cola";
        const est = (v.estadoEntrega || 'PENDIENTE').toUpperCase();
        if (est === 'PREPARANDO' || est === 'EN PREPARACIÓN') estadoStr = "En Preparación";
        else if (est === 'LISTO') estadoStr = "Listo";
        else if (est === 'ENTREGADO' || est === 'DESPACHADO' || est === 'COMPLETADA') estadoStr = "Entregado";
        else if (est === 'CANCELADO' || est === 'ANULADA') estadoStr = "Anulada";
        else estadoStr = "En Cola";

        const platilloNombre = productosList.length > 0
          ? productosList.map(p => `${p.nombre} (x${p.cantidad})`).join(', ')
          : "Pedido General";

        const primaryProd = productosList[0];
        const mainEmoji = getProductEmoji(primaryProd?.nombre || platilloNombre);

        // General human observation ONLY (no raw JSON dump)
        const cleanGeneralObs = (
          obsObj.especificaciones ||
          obsObj.nota ||
          (typeof v.observaciones === 'string' && !v.observaciones.startsWith('{') ? v.observaciones : "")
        ).trim();

        return {
          id: v.idVenta,
          idVenta: v.idVenta,
          codigo,
          platilloNombre,
          imagen: mainEmoji,
          cantidad: totalItemsCount || 1,
          cliente: clienteNombre,
          responsable: clienteNombre,
          cocinero: "Cocina Principal",
          tiempo: primaryProd?.receta?.tiempoPreparacion || "15 min",
          fecha: fechaStr,
          horaInicio: horaStr,
          prioridad: est === 'PENDIENTE' ? "Alta" : "Normal",
          estado: estadoStr,
          estadoEntrega: v.estadoEntrega || 'PENDIENTE',
          alerta: est === 'PENDIENTE',
          observaciones: cleanGeneralObs,
          tipo: obsObj.tipoEntrega || "En Local",
          mesa: obsObj.mesa || (obsObj.tipoEntrega === 'Recoger' ? 'Para Llevar' : 'Mesa'),
          productos: productosList
        };
      });
    } catch (err) {
      console.error('Error al cargar órdenes en ProduccionService.getAll:', err);
      return [];
    }
  }

  static async create(data) {
    const VentaService = require('./ventaService');
    const venta = await VentaService.create(data);
    return venta;
  }

  static async updateEstado(id, nuevoEstado) {
    let idVentaNum = null;
    if (typeof id === 'string' && id.startsWith('VEN-')) {
      idVentaNum = Number(id.replace('VEN-', ''));
    } else {
      idVentaNum = Number(id);
    }

    if (!idVentaNum || isNaN(idVentaNum)) {
      const error = new Error('ID de orden no válido');
      error.statusCode = 400;
      throw error;
    }

    const v = await Venta.findByPk(idVentaNum);
    if (!v) {
      const error = new Error(`Orden #${idVentaNum} no encontrada en la base de datos`);
      error.statusCode = 404;
      throw error;
    }

    let estadoEnum = 'PENDIENTE';
    const norm = String(nuevoEstado || '').toUpperCase();
    if (norm === 'EN PREPARACIÓN' || norm === 'EN PREPARACION' || norm === 'PREPARANDO') {
      estadoEnum = 'PREPARANDO';
    } else if (norm === 'LISTO' || norm === 'LISTOS') {
      estadoEnum = 'LISTO';
    } else if (norm === 'DESPACHADO' || norm === 'ENTREGADO' || norm === 'COMPLETADA') {
      estadoEnum = 'ENTREGADO';
    } else if (norm === 'ANULADA' || norm === 'CANCELADO' || norm === 'CANCELADA') {
      estadoEnum = 'CANCELADO';
    } else {
      estadoEnum = 'PENDIENTE';
    }

    v.estadoEntrega = estadoEnum;
    await v.save();

    return {
      id: idVentaNum,
      idVenta: idVentaNum,
      estado: nuevoEstado,
      estadoEntrega: estadoEnum,
      message: `Estado de la orden #${idVentaNum} actualizado a "${nuevoEstado}" con éxito`
    };
  }

  static async delete(id) {
    let idVentaNum = typeof id === 'string' && id.startsWith('VEN-')
      ? Number(id.replace('VEN-', ''))
      : Number(id);

    if (idVentaNum && !isNaN(idVentaNum)) {
      const v = await Venta.findByPk(idVentaNum);
      if (v) {
        v.estadoEntrega = 'CANCELADO';
        await v.save();
        return { message: `Orden #${idVentaNum} marcada como cancelada` };
      }
    }
    return { message: "Orden procesada" };
  }
}

module.exports = ProduccionService;
