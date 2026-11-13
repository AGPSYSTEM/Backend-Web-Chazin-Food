const { Venta, DetalleVentaProducto, DetalleVentaAdicion, Adicion, Variante, VarianteInsumo, Product, FichaTecnica, DetalleFichaInsumo, Insumo, Cliente, User } = require('../../persistence/models');

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

const { Op } = require('sequelize');

function formatColombiaTime(dateInput) {
  if (!dateInput) return null;
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Bogota',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(d);
}

function formatColombiaTimeWithSeconds(dateInput) {
  if (!dateInput) return null;
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Bogota',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(d);
}

function formatColombiaDate(dateInput) {
  const d = dateInput ? (dateInput instanceof Date ? dateInput : new Date(dateInput)) : new Date();
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d);
}

function inferProductPrepMinutes(nombreProducto = '', ftTiempo = null) {
  const n = String(nombreProducto || '').toLowerCase();
  const hasFoodKeyword =
    n.includes('hamburguesa') ||
    n.includes('burger') ||
    n.includes('perro') ||
    n.includes('salchipapa') ||
    n.includes('combo') ||
    n.includes('papa') ||
    n.includes('casco') ||
    n.includes('corral') ||
    n.includes('espiral') ||
    n.includes('chili') ||
    n.includes('tocineta');

  const isSimpleDrink =
    !hasFoodKeyword &&
    (n.includes('gaseosa') ||
      n.includes('coca-cola') ||
      n.includes('coca cola') ||
      n.includes('postobón') ||
      n.includes('postobon') ||
      n.includes('pepsi') ||
      n.includes('colombiana') ||
      n.includes('sprite') ||
      n.includes('quatro') ||
      n.includes('cuatro') ||
      n.includes('agua') ||
      n.includes('cristal') ||
      n.includes('jugo') ||
      n.includes('hit') ||
      n.includes('bebida'));

  const parsedFt = Number(ftTiempo);
  if (!isNaN(parsedFt) && parsedFt > 0) {
    if (!isSimpleDrink && parsedFt <= 2) {
      // Si es un plato cocinado pero tenía 1 min por error, inferir tiempo real de cocción
    } else {
      return parsedFt;
    }
  }

  if (isSimpleDrink) return 1;
  if (n.includes('combo') || n.includes('familiar') || n.includes('pareja')) return 14;
  if (n.includes('doble') || n.includes('salvaje') || n.includes('trufada') || n.includes('fest')) return 12;
  if (n.includes('hamburguesa') || n.includes('burger') || n.includes('salchipapa')) return 10;
  if (n.includes('perro')) return 8;
  if (n.includes('papa') || n.includes('casco') || n.includes('corral') || n.includes('espiral')) return 7;
  return 10;
}

function calculateOrderPrepTime(productosList = []) {
  if (!Array.isArray(productosList) || productosList.length === 0) {
    return { totalMin: 12, formatted: '12 min' };
  }

  const withMinutes = productosList.map((p) => {
    const rawRecetaMin = p.receta?.tiempoPreparacionMin || parseInt(String(p.receta?.tiempoPreparacion || ''), 10);
    const min = inferProductPrepMinutes(p.nombre, rawRecetaMin);
    return {
      ...p,
      tiempoPreparacionMin: min,
      qty: Math.max(1, Number(p.cantidad) || 1)
    };
  });

  const cookedDishes = withMinutes.filter((p) => p.tiempoPreparacionMin > 2);
  if (cookedDishes.length > 0) {
    const maxCookedMin = Math.max(...cookedDishes.map((p) => p.tiempoPreparacionMin));
    const totalCookedUnits = cookedDishes.reduce((sum, p) => sum + p.qty, 0);
    // Agregar +2 min por cada unidad cocinada adicional en parrilla/freidora (tope +10 min)
    const extraBatchMin = Math.min(10, Math.max(0, totalCookedUnits - 1) * 2);
    const totalMin = maxCookedMin + extraBatchMin;
    return { totalMin, formatted: `${totalMin} min` };
  }

  const maxDrinkMin = Math.max(1, ...withMinutes.map((p) => p.tiempoPreparacionMin || 1));
  return { totalMin: maxDrinkMin, formatted: `${maxDrinkMin} min` };
}

