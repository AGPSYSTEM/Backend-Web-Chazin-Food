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
            const pName = prod?.nombre || "";
            const vName = d.variante?.nombre || "";

            if (pName && vName) {
              const pLower = pName.toLowerCase().trim();
              const vLower = vName.toLowerCase().trim();
              if (vLower === pLower || vLower === `${pLower} - base` || vLower === 'base' || vLower === 'estándar' || vLower === 'estandar') {
                itemNombre = pName;
              } else if (vLower.startsWith(`${pLower} - `)) {
                itemNombre = `${pName} (${vName.slice(pName.length + 3).trim()})`;
              } else if (vLower !== pLower) {
                itemNombre = `${pName} (${vName})`;
              } else {
                itemNombre = pName;
              }
            } else if (pName) {
              itemNombre = pName;
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
              itemAdiciones = d.adiciones.map(a => ({
                idAdicion: a.idAdicion,
                nombre: a.adicion?.nombre || `Adición #${a.idAdicion}`,
                cantidad: Number(a.cantidad) || 1,
                precio: parseFloat(a.precioUnitario || 0)
              }));
            }

            // Match with obsObj.productos if available to retrieve full observations and additions
            const matchedObsProd = Array.isArray(obsObj.productos)
              ? obsObj.productos.find(op => op.idVariante === d.idVariante || op.id === d.idVariante || (op.nombre && op.nombre.toLowerCase().trim() === itemNombre.toLowerCase().trim())) || obsObj.productos[productosList.length]
              : null;

            if (matchedObsProd) {
              const opObs = matchedObsProd.observaciones || matchedObsProd.observacion || matchedObsProd.especificaciones || matchedObsProd.nota;
              if (opObs && typeof opObs === 'string' && opObs.trim() && opObs.trim().toLowerCase() !== itemNombre.toLowerCase().trim()) {
                itemObs = opObs.trim();
              }
              if (Array.isArray(matchedObsProd.adiciones) && matchedObsProd.adiciones.length > 0) {
                const opAdds = matchedObsProd.adiciones.map(a => {
                  if (typeof a === 'object' && a !== null) {
                    return {
                      idAdicion: a.idAdicion || a.id,
                      nombre: a.nombre || a.nombreAdicion || 'Adición',
                      cantidad: Number(a.cantidad) || 1,
                      precio: parseFloat(a.precio || 0)
                    };
                  }
                  return { nombre: String(a), cantidad: 1 };
                });

                if (itemAdiciones.length === 0) {
                  itemAdiciones = opAdds;
                } else {
                  for (const oa of opAdds) {
                    const existing = itemAdiciones.find(ia => (ia.nombre || '').toLowerCase().trim() === (oa.nombre || '').toLowerCase().trim());
                    if (existing) {
                      existing.cantidad = Math.max(existing.cantidad, oa.cantidad);
                    } else {
                      itemAdiciones.push(oa);
                    }
                  }
                }
              }
            }

            // Clean itemObs: do not repeat product name or dump raw addition list or summary parenthesis
            if (itemObs) {
              const normObs = itemObs.toLowerCase().trim();
              const normName = itemNombre.toLowerCase().trim();
              const normProdName = (prod?.nombre || "").toLowerCase().trim();
              const normVarName = (d.variante?.nombre || "").toLowerCase().trim();

              if (normObs === normName || normObs === normProdName || normObs === normVarName) {
                itemObs = "";
              } else if (normObs.startsWith(normName) || normObs.startsWith(normProdName) || normObs.startsWith(normVarName)) {
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
              } else if (itemObs.includes("(+") || itemObs.includes("( +")) {
                // If the entire note is just a product title with additions in parentheses
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

        // Map approval and delivery/production status
        // Primary source: real DB column `estadoAprobacion`
        const est = (v.estadoEntrega || 'PENDIENTE').toUpperCase();
        let estadoAprobacion = v.estadoAprobacion;
        if (!estadoAprobacion) {
          if (est === 'PREPARANDO' || est === 'LISTO' || est === 'ENTREGADO' || est === 'DESPACHADO') {
            estadoAprobacion = 'APROBADO';
          } else if (est === 'CANCELADO' || est === 'ANULADA') {
            estadoAprobacion = 'RECHAZADO';
          } else {
            estadoAprobacion = 'PENDIENTE';
          }
        }

        let estadoStr = "Por Aprobar";
        if (estadoAprobacion === 'RECHAZADO' || est === 'CANCELADO' || est === 'ANULADA') {
          estadoStr = "Rechazado";
        } else if (estadoAprobacion === 'PENDIENTE') {
          estadoStr = "Por Aprobar";
        } else if (est === 'PREPARANDO' || est === 'EN PREPARACIÓN') {
          estadoStr = "En Preparación";
        } else if (est === 'LISTO') {
          estadoStr = "Listo";
        } else if (est === 'ENTREGADO' || est === 'DESPACHADO' || est === 'COMPLETADA') {
          estadoStr = "Entregado";
        } else {
          estadoStr = "En Cola";
        }

        const platilloNombre = productosList.length > 0
          ? productosList.map(p => `${p.nombre} (x${p.cantidad})`).join(', ')
          : "Pedido General";

        const primaryProd = productosList[0];
        const mainEmoji = getProductEmoji(primaryProd?.nombre || platilloNombre);

        // General human observation ONLY (no raw JSON dump)
        let cleanGeneralObs = "";
        const rawGeneralObs =
          obsObj.especificaciones ||
          obsObj.nota ||
          (typeof v.observaciones === 'string' && !v.observaciones.startsWith('{') ? v.observaciones : "");
        if (typeof rawGeneralObs === 'string') {
          cleanGeneralObs = rawGeneralObs.trim();
        } else if (rawGeneralObs && typeof rawGeneralObs === 'object') {
          cleanGeneralObs = "";
        }

        // Determine delivery type and table label accurately
        const rawTipo = obsObj.tipoEntrega || (v.tipoVenta === 'DOMICILIO' ? 'Domicilio' : (obsObj.mesa ? 'En Mesa' : 'En Local'));
        let finalTipo = 'En Local';
        let finalMesa = obsObj.mesa || '';

        const normTipo = String(rawTipo).toLowerCase();
        if (normTipo.includes('domicilio') || (v.tipoVenta && v.tipoVenta.toUpperCase() === 'DOMICILIO')) {
          finalTipo = 'Domicilio';
          finalMesa = 'Domicilio';
        } else if (normTipo.includes('recoger') || normTipo.includes('llevar')) {
          finalTipo = 'Para Llevar';
          finalMesa = 'Para Llevar';
        } else if (obsObj.mesa) {
          finalTipo = 'En Mesa';
          finalMesa = String(obsObj.mesa).toLowerCase().startsWith('mesa') ? obsObj.mesa : `Mesa ${obsObj.mesa}`;
        } else {
          finalTipo = 'En Local';
          finalMesa = 'En Local';
        }

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
          fechaVenta: v.fechaVenta,
          prioridad: (est === 'PENDIENTE' || estadoAprobacion === 'PENDIENTE') ? "Alta" : "Normal",
          estado: estadoStr,
          estadoAprobacion,
          estadoEntrega: v.estadoEntrega || 'PENDIENTE',
          alerta: estadoAprobacion === 'PENDIENTE' || est === 'PENDIENTE',
          observaciones: cleanGeneralObs,
          tipo: finalTipo,
          mesa: finalMesa,
          tipoVenta: v.tipoVenta || (finalTipo === 'Domicilio' ? 'DOMICILIO' : 'PUNTO_DE_VENTA'),
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
    const { Op } = require('sequelize');
    let v = null;
    let idVentaNum = Number(id);

    if (!isNaN(idVentaNum) && idVentaNum > 0) {
      v = await Venta.findByPk(idVentaNum);
    }

    if (!v && typeof id === 'string') {
      v = await Venta.findOne({
        where: {
          observaciones: {
            [Op.like]: `%"codigoPedido":"${id}"%`
          }
        }
      });
    }

    if (!v) {
      const numMatch = String(id).match(/\d+/);
      if (numMatch) {
        v = await Venta.findByPk(Number(numMatch[0]));
      }
    }

    if (!v) {
      const error = new Error(`Orden "${id}" no encontrada en la base de datos`);
      error.statusCode = 404;
      throw error;
    }

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

    let estadoEnum = v.estadoEntrega || 'PENDIENTE';
    let newAprobacion = v.estadoAprobacion || 'PENDIENTE';
    const norm = String(nuevoEstado || '').toUpperCase();

    if (norm === 'APROBAR' || norm === 'APROBADO') {
      newAprobacion = 'APROBADO';
      if (estadoEnum === 'PENDIENTE') {
        estadoEnum = 'PREPARANDO';
      }
    } else if (norm === 'RECHAZAR' || norm === 'RECHAZADO') {
      newAprobacion = 'RECHAZADO';
      estadoEnum = 'CANCELADO';
    } else if (norm === 'EN PREPARACIÓN' || norm === 'EN PREPARACION' || norm === 'PREPARANDO') {
      newAprobacion = 'APROBADO';
      estadoEnum = 'PREPARANDO';
    } else if (norm === 'LISTO' || norm === 'LISTOS') {
      newAprobacion = 'APROBADO';
      estadoEnum = 'LISTO';
    } else if (norm === 'DESPACHADO' || norm === 'ENTREGADO' || norm === 'COMPLETADA') {
      newAprobacion = 'APROBADO';
      estadoEnum = 'ENTREGADO';
    } else if (norm === 'ANULADA' || norm === 'CANCELADO' || norm === 'CANCELADA') {
      newAprobacion = 'RECHAZADO';
      estadoEnum = 'CANCELADO';
    } else {
      estadoEnum = 'PENDIENTE';
    }

    // Write to real DB columns (source of truth)
    v.estadoEntrega = estadoEnum;
    v.estadoAprobacion = newAprobacion;

    // Also keep obsObj JSON in sync for backward compatibility
    obsObj.estadoAprobacion = newAprobacion;
    v.observaciones = JSON.stringify(obsObj);

    await v.save();

    return {
      id: v.idVenta,
      idVenta: v.idVenta,
      estado: nuevoEstado,
      estadoEntrega: estadoEnum,
      estadoAprobacion: newAprobacion,
      message: `Estado de la orden #${v.idVenta} actualizado a "${nuevoEstado}" con éxito`
    };
  }

  static async delete(id) {
    const { Op } = require('sequelize');
    let v = null;
    let idVentaNum = Number(id);

    if (!isNaN(idVentaNum) && idVentaNum > 0) {
      v = await Venta.findByPk(idVentaNum);
    }

    if (!v && typeof id === 'string') {
      v = await Venta.findOne({
        where: {
          observaciones: {
            [Op.like]: `%"codigoPedido":"${id}"%`
          }
        }
      });
    }

    if (!v) {
      const numMatch = String(id).match(/\d+/);
      if (numMatch) {
        v = await Venta.findByPk(Number(numMatch[0]));
      }
    }

    if (v) {
      const targetId = v.idVenta;
      const { sequelize, DetalleVentaProducto, DetalleVentaAdicion, Pago, Devolucion } = require('../../persistence/models');

      // Execute physical deletion in a managed transaction
      await sequelize.transaction(async (t) => {
        // 1. Get all DetalleVentaProducto IDs for this venta
        const detalles = await DetalleVentaProducto.findAll({
          where: { idVenta: targetId },
          attributes: ['idDetalleVenta'],
          transaction: t
        });
        const detalleIds = detalles.map(d => d.idDetalleVenta);

        // 2. Delete all DetalleVentaAdicion associated with those detalles
        if (detalleIds.length > 0) {
          await DetalleVentaAdicion.destroy({
            where: { idDetalleVenta: { [Op.in]: detalleIds } },
            transaction: t
          });
        }

        // 3. Delete all DetalleVentaProducto
        await DetalleVentaProducto.destroy({
          where: { idVenta: targetId },
          transaction: t
        });

        // 4. Delete associated Pagos if table exists
        if (Pago) {
          await Pago.destroy({
            where: { idVenta: targetId },
            transaction: t
          });
        }

        // 5. Delete associated Devoluciones if table exists
        if (Devolucion) {
          await Devolucion.destroy({
            where: { idVenta: targetId },
            transaction: t
          });
        }

        // 6. Physically delete the Venta row
        await v.destroy({ transaction: t });
      });

      return { message: `Orden #${targetId} eliminada de la base de datos con éxito` };
    }

    return { message: "Orden procesada o no encontrada" };
  }
}

module.exports = ProduccionService;