class ProduccionService {
  static async getAll() {
    try {
      const ventas = await Venta.findAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { estadoAprobacion: 'APROBADO' },
                {
                  estadoAprobacion: null,
                  estadoEntrega: { [Op.in]: ['PREPARANDO', 'LISTO', 'ENTREGADO', 'DESPACHADO'] }
                }
              ]
            },
            {
              estadoEntrega: { [Op.ne]: 'CANCELADO' }
            }
          ]
        },
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
                    model: VarianteInsumo,
                    as: 'insumosModificados',
                    include: [
                      { model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] },
                      { model: Insumo, as: 'insumoReemplazado', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }
                    ]
                  },
                  {
                    model: FichaTecnica,
                    as: 'fichasTecnicas',
                    required: false,
                    where: { estado: 1, tipo: 'VARIANTE' },
                    include: [
                      {
                        model: DetalleFichaInsumo,
                        as: 'detalles',
                        include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
                      }
                    ]
                  },
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

      const mappedOrders = ventas.map((v) => {
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

        // Format dates strictly in America/Bogota timezone (UTC-5)
        const fechaStr = formatColombiaDate(v.fechaVenta);
        const horaStr = formatColombiaTime(v.fechaVenta) || obsObj.horario || "12:00 PM";

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
                precio: parseFloat(a.precio !== undefined && a.precio !== null ? a.precio : (a.precioUnitario || a.adicion?.precioAdicion || a.adicion?.precio || 0))
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

            // Build recipe / ficha técnica if exists (prioritizing dedicated variant ficha when configured)
            let receta = null;
            const variantFicha = Array.isArray(d.variante?.fichasTecnicas)
              ? d.variante.fichasTecnicas.find(vf => vf.tipo === 'VARIANTE' && vf.estado === 1)
              : null;
            const activeFt = (variantFicha && Array.isArray(variantFicha.detalles) && variantFicha.detalles.length > 0)
              ? variantFicha
              : ft;
            const inferredPrepMin = inferProductPrepMinutes(itemNombre, activeFt?.tiempoPreparacion);
            if (activeFt) {
              const rawDetalles = [...(activeFt.detalles || [])];
              const varDeltas = (activeFt === variantFicha) ? [] : (d.variante?.insumosModificados || []);
              let ingredientes = [];

              if (varDeltas && varDeltas.length > 0) {
                let mappedIngs = rawDetalles.map(det => ({
                  idInsumo: det.idInsumo,
                  nombre: det.insumo?.nombre || `Insumo #${det.idInsumo}`,
                  cantidad: `${det.cantidad || 1} ${det.unidadMedida || det.insumo?.unidadMedida || 'und'}`,
                  tipo: 'BASE'
                }));

                for (const delta of varDeltas) {
                  const deltaAccion = String(delta.tipoAccion || 'AGREGAR').toUpperCase();
                  const deltaQty = `${delta.cantidad || 1} ${delta.unidadMedida || delta.insumo?.unidadMedida || 'und'}`;
                  const insName = delta.insumo?.nombre || `Insumo #${delta.idInsumo}`;

                  if (deltaAccion === 'AGREGAR') {
                    mappedIngs.push({
                      idInsumo: delta.idInsumo,
                      nombre: `+ ${insName} (Variante)`,
                      cantidad: deltaQty,
                      tipo: 'AGREGADO_VARIANTE'
                    });
                  } else if (deltaAccion === 'REEMPLAZAR') {
                    if (delta.idInsumoReemplazado) {
                      mappedIngs = mappedIngs.filter(det => Number(det.idInsumo) !== Number(delta.idInsumoReemplazado));
                    }
                    mappedIngs.push({
                      idInsumo: delta.idInsumo,
                      nombre: `🔄 ${insName} (Reemplazo Variante)`,
                      cantidad: deltaQty,
                      tipo: 'REEMPLAZO_VARIANTE'
                    });
                  } else if (deltaAccion === 'MODIFICAR_CANTIDAD') {
                    const existingIdx = mappedIngs.findIndex(det => Number(det.idInsumo) === Number(delta.idInsumo));
                    if (existingIdx >= 0) {
                      mappedIngs[existingIdx].cantidad = `${deltaQty} (Ajuste Variante)`;
                      mappedIngs[existingIdx].tipo = 'MODIFICADO_VARIANTE';
                    } else {
                      mappedIngs.push({
                        idInsumo: delta.idInsumo,
                        nombre: `${insName} (Ajuste Variante)`,
                        cantidad: deltaQty,
                        tipo: 'MODIFICADO_VARIANTE'
                      });
                    }
                  } else if (deltaAccion === 'QUITAR') {
                    mappedIngs = mappedIngs.filter(det => Number(det.idInsumo) !== Number(delta.idInsumo));
                  }
                }
                ingredientes = mappedIngs;
              } else {
                ingredientes = rawDetalles.map(det => ({
                  idInsumo: det.idInsumo,
                  nombre: det.insumo?.nombre || `Insumo #${det.idInsumo}`,
                  cantidad: `${det.cantidad || 1} ${det.unidadMedida || det.insumo?.unidadMedida || 'und'}`,
                  tipo: 'BASE'
                }));
              }

              const rawPasos = activeFt.procedimiento || activeFt.descripcion || "";
              const pasos = rawPasos
                ? rawPasos.split("\n").map(p => p.trim()).filter(Boolean)
                : ["Preparar los ingredientes según porciones", "Cocinar y montar según estándares de la casa"];

              receta = {
                idFichaTecnica: activeFt.idFichaTecnica,
                idProducto: activeFt.idProducto,
                tiempoPreparacion: `${inferredPrepMin} min`,
                tiempoPreparacionMin: inferredPrepMin,
                rendimiento: activeFt.rendimiento || "1 porción",
                especificaciones: activeFt.especificaciones || "",
                caracteristicas: activeFt.caracteristicas || "",
                informacionNutricional: activeFt.informacionNutricional || "",
                condicionesAlmacenamiento: activeFt.condicionesAlmacenamiento || "",
                vidaUtil: activeFt.vidaUtil || "",
                ingredientes,
                pasos
              };
            } else {
              receta = {
                idFichaTecnica: null,
                idProducto: prod?.idProducto || null,
                tiempoPreparacion: `${inferredPrepMin} min`,
                tiempoPreparacionMin: inferredPrepMin,
                rendimiento: "1 porción",
                especificaciones: "",
                caracteristicas: "",
                informacionNutricional: "",
                condicionesAlmacenamiento: "",
                vidaUtil: "",
                ingredientes: [],
                pasos: ["Preparar los ingredientes según porciones", "Cocinar y montar según estándares de la casa"]
              };
            }

            // Detección de promoción 2x1 ("Paga 1 y lleva 2")
            const hasActive2x1Event = Boolean(
              Array.isArray(prod?.eventos) && prod.eventos.some(e =>
                (e.estado === 1 || e.estado === 'Activo' || e.estado === undefined) &&
                (e.tipoEvento === 'PROMOCION_2X1' || (e.nombreEvento && e.nombreEvento.toLowerCase().includes('2x1')) || (e.descripcion && e.descripcion.toLowerCase().includes('lleva 2')))
              )
            );

            const isPromo2x1 = Boolean(
              hasActive2x1Event ||
              (itemNombre && (itemNombre.toLowerCase().includes("2x1") || itemNombre.toLowerCase().includes("lleva 2") || itemNombre.toLowerCase().includes("paga 1"))) ||
              (itemObs && (itemObs.toLowerCase().includes("2x1") || itemObs.toLowerCase().includes("lleva 2") || itemObs.toLowerCase().includes("paga 1"))) ||
              (matchedObsProd && (matchedObsProd.is2x1Promo || (matchedObsProd.nombre && matchedObsProd.nombre.toLowerCase().includes("2x1")) || (matchedObsProd.observaciones && matchedObsProd.observaciones.toLowerCase().includes("2x1")))) ||
              (matchedObsProd?.cantidadCocina && Number(matchedObsProd.cantidadCocina) > qty) ||
              (d.observaciones && (d.observaciones.toLowerCase().includes("2x1") || d.observaciones.toLowerCase().includes("lleva 2")))
            );

            const kitchenQty = isPromo2x1 ? (Number(matchedObsProd?.cantidadCocina) || qty * 2) : qty;
            totalItemsCount += (kitchenQty - qty);

            let displayObs = itemObs;
            if (isPromo2x1 && !displayObs.toLowerCase().includes("promo 2x1")) {
              displayObs = `🔥 ¡PROMO 2x1!: Preparar ${kitchenQty} unidades (${qty} pagada + ${kitchenQty - qty} gratis)${displayObs ? ' • ' + displayObs : ''}`;
            }

            // Si es promo 2x1, escalar los insumos de la receta a la cantidad exacta de cocina
            if (receta && kitchenQty > 1 && Array.isArray(receta.ingredientes)) {
              receta.ingredientes = receta.ingredientes.map(ing => {
                const parts = String(ing.cantidad).split(' ');
                const num = parseFloat(parts[0]);
                const unit = parts.slice(1).join(' ');
                if (!isNaN(num)) {
                  return {
                    ...ing,
                    cantidad: `${num * kitchenQty} ${unit}`
                  };
                }
                return ing;
              });
              receta.rendimiento = `${kitchenQty} porciones (Promo 2x1)`;
            }

            productosList.push({
              id: d.idDetalleVenta,
              idProducto: prod?.idProducto || null,
              idVariante: d.idVariante,
              varianteNombre: d.variante && !d.variante.nombre?.includes('- base') ? d.variante.nombre : null,
              varianteDescripcion: d.variante?.descripcion || null,
              nombre: itemNombre,
              cantidad: kitchenQty,
              cantidadFacturada: qty,
              isPromo2x1: isPromo2x1,
              precioUnitario: parseFloat(d.precioUnitario || 0),
              total: parseFloat(d.subtotal || 0),
              observaciones: displayObs,
              adiciones: itemAdiciones,
              receta
            });
          }
        } else if (Array.isArray(obsObj.productos) && obsObj.productos.length > 0) {
          for (const p of obsObj.productos) {
            const qty = Number(p.cantidad) || 1;
            let pObs = p.observaciones || p.nota || "";
            if (pObs.toLowerCase().trim() === (p.nombre || "").toLowerCase().trim()) {
              pObs = "";
            }

            const isPromo2x1Fallback = Boolean(
              p.is2x1Promo ||
              (p.nombre && (p.nombre.toLowerCase().includes("2x1") || p.nombre.toLowerCase().includes("lleva 2") || p.nombre.toLowerCase().includes("paga 1"))) ||
              (pObs && (pObs.toLowerCase().includes("2x1") || pObs.toLowerCase().includes("lleva 2") || pObs.toLowerCase().includes("paga 1"))) ||
              (p.cantidadCocina && Number(p.cantidadCocina) > qty)
            );

            const kitchenQtyFallback = isPromo2x1Fallback ? (Number(p.cantidadCocina) || qty * 2) : qty;
            totalItemsCount += (kitchenQtyFallback - qty);

            let displayObsFallback = pObs;
            if (isPromo2x1Fallback && !displayObsFallback.toLowerCase().includes("promo 2x1")) {
              displayObsFallback = `🔥 ¡PROMO 2x1!: Preparar ${kitchenQtyFallback} unidades (${qty} pagada + ${kitchenQtyFallback - qty} gratis)${displayObsFallback ? ' • ' + displayObsFallback : ''}`;
            }

            const fallbackPrepMin = inferProductPrepMinutes(p.nombre || "Producto", p.receta?.tiempoPreparacionMin);
            const fallbackReceta = p.receta ? {
              ...p.receta,
              tiempoPreparacion: `${fallbackPrepMin} min`,
              tiempoPreparacionMin: fallbackPrepMin
            } : {
              idFichaTecnica: null,
              idProducto: p.idProducto || null,
              tiempoPreparacion: `${fallbackPrepMin} min`,
              tiempoPreparacionMin: fallbackPrepMin,
              rendimiento: "1 porción",
              ingredientes: [],
              pasos: ["Preparar los ingredientes según porciones", "Cocinar y montar según estándares de la casa"]
            };

            productosList.push({
              id: p.id || p.idVariante || Math.random(),
              idProducto: p.idProducto || null,
              idVariante: p.idVariante || null,
              nombre: p.nombre || "Producto",
              cantidad: kitchenQtyFallback,
              cantidadFacturada: qty,
              isPromo2x1: isPromo2x1Fallback,
              precioUnitario: parseFloat(p.precio || p.precioUnitario || 0),
              total: parseFloat(p.total || 0),
              observaciones: displayObsFallback,
              adiciones: p.adiciones || [],
              receta: fallbackReceta
            });
          }
        }

        // Map delivery/production status including intermediate Despachado state
        const est = (v.estadoEntrega || 'PENDIENTE').toUpperCase();
        const subEst = String(obsObj.estadoCocina || '').toUpperCase();
        let estadoStr = "En Cola";
        if (est === 'PREPARANDO' || est === 'EN PREPARACIÓN') {
          estadoStr = "En Preparación";
        } else if (est === 'LISTO' && subEst === 'DESPACHADO') {
          estadoStr = "Despachado";
        } else if (est === 'LISTO') {
          estadoStr = "Listo";
        } else if (est === 'DESPACHADO' || est === 'EN_CAMINO') {
          estadoStr = "Despachado";
        } else if (est === 'ENTREGADO' || est === 'COMPLETADA') {
          estadoStr = "Entregado";
        } else {
          estadoStr = "En Cola";
        }

        const platilloNombre = productosList.length > 0
          ? productosList.map(p => `${p.nombre} (x${p.cantidad})`).join(', ')
          : "Pedido General";

        const primaryProd = productosList[0];
        const mainEmoji = getProductEmoji(primaryProd?.nombre || platilloNombre);

        // Calculate accurate kitchen preparation time across ALL items in the order
        const orderPrep = calculateOrderPrepTime(productosList);

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

        // Enrich productosList with saved checklist verification if present
        const savedChecklist = Array.isArray(obsObj.checklistPreparacion) ? obsObj.checklistPreparacion : null;
        if (savedChecklist && savedChecklist.length > 0) {
          productosList.forEach((prodItem, idx) => {
            const matchedCheck = savedChecklist.find(
              c => (c.id !== undefined && c.id === prodItem.id) ||
                   (c.index !== undefined && Number(c.index) === idx) ||
                   (c.nombre && prodItem.nombre && c.nombre.toLowerCase().trim() === prodItem.nombre.toLowerCase().trim())
            ) || savedChecklist[idx];
            if (matchedCheck) {
              prodItem.completado = Boolean(matchedCheck.completado);
              prodItem.cantidadPreparada = matchedCheck.cantidadPreparada !== undefined
                ? Number(matchedCheck.cantidadPreparada)
                : (matchedCheck.completado ? prodItem.cantidad : 0);
              prodItem.estadoChecklist = matchedCheck.estadoChecklist || (matchedCheck.completado ? 'COMPLETO' : 'NO_PREPARADO');
              prodItem.motivoNoPreparado = matchedCheck.motivo || matchedCheck.motivoNoPreparado || "";
            }
          });
        }

        const pedidoCompleto = obsObj.pedidoCompleto !== undefined
          ? Boolean(obsObj.pedidoCompleto)
          : (savedChecklist && savedChecklist.length > 0
              ? savedChecklist.every(c => Boolean(c.completado) && Number(c.cantidadPreparada ?? c.cantidad ?? 1) >= Number(c.cantidad ?? 1))
              : null);

        const tieneAlertaIncompleto = pedidoCompleto === false;

        // El cliente es quien recibe; el responsable/cocinero es quien cocina (Requisito 9)
        const cocineroNombre = obsObj.cocinero ||
          obsObj.responsableCocina ||
          (v.usuario && v.usuario.idRol !== 4 ? `${v.usuario.nombre} ${v.usuario.apellidos || ''}`.trim() : null) ||
          "Chef de Turno";

        // Synchronized per-stage timestamps in America/Bogota (UTC-5)
        const historial = Array.isArray(obsObj.historialEstados) ? obsObj.historialEstados : [];
        const savedTiempos = (obsObj.tiemposEstados && typeof obsObj.tiemposEstados === 'object') ? obsObj.tiemposEstados : {};

        const entryPreparando = [...historial].reverse().find(h => {
          const st = String(h?.estado || '').toUpperCase();
          return st === 'PREPARANDO' || st === 'EN PREPARACIÓN' || st === 'EN PREPARACION' || st === 'EN_PREPARACION';
        });
        const entryListo = [...historial].reverse().find(h => {
          const st = String(h?.estado || '').toUpperCase();
          return st === 'LISTO' || st === 'LISTOS';
        });
        const entryDespachado = [...historial].reverse().find(h => {
          const st = String(h?.estado || '').toUpperCase();
          return st === 'DESPACHADO' || st === 'EN_CAMINO';
        });
        const entryEntregado = [...historial].reverse().find(h => {
          const st = String(h?.estado || '').toUpperCase();
          return st === 'ENTREGADO' || st === 'COMPLETADA';
        });
        const lastHistEntry = historial.length > 0 ? historial[historial.length - 1] : null;

        const baseVentaDate = v.fechaVenta ? new Date(v.fechaVenta) : new Date();
        const baseMs = !isNaN(baseVentaDate.getTime()) ? baseVentaDate.getTime() : Date.now();
        const addMinIso = (ms, mins) => new Date(ms + mins * 60000).toISOString();

        // 1. En Cola
        const fechaEnColaIso = savedTiempos.enCola?.fecha || (v.fechaVenta ? baseVentaDate.toISOString() : null);
        const horaEnCola = savedTiempos.enCola?.hora || formatColombiaTime(fechaEnColaIso) || horaStr;
        const horaEnColaExacta = savedTiempos.enCola?.horaExacta || formatColombiaTimeWithSeconds(fechaEnColaIso) || horaEnCola;

        // 2. En Preparación
        let fechaInicioPrep =
          savedTiempos.enPreparacion?.fecha ||
          obsObj.fechaInicioPreparacion ||
          entryPreparando?.fecha ||
          (estadoStr === 'En Preparación' ? obsObj.fechaCambioEstado : null) ||
          null;
        if (!fechaInicioPrep && ['En Preparación', 'Listo', 'Despachado', 'Entregado'].includes(estadoStr)) {
          fechaInicioPrep = addMinIso(baseMs, 1);
        } else if (
          fechaInicioPrep &&
          formatColombiaTime(fechaInicioPrep) === horaEnCola &&
          !savedTiempos.enPreparacion &&
          !entryPreparando &&
          ['En Preparación', 'Listo', 'Despachado', 'Entregado'].includes(estadoStr)
        ) {
          fechaInicioPrep = addMinIso(baseMs, 1);
        }
        const horaInicioPreparacion =
          savedTiempos.enPreparacion?.hora ||
          formatColombiaTime(fechaInicioPrep) ||
          obsObj.horaInicioPreparacion ||
          null;
        const horaInicioPrepExacta =
          savedTiempos.enPreparacion?.horaExacta ||
          entryPreparando?.horaExacta ||
          formatColombiaTimeWithSeconds(fechaInicioPrep) ||
          horaInicioPreparacion;

        // 3. Listo
        const prepMinutos = Math.max(1, Number(orderPrep.totalMin) || 10);
        const prepStartMs = fechaInicioPrep && !isNaN(new Date(fechaInicioPrep).getTime())
          ? new Date(fechaInicioPrep).getTime()
          : baseMs + 60000;

        let fechaListoIso =
          savedTiempos.listo?.fecha ||
          obsObj.fechaListo ||
          entryListo?.fecha ||
          (estadoStr === 'Listo' ? obsObj.fechaCambioEstado : null) ||
          null;
        if (!fechaListoIso && ['Listo', 'Despachado', 'Entregado'].includes(estadoStr)) {
          fechaListoIso = addMinIso(prepStartMs, prepMinutos);
        } else if (
          fechaListoIso &&
          formatColombiaTime(fechaListoIso) === horaEnCola &&
          !savedTiempos.listo &&
          !entryListo &&
          ['Listo', 'Despachado', 'Entregado'].includes(estadoStr)
        ) {
          fechaListoIso = addMinIso(prepStartMs, prepMinutos);
        }
        const horaListo =
          savedTiempos.listo?.hora ||
          formatColombiaTime(fechaListoIso) ||
          obsObj.horaListo ||
          null;
        const horaListoExacta =
          savedTiempos.listo?.horaExacta ||
          entryListo?.horaExacta ||
          formatColombiaTimeWithSeconds(fechaListoIso) ||
          horaListo;

        // 4. Despachado
        const listoMs = fechaListoIso && !isNaN(new Date(fechaListoIso).getTime())
          ? new Date(fechaListoIso).getTime()
          : prepStartMs + prepMinutos * 60000;

        let fechaDespachadoIso =
          savedTiempos.despachado?.fecha ||
          obsObj.fechaDespachado ||
          entryDespachado?.fecha ||
          (estadoStr === 'Despachado' ? obsObj.fechaCambioEstado : null) ||
          null;
        if (!fechaDespachadoIso && ['Despachado', 'Entregado'].includes(estadoStr)) {
          fechaDespachadoIso = addMinIso(listoMs, 1);
        } else if (
          fechaDespachadoIso &&
          formatColombiaTime(fechaDespachadoIso) === horaEnCola &&
          !savedTiempos.despachado &&
          !entryDespachado &&
          ['Despachado', 'Entregado'].includes(estadoStr)
        ) {
          fechaDespachadoIso = addMinIso(listoMs, 1);
        }
        const horaDespachado =
          savedTiempos.despachado?.hora ||
          formatColombiaTime(fechaDespachadoIso) ||
          obsObj.horaDespachado ||
          null;
        const horaDespachadoExacta =
          savedTiempos.despachado?.horaExacta ||
          entryDespachado?.horaExacta ||
          formatColombiaTimeWithSeconds(fechaDespachadoIso) ||
          horaDespachado;

        // 5. Entregado
        const despachadoMs = fechaDespachadoIso && !isNaN(new Date(fechaDespachadoIso).getTime())
          ? new Date(fechaDespachadoIso).getTime()
          : listoMs + 60000;

        let fechaEntregaIso =
          savedTiempos.entregado?.fecha ||
          obsObj.fechaEntrega ||
          entryEntregado?.fecha ||
          (estadoStr === 'Entregado' ? obsObj.fechaCambioEstado : null) ||
          null;
        if (!fechaEntregaIso && estadoStr === 'Entregado') {
          fechaEntregaIso = addMinIso(despachadoMs, finalTipo === 'Domicilio' ? 15 : 2);
        } else if (
          fechaEntregaIso &&
          formatColombiaTime(fechaEntregaIso) === horaEnCola &&
          !savedTiempos.entregado &&
          !entryEntregado &&
          estadoStr === 'Entregado'
        ) {
          fechaEntregaIso = addMinIso(despachadoMs, finalTipo === 'Domicilio' ? 15 : 2);
        }
        const horaEntrega =
          savedTiempos.entregado?.hora ||
          formatColombiaTime(fechaEntregaIso) ||
          obsObj.horaEntrega ||
          null;
        const horaEntregaExacta =
          savedTiempos.entregado?.horaExacta ||
          entryEntregado?.horaExacta ||
          formatColombiaTimeWithSeconds(fechaEntregaIso) ||
          horaEntrega;

        const horaEstadoCalculada =
          (estadoStr === 'En Cola' ? horaEnCola : null) ||
          (estadoStr === 'En Preparación' ? horaInicioPreparacion : null) ||
          (estadoStr === 'Listo' ? horaListo : null) ||
          (estadoStr === 'Despachado' ? horaDespachado : null) ||
          (estadoStr === 'Entregado' ? horaEntrega : null) ||
          formatColombiaTime(obsObj.fechaCambioEstado) ||
          formatColombiaTime(lastHistEntry?.fecha) ||
          horaStr;

        const tiemposEstados = {
          enCola: { estado: 'En Cola', hora: horaEnCola, horaExacta: horaEnColaExacta, fecha: fechaEnColaIso },
          ...(horaInicioPreparacion ? { enPreparacion: { estado: 'En Preparación', hora: horaInicioPreparacion, horaExacta: horaInicioPrepExacta, fecha: fechaInicioPrep } } : {}),
          ...(horaListo ? { listo: { estado: 'Listo', hora: horaListo, horaExacta: horaListoExacta, fecha: fechaListoIso } } : {}),
          ...(horaDespachado ? { despachado: { estado: 'Despachado', hora: horaDespachado, horaExacta: horaDespachadoExacta, fecha: fechaDespachadoIso } } : {}),
          ...(horaEntrega ? { entregado: { estado: 'Entregado', hora: horaEntrega, horaExacta: horaEntregaExacta, fecha: fechaEntregaIso } } : {})
        };

        const savedTiempo = String(v.tiempoEstimadoEntrega || obsObj.tiempoEstimadoEntrega || '').trim();
        const normSavedTiempo = savedTiempo.toLowerCase().replace(/\s+/g, '');
        const isGenericDefaultTiempo = !savedTiempo || normSavedTiempo === '15-20min' || normSavedTiempo === '30-45min' || normSavedTiempo === '35-45min';
        const isManualTiempo = String(obsObj.modoTiempoEntrega || '').toUpperCase() === 'MANUAL' || (!obsObj.modoTiempoEntrega && !isGenericDefaultTiempo);

        let autoTiempoEntrega;
        if (estadoStr === 'Entregado') {
          autoTiempoEntrega = 'Entregado';
        } else if (estadoStr === 'Despachado') {
          autoTiempoEntrega = finalTipo === 'Domicilio' ? 'En camino' : 'Listo para entrega';
        } else if (estadoStr === 'Listo') {
          autoTiempoEntrega = finalTipo === 'Domicilio' ? '15-20 min' : 'Listo para entrega';
        } else if (finalTipo === 'Domicilio') {
          autoTiempoEntrega = `${orderPrep.totalMin + 15}-${orderPrep.totalMin + 25} min`;
        } else if (orderPrep.totalMin <= 2) {
          autoTiempoEntrega = '2-5 min';
        } else {
          autoTiempoEntrega = `${orderPrep.totalMin + 3}-${orderPrep.totalMin + 8} min`;
        }

        const tiempoEstimadoEntrega =
          estadoStr === 'Entregado'
            ? 'Entregado'
            : (isManualTiempo && savedTiempo ? savedTiempo : autoTiempoEntrega);

        return {
          id: v.idVenta,
          idVenta: v.idVenta,
          codigo,
          platilloNombre,
          imagen: mainEmoji,
          cantidad: totalItemsCount || 1,
          cliente: clienteNombre,
          responsable: cocineroNombre,
          cocinero: cocineroNombre,
          responsableCocina: cocineroNombre,
          tiempo: orderPrep.formatted,
          tiempoMinutos: orderPrep.totalMin,
          tiempoEstimadoEntrega,
          modoTiempoEntrega: isManualTiempo ? 'MANUAL' : 'AUTO',
          tiempoAutomaticoSugerido: autoTiempoEntrega,
          fecha: fechaStr,
          horaPedido: horaEnCola,
          horaInicio: horaInicioPreparacion || horaEnCola,
          horaInicioPreparacion: horaInicioPreparacion || null,
          horaListo: horaListo || null,
          horaDespachado: horaDespachado || null,
          horaEntrega: horaEntrega || null,
          horaEstado: horaEstadoCalculada,
          fechaInicioPreparacion: fechaInicioPrep || null,
          fechaListo: fechaListoIso || null,
          fechaDespachado: fechaDespachadoIso || null,
          fechaEntrega: fechaEntregaIso || null,
          fechaCambioEstado: obsObj.fechaCambioEstado || lastHistEntry?.fecha || null,
          tiemposEstados,
          historialEstados: historial,
          fechaVenta: v.fechaVenta,
          estado: estadoStr,
          estadoAprobacion: 'APROBADO',
          estadoEntrega: v.estadoEntrega || 'PENDIENTE',
          alerta: tieneAlertaIncompleto,
          observaciones: cleanGeneralObs,
          tipo: finalTipo,
          mesa: finalMesa,
          tipoVenta: v.tipoVenta || (finalTipo === 'Domicilio' ? 'DOMICILIO' : 'PUNTO_DE_VENTA'),
          productos: productosList,
          checklistPreparacion: savedChecklist,
          pedidoCompleto,
          observacionCocina: obsObj.observacionCocina || "",
          fechaVerificacionCocina: obsObj.fechaVerificacionCocina || null
        };
      });

      // Sequential numerical priority calculation (1, 2, 3, ...) for active orders in preparation order (Item 117)
      const activeQueue = mappedOrders
        .filter(o => o.estado === "En Cola" || o.estado === "En Preparación")
        .sort((a, b) => {
          const dateA = a.fechaVenta ? new Date(a.fechaVenta).getTime() : a.id;
          const dateB = b.fechaVenta ? new Date(b.fechaVenta).getTime() : b.id;
          return dateA - dateB;
        });

      const priorityMap = new Map();
      activeQueue.forEach((order, index) => {
        priorityMap.set(order.id, index + 1);
      });

      return mappedOrders.map(o => {
        const seqPrioridad = priorityMap.get(o.id) || null;
        return {
          ...o,
          prioridad: seqPrioridad || (o.estado === "Listo" || o.estado === "Despachado" || o.estado === "Entregado" ? null : 1),
          turno: seqPrioridad || null
        };
      });
    } catch (err) {
      console.error('Error al cargar órdenes en ProduccionService.getAll:', err);
      return [];
    }
  }

  static async create() {
    const error = new Error('Las órdenes de producción se generan automáticamente a partir de las ventas aprobadas.');
    error.statusCode = 400;
    throw error;
  }

  static async updateEstado(id, nuevoEstado, extraData = {}) {
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
    let estadoCocinaInterno = obsObj.estadoCocina || 'EN_COLA';
    const norm = String(nuevoEstado || '').toUpperCase();

    if (norm === 'APROBAR' || norm === 'APROBADO') {
      newAprobacion = 'APROBADO';
      if (estadoEnum === 'PENDIENTE') {
        estadoEnum = 'PREPARANDO';
        estadoCocinaInterno = 'EN_PREPARACION';
      }
    } else if (norm === 'RECHAZAR' || norm === 'RECHAZADO') {
      newAprobacion = 'RECHAZADO';
      estadoEnum = 'CANCELADO';
      estadoCocinaInterno = 'CANCELADO';
    } else if (norm === 'EN PREPARACIÓN' || norm === 'EN PREPARACION' || norm === 'PREPARANDO') {
      newAprobacion = 'APROBADO';
      estadoEnum = 'PREPARANDO';
      estadoCocinaInterno = 'EN_PREPARACION';
    } else if (norm === 'LISTO' || norm === 'LISTOS') {
      newAprobacion = 'APROBADO';
      estadoEnum = 'LISTO';
      estadoCocinaInterno = 'LISTO';
    } else if (norm === 'DESPACHADO' || norm === 'EN_CAMINO') {
      newAprobacion = 'APROBADO';
      estadoEnum = 'LISTO';
      estadoCocinaInterno = 'DESPACHADO';
    } else if (norm === 'ENTREGADO' || norm === 'COMPLETADA') {
      newAprobacion = 'APROBADO';
      estadoEnum = 'ENTREGADO';
      estadoCocinaInterno = 'ENTREGADO';
    } else if (norm === 'ANULADA' || norm === 'CANCELADO' || norm === 'CANCELADA') {
      newAprobacion = 'RECHAZADO';
      estadoEnum = 'CANCELADO';
      estadoCocinaInterno = 'CANCELADO';
    } else {
      estadoEnum = 'PENDIENTE';
      estadoCocinaInterno = 'EN_COLA';
    }

    // Write to real DB columns (source of truth)
    v.estadoEntrega = estadoEnum;
    v.estadoAprobacion = newAprobacion;

    // Also keep obsObj JSON in sync for backward compatibility
    obsObj.estadoAprobacion = newAprobacion;
    obsObj.estadoCocina = estadoCocinaInterno;

    const ahora = new Date();
    const horaActual = formatColombiaTime(ahora);
    const horaActualConSegundos = formatColombiaTimeWithSeconds(ahora);
    obsObj.horaEstado = horaActual;
    obsObj.horaExactaEstado = horaActualConSegundos;
    obsObj.fechaCambioEstado = ahora.toISOString();

    if (!obsObj.tiemposEstados || typeof obsObj.tiemposEstados !== 'object') {
      const baseFechaIso = v.fechaVenta ? new Date(v.fechaVenta).toISOString() : ahora.toISOString();
      const baseHora = formatColombiaTime(v.fechaVenta) || obsObj.horario || horaActual;
      obsObj.tiemposEstados = {
        enCola: {
          estado: 'En Cola',
          hora: baseHora,
          horaExacta: formatColombiaTimeWithSeconds(v.fechaVenta) || baseHora,
          fecha: baseFechaIso
        }
      };
    }

    if (estadoCocinaInterno === 'EN_PREPARACION') {
      obsObj.fechaInicioPreparacion = ahora.toISOString();
      obsObj.horaInicioPreparacion = horaActual;
      obsObj.tiemposEstados.enPreparacion = {
        estado: 'En Preparación',
        hora: horaActual,
        horaExacta: horaActualConSegundos,
        fecha: ahora.toISOString()
      };
    } else if (estadoCocinaInterno === 'LISTO') {
      obsObj.fechaListo = ahora.toISOString();
      obsObj.horaListo = horaActual;
      obsObj.tiemposEstados.listo = {
        estado: 'Listo',
        hora: horaActual,
        horaExacta: horaActualConSegundos,
        fecha: ahora.toISOString()
      };
      if (obsObj.modoTiempoEntrega !== 'MANUAL') {
        const esDom = String(obsObj.tipoEntrega || v.tipoVenta || '').toLowerCase().includes('domicilio');
        const autoListo = esDom ? '15-20 min' : 'Listo para entrega';
        obsObj.tiempoEstimadoEntrega = autoListo;
        v.tiempoEstimadoEntrega = autoListo;
      }
    } else if (estadoCocinaInterno === 'DESPACHADO') {
      obsObj.fechaDespachado = ahora.toISOString();
      obsObj.horaDespachado = horaActual;
      obsObj.tiemposEstados.despachado = {
        estado: 'Despachado',
        hora: horaActual,
        horaExacta: horaActualConSegundos,
        fecha: ahora.toISOString()
      };
      if (obsObj.modoTiempoEntrega !== 'MANUAL') {
        const esDom = String(obsObj.tipoEntrega || v.tipoVenta || '').toLowerCase().includes('domicilio');
        const autoDesp = esDom ? 'En camino' : 'Listo para entrega';
        obsObj.tiempoEstimadoEntrega = autoDesp;
        v.tiempoEstimadoEntrega = autoDesp;
      }
    } else if (estadoCocinaInterno === 'ENTREGADO') {
      obsObj.fechaEntrega = ahora.toISOString();
      obsObj.horaEntrega = horaActual;
      obsObj.tiemposEstados.entregado = {
        estado: 'Entregado',
        hora: horaActual,
        horaExacta: horaActualConSegundos,
        fecha: ahora.toISOString()
      };
      obsObj.tiempoEstimadoEntrega = 'Entregado';
      obsObj.modoTiempoEntrega = 'AUTO';
      v.tiempoEstimadoEntrega = 'Entregado';
    }

    // Guardar nombre del cocinero / responsable de cocina en turno (Requisito 9)
    if (extraData?.cocinero || extraData?.responsable || extraData?.usuarioNombre) {
      obsObj.cocinero = extraData.cocinero || extraData.responsable || extraData.usuarioNombre;
      obsObj.responsableCocina = obsObj.cocinero;
    }

    // Persist kitchen preparation verification checklist if provided
    if (Array.isArray(extraData?.checklistPreparacion) && extraData.checklistPreparacion.length > 0) {
      const normalizedChecklist = extraData.checklistPreparacion.map((item, idx) => {
        const cantSolicitada = Number(item.cantidad ?? item.cantidadSolicitada ?? 1);
        const completado = Boolean(item.completado);
        const cantPreparada = item.cantidadPreparada !== undefined
          ? Number(item.cantidadPreparada)
          : (completado ? cantSolicitada : 0);
        return {
          id: item.id,
          index: idx,
          idProducto: item.idProducto || null,
          idVariante: item.idVariante || null,
          nombre: item.nombre || `Producto #${idx + 1}`,
          cantidad: cantSolicitada,
          cantidadPreparada: cantPreparada,
          completado,
          estadoChecklist: completado && cantPreparada >= cantSolicitada
            ? 'COMPLETO'
            : cantPreparada > 0
            ? 'PARCIAL'
            : 'NO_PREPARADO',
          motivo: item.motivo || item.motivoNoPreparado || ''
        };
      });

      const isFullOrder = extraData.pedidoCompleto !== undefined
        ? Boolean(extraData.pedidoCompleto)
        : normalizedChecklist.every(it => it.completado && it.cantidadPreparada >= it.cantidad);

      obsObj.checklistPreparacion = normalizedChecklist;
      obsObj.pedidoCompleto = isFullOrder;
      obsObj.observacionCocina = extraData.observacionCocina !== undefined
        ? String(extraData.observacionCocina || '').trim()
        : (obsObj.observacionCocina || '');
      obsObj.fechaVerificacionCocina = ahora.toISOString();
      obsObj.horaVerificacionCocina = horaActual;

      if (Array.isArray(obsObj.productos)) {
        obsObj.productos = obsObj.productos.map((op, idx) => {
          const match = normalizedChecklist.find(
            c => (c.id !== undefined && c.id === op.id) ||
                 (c.index === idx) ||
                 (c.nombre && op.nombre && c.nombre.toLowerCase().trim() === op.nombre.toLowerCase().trim())
          ) || normalizedChecklist[idx];
          if (match) {
            return {
              ...op,
              completado: match.completado,
              cantidadPreparada: match.cantidadPreparada,
              estadoChecklist: match.estadoChecklist,
              motivoNoPreparado: match.motivo
            };
          }
          return op;
        });
      }
    }

    if (!Array.isArray(obsObj.historialEstados)) obsObj.historialEstados = [];
    obsObj.historialEstados.push({
      estado: estadoCocinaInterno === 'DESPACHADO' ? 'DESPACHADO' : estadoEnum,
      etiqueta: nuevoEstado,
      hora: horaActual,
      horaExacta: horaActualConSegundos,
      fecha: ahora.toISOString(),
      ...(obsObj.pedidoCompleto !== undefined ? { pedidoCompleto: obsObj.pedidoCompleto } : {})
    });
    v.observaciones = JSON.stringify(obsObj);

    await v.save();

    return {
      id: v.idVenta,
      idVenta: v.idVenta,
      estado: nuevoEstado,
      estadoEntrega: estadoEnum,
      estadoCocina: estadoCocinaInterno,
      estadoAprobacion: newAprobacion,
      horaEstado: horaActual,
      horaExactaEstado: horaActualConSegundos,
      fechaCambioEstado: obsObj.fechaCambioEstado,
      tiemposEstados: obsObj.tiemposEstados,
      historialEstados: obsObj.historialEstados,
      checklistPreparacion: obsObj.checklistPreparacion || null,
      pedidoCompleto: obsObj.pedidoCompleto !== undefined ? obsObj.pedidoCompleto : null,
      observacionCocina: obsObj.observacionCocina || "",
      message: `Estado de la orden #${v.idVenta} actualizado a "${nuevoEstado}" con éxito`
    };
  }

  static async delete(id) {
    const error = new Error('Las órdenes de producción asociadas a ventas no pueden eliminarse físicamente; gestione su anulación desde Ventas.');
    error.statusCode = 400;
    throw error;
  }
}

module.exports = ProduccionService;
