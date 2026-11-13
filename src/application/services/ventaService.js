const { Venta, DetalleVentaProducto, Cliente, User, Role } = require('../../persistence/models');

function convertUnits(amount, fromUnit, toUnit) {
  if (!amount || isNaN(amount)) return 0;
  if (!fromUnit || !toUnit) return Number(amount);

  const from = String(fromUnit).toLowerCase().trim();
  const to = String(toUnit).toLowerCase().trim();

  if (from === to) return Number(amount);

  const isKg = (u) => u.includes('kg') || u.includes('kilo');
  const isGr = (u) => u.includes('gr') || u.includes('gram');
  const isMg = (u) => u.includes('mg') || u.includes('miligram');
  const isLt = (u) => u.includes('lt') || u.includes('litro');
  const isMl = (u) => u.includes('ml') || u.includes('mililitro') || u.includes('cc');

  if (isKg(from) && isGr(to)) return Number(amount) * 1000;
  if (isGr(from) && isKg(to)) return Number(amount) / 1000;
  if (isKg(from) && isMg(to)) return Number(amount) * 1000000;
  if (isMg(from) && isKg(to)) return Number(amount) / 1000000;
  if (isGr(from) && isMg(to)) return Number(amount) * 1000;
  if (isMg(from) && isGr(to)) return Number(amount) / 1000;

  if (isLt(from) && isMl(to)) return Number(amount) * 1000;
  if (isMl(from) && isLt(to)) return Number(amount) / 1000;

  return Number(amount);
}

function normalizeTextForMatch(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractRemovedIngredients(detailItem, obsProdItem) {
  const removedNames = new Set();
  const removedIds = new Set();

  const collectFromList = (list) => {
    if (!Array.isArray(list)) return;
    for (const entry of list) {
      if (entry === null || entry === undefined) continue;
      if (typeof entry === 'number' || (typeof entry === 'string' && /^\d+$/.test(entry.trim()))) {
        removedIds.add(Number(entry));
      } else if (typeof entry === 'string') {
        const cleaned = normalizeTextForMatch(entry.replace(/^sin\s+/i, ''));
        if (cleaned) removedNames.add(cleaned);
      } else if (typeof entry === 'object') {
        const idCandidate = entry.idInsumo ?? entry.insumoId ?? entry.id;
        if (idCandidate !== undefined && idCandidate !== null && /^\d+$/.test(String(idCandidate))) {
          removedIds.add(Number(idCandidate));
        }
        const nameCandidate = entry.nombre || entry.name || entry.insumoNombre;
        if (nameCandidate) {
          const cleaned = normalizeTextForMatch(String(nameCandidate).replace(/^sin\s+/i, ''));
          if (cleaned) removedNames.add(cleaned);
        }
      }
    }
  };

  const collectFromPersonalizaciones = (persObj) => {
    if (!persObj || typeof persObj !== 'object' || Array.isArray(persObj)) return;
    for (const [k, val] of Object.entries(persObj)) {
      if (val === false || val === 0 || val === 'false') {
        if (/^\d+$/.test(String(k).trim())) {
          removedIds.add(Number(k));
        } else {
          const cleaned = normalizeTextForMatch(String(k).replace(/^sin\s+/i, ''));
          if (cleaned) removedNames.add(cleaned);
        }
      }
    }
  };

  const parseSinTokensFromText = (rawText) => {
    if (!rawText || typeof rawText !== 'string') return;
    let textToParse = rawText;
    if (rawText.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(rawText);
        collectFromList(parsed.ingredientesRemovidos || parsed.removedIngredients || parsed.sinIngredientes);
        collectFromPersonalizaciones(parsed.personalizaciones);
        textToParse = [parsed.observaciones, parsed.observacion, parsed.nota, parsed.especificaciones]
          .filter(Boolean)
          .join(' | ');
      } catch (e) {
        // continuar con texto plano
      }
    }

    const segments = textToParse.split(/[,•|;\n]+/);
    for (const seg of segments) {
      const matches = seg.matchAll(/\bsin\s+([^,•|;\n()]+)/gi);
      for (const m of matches) {
        const candidate = normalizeTextForMatch(m[1]);
        if (!candidate || candidate === 'azucar' || candidate.startsWith('azucar ')) continue;
        removedNames.add(candidate);
      }
    }
  };

  for (const src of [detailItem, obsProdItem]) {
    if (!src || typeof src !== 'object') continue;
    collectFromList(src.ingredientesRemovidos || src.removedIngredients || src.sinIngredientes);
    collectFromPersonalizaciones(src.personalizaciones);
    parseSinTokensFromText(src.observaciones);
    parseSinTokensFromText(src.observacion);
    parseSinTokensFromText(src.nota);
    parseSinTokensFromText(src.especificaciones);
  }

  return { removedNames: Array.from(removedNames), removedIds };
}

function isInsumoRemovedByMiseEnPlace(insumo, detailItem, obsProdItem) {
  if (!insumo) return false;
  const { removedNames, removedIds } = extractRemovedIngredients(detailItem, obsProdItem);

  const insumoId = Number(insumo.idInsumo || insumo.id);
  if (insumoId && removedIds.has(insumoId)) {
    return true;
  }

  const normInsumoName = normalizeTextForMatch(insumo.nombre);
  if (!normInsumoName || removedNames.length === 0) return false;

  for (const rem of removedNames) {
    if (!rem) continue;
    if (normInsumoName === rem) return true;
    if (rem.length >= 3 && (normInsumoName.includes(rem) || rem.includes(normInsumoName))) {
      return true;
    }
  }

  return false;
}

function extractCleanSpecifications(raw) {
  if (!raw) return '';
  if (typeof raw === 'object') {
    if (raw.especificaciones !== undefined && raw.especificaciones !== raw) {
      const res = extractCleanSpecifications(raw.especificaciones);
      if (res) return res;
    }
    if (raw.nota !== undefined && raw.nota !== raw) {
      const res = extractCleanSpecifications(raw.nota);
      if (res) return res;
    }
    if (raw.observacion !== undefined && raw.observacion !== raw) {
      const res = extractCleanSpecifications(raw.observacion);
      if (res) return res;
    }
    if (raw.instrucciones !== undefined && raw.instrucciones !== raw) {
      const res = extractCleanSpecifications(raw.instrucciones);
      if (res) return res;
    }
    return '';
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
      trimmed.includes('"tipoEntrega"') ||
      trimmed.includes('"especificaciones"') ||
      trimmed.includes('"codigoPedido"')
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        return extractCleanSpecifications(parsed);
      } catch (e) {
        return '';
      }
    }
    const lower = trimmed.toLowerCase();
    if (['sin observaciones', 'ninguna', 'ninguno', 'n/a', 'null', 'undefined', ''].includes(lower)) {
      return '';
    }
    return trimmed;
  }
  return '';
}

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
      // Si es plato cocinado pero tenía 1 min, inferir cocción real
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
    const rawRecetaMin = p.receta?.tiempoPreparacionMin || parseInt(String(p.receta?.tiempoPreparacion || p.tiempoPreparacion || ''), 10);
    const min = inferProductPrepMinutes(p.nombre || p.nombreProducto || p.observaciones, rawRecetaMin);
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
    const extraBatchMin = Math.min(10, Math.max(0, totalCookedUnits - 1) * 2);
    const totalMin = maxCookedMin + extraBatchMin;
    return { totalMin, formatted: `${totalMin} min` };
  }
  const maxDrinkMin = Math.max(1, ...withMinutes.map((p) => p.tiempoPreparacionMin || 1));
  return { totalMin: maxDrinkMin, formatted: `${maxDrinkMin} min` };
}

function computeHybridDeliveryEstimate({ productos = [], tipoEntrega = '', estadoEntrega = 'PENDIENTE', savedTiempo = '', savedModo = '' }) {
  const prep = calculateOrderPrepTime(productos);
  const esDomicilio = String(tipoEntrega || '').toLowerCase().includes('domicilio');
  const est = String(estadoEntrega || 'PENDIENTE').toUpperCase();

  let autoEstimate;
  if (est === 'ENTREGADO' || est === 'COMPLETADA') {
    autoEstimate = 'Entregado';
  } else if (est === 'DESPACHADO') {
    autoEstimate = esDomicilio ? 'En camino' : 'Listo para entrega';
  } else if (est === 'LISTO') {
    autoEstimate = esDomicilio ? '15-20 min' : 'Listo para entrega';
  } else if (esDomicilio) {
    autoEstimate = `${prep.totalMin + 15}-${prep.totalMin + 25} min`;
  } else if (prep.totalMin <= 2) {
    autoEstimate = '2-5 min';
  } else {
    autoEstimate = `${prep.totalMin + 3}-${prep.totalMin + 8} min`;
  }

  if (est === 'ENTREGADO' || est === 'COMPLETADA') {
    return { effectiveEstimate: 'Entregado', autoEstimate, modo: 'AUTO' };
  }

  const cleanSaved = String(savedTiempo || '').trim();
  const normSaved = cleanSaved.toLowerCase().replace(/\s+/g, '');
  const isAutoLiteral =
    normSaved === 'auto' ||
    normSaved === 'automatico' ||
    normSaved === 'automático';
  const isGenericDefault =
    !cleanSaved ||
    isAutoLiteral ||
    normSaved === '15-20min' ||
    normSaved === '30-45min' ||
    normSaved === '35-45min';

  const modoUpper = isAutoLiteral ? 'AUTO' : String(savedModo || '').toUpperCase();
  const isManual = modoUpper === 'MANUAL' || (!modoUpper && !isGenericDefault);

  if (isManual && cleanSaved && !isAutoLiteral) {
    return { effectiveEstimate: cleanSaved, autoEstimate, modo: 'MANUAL' };
  }

  return { effectiveEstimate: autoEstimate, autoEstimate, modo: 'AUTO' };
}

class VentaService {
  static formatVenta(v) {
    let obsData = {};
    if (v.observaciones) {
      try {
        obsData = typeof v.observaciones === 'string' && v.observaciones.startsWith('{')
          ? JSON.parse(v.observaciones)
          : { nota: v.observaciones };
      } catch (e) {
        obsData = { nota: v.observaciones };
      }
    }

    const clienteObj = v.cliente || {};
    const clienteUser = clienteObj.usuario || clienteObj.clienteInfo || v.usuario || {};
    
    // Dynamically derive client name from DB relationships without hardcoded strings
    const clienteNombre = obsData.clienteNombre || 
      (clienteUser.nombre ? `${clienteUser.nombre} ${clienteUser.apellidos || ''}`.trim() : null) ||
      (v.idCliente ? `Cliente #${v.idCliente}` : "Cliente General");

    const numeroVenta = obsData.codigoPedido || obsData.numeroVenta || `VEN-${String(v.idVenta).padStart(4, '0')}`;
    
    // Dynamic format of date/time in local Colombia timezone (Formato 12 horas con AM/PM)
    let horario = null;
    let fechaFormatted = null;
    if (v.fechaVenta) {
      const d = new Date(v.fechaVenta);
      if (!isNaN(d.getTime())) {
        horario = formatColombiaTime(d);
        fechaFormatted = d.toLocaleDateString('es-CO', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' });
      }
    }
    if (!horario && obsData.horario) {
      horario = obsData.horario;
    }
    horario = horario || "12:30 PM";

    // Ítem #11: "Empaque para llevar" es una opción de empaque, NO un tipo de entrega.
    // Solo se clasifica como "Recoger" si el tipo de entrega explícito lo indica.
    const rawObsLower = (v.observaciones || "").toLowerCase();
    const tipoEntrega = obsData.tipoEntrega || (
      String(v.tipoVenta || '').toUpperCase() === 'DOMICILIO'
        ? "Domicilio"
        : (rawObsLower.includes("recoger") ? "Recoger" : (String(v.tipoVenta || '').toUpperCase() === 'PUNTO_DE_VENTA' ? "Recoger" : "Domicilio"))
    );
    const rawEspecText = typeof obsData.especificaciones === 'string'
      ? obsData.especificaciones
      : JSON.stringify(obsData.especificaciones || '');
    const empaqueParaLlevar = Boolean(
      obsData.empaqueParaLlevar ||
      (obsData.especificaciones && typeof obsData.especificaciones === 'object' && obsData.especificaciones.empaqueParaLlevar) ||
      /empaque para llevar/i.test(rawEspecText || '')
    );
    const metodoPago = obsData.metodoPago || (
      (v.observaciones || "").toLowerCase().includes("tarjeta")
        ? "Tarjeta"
        : (v.observaciones || "").toLowerCase().includes("transfer") || (v.observaciones || "").toLowerCase().includes("nequi") || (v.observaciones || "").toLowerCase().includes("davi")
          ? "Transferencia"
          : "Efectivo"
    );
    const estadoPago = obsData.estadoPago || "Pagado";

    // Dynamic products from db details or order metadata
    let productos = [];
    if (Array.isArray(obsData.productos) && obsData.productos.length > 0) {
      productos = obsData.productos.map((p, pIdx) => {
        const itemAdds = (p.adiciones || []).map(a => {
          if (typeof a === 'object' && a !== null) {
            return {
              idAdicion: a.idAdicion || a.id,
              nombre: a.nombre,
              precio: Number(a.precio || 0),
              cantidad: Number(a.cantidad || 1)
            };
          }
          return {
            nombre: String(a),
            precio: 0,
            cantidad: 1
          };
        });

        const addsSum = itemAdds.reduce((s, a) => s + (Number(a.precio || 0) * Number(a.cantidad || 1)), 0);
        const pQty = Number(p.cantidad || 1);
        const pUnit = Number(p.precioUnitario || p.precio || 0);
        const pTot = Number(p.total || 0) > 0 ? Number(p.total) : (pUnit + addsSum) * pQty;

        // Buscar detalle relacional en BD para resolver el nombre real del producto del catálogo
        const matchingDetail = (v.detalles || []).find(d => 
          Number(d.idVariante) === Number(p.idVariante || p.id)
        ) || (v.detalles || [])[pIdx];

        const rawMatchingProd = matchingDetail?.variante?.producto?.nombre || null;
        const rawMatchingVar = matchingDetail?.variante?.nombre || null;
        const realProductoNombre =
          rawMatchingProd && !rawMatchingProd.startsWith('__SISTEMA') ? rawMatchingProd : null;
        const realVarianteNombre =
          rawMatchingVar && !rawMatchingVar.startsWith('__SISTEMA') ? rawMatchingVar : null;

        const finalNombre = realProductoNombre || p.nombreProducto || p.nombre || "Producto";

        return {
          id: p.id || p.idVariante || p.idDetalleVenta,
          idVariante: p.idVariante || p.id,
          nombre: finalNombre,
          nombreProducto: realProductoNombre || p.nombreProducto || finalNombre,
          nombreVariante: realVarianteNombre || (p.nombre !== finalNombre ? p.nombre : null),
          cantidad: pQty,
          precioUnitario: pUnit,
          total: pTot,
          observaciones: p.observaciones || p.observacion || p.especificaciones || p.nota || "",
          ingredientesRemovidos: Array.isArray(p.ingredientesRemovidos) ? p.ingredientesRemovidos : [],
          personalizaciones: (p.personalizaciones && typeof p.personalizaciones === 'object') ? p.personalizaciones : undefined,
          adiciones: itemAdds
        };
      });
    } else if (v.detalles && v.detalles.length > 0) {
      productos = v.detalles.map(d => {
        const rawJoinedProd = d.variante?.producto?.nombre;
        const rawJoinedVar = d.variante?.nombre;
        const cleanJoinedProd = rawJoinedProd && !rawJoinedProd.startsWith('__SISTEMA') ? rawJoinedProd : null;
        const cleanJoinedVar = rawJoinedVar && !rawJoinedVar.startsWith('__SISTEMA') ? rawJoinedVar : null;
        let pName = cleanJoinedProd || cleanJoinedVar || null;
        let pAdiciones = [];
        let pObs = "";

        if (d.adiciones && d.adiciones.length > 0) {
          pAdiciones = d.adiciones.map(da => ({
            idAdicion: da.idAdicion,
            nombre: da.adicion?.nombre || `Adición #${da.idAdicion}`,
            precio: parseFloat(da.precio !== undefined && da.precio !== null ? da.precio : (da.precioUnitario || da.adicion?.precioAdicion || da.adicion?.precio || 0)),
            cantidad: Number(da.cantidad || 1)
          }));
        }

        if (d.observaciones) {
          try {
            if (typeof d.observaciones === 'string' && d.observaciones.startsWith('{')) {
              const parsedObs = JSON.parse(d.observaciones);
              pName = pName || parsedObs.nombre || parsedObs.nombreProducto;
              pObs = parsedObs.observaciones || parsedObs.observacion || parsedObs.nota || "";
              if (pAdiciones.length === 0 && Array.isArray(parsedObs.adiciones)) {
                pAdiciones = parsedObs.adiciones.map(a => typeof a === 'object' ? a : { nombre: String(a), precio: 0, cantidad: 1 });
              }
            } else {
              pName = pName || d.observaciones;
              pObs = d.observaciones;
            }
          } catch (e) {
            pName = pName || d.observaciones;
            pObs = d.observaciones;
          }
        }

        const addsSum = pAdiciones.reduce((s, a) => s + (Number(a.precio || 0) * Number(a.cantidad || 1)), 0);
        const pQty = Number(d.cantidad || 1);
        const pUnit = parseFloat(d.precioUnitario || 0);
        const pTot = parseFloat(d.subtotal || 0) > 0 ? parseFloat(d.subtotal) : (pUnit + addsSum) * pQty;

        const realProdName = cleanJoinedProd || pName || `Producto #${d.idVariante}`;
        const realVarName = cleanJoinedVar || null;

        return {
          id: d.idDetalleVenta || d.idVariante,
          idVariante: d.idVariante,
          nombre: realProdName,
          nombreProducto: realProdName,
          nombreVariante: realVarName,
          cantidad: pQty,
          precioUnitario: pUnit,
          total: pTot,
          observaciones: pObs,
          adiciones: pAdiciones
        };
      });
    } else {
      // Sin detalles reales en BD: devolver array vacío (no inventar productos ficticios)
      productos = [];
    }

    let subtotal = parseFloat(v.subtotal) || 0;
    let total = parseFloat(v.total) || 0;
    let descuentoAplicado = parseFloat(v.descuentoAplicado || 0);

    // Si total o subtotal está en 0 en base de datos, calcular de productos o detalles
    if ((total === 0 || subtotal === 0) && Array.isArray(productos) && productos.length > 0) {
      subtotal = productos.reduce((acc, p) => acc + Number(p.total || 0), 0);
      descuentoAplicado = descuentoAplicado || (subtotal * (Number(obsData.descuentoPorcentaje || 0) / 100));
      total = Math.max(0, subtotal - descuentoAplicado);
    }

    const isMostradorSale = (!clienteObj.idUsuario && !clienteObj.usuario) ||
      (clienteNombre && String(clienteNombre).toLowerCase().includes('mostrador')) ||
      (clienteObj && clienteObj.direccion && String(clienteObj.direccion).toLowerCase().includes('mostrador')) ||
      (!clienteObj.idUsuario);

    // Dynamic extraction of client fidelity
    let clientMeta = {};
    if (clienteObj && clienteObj.direccion) {
      try {
        if (clienteObj.direccion.trim().startsWith('{')) {
          clientMeta = JSON.parse(clienteObj.direccion);
        }
      } catch (e) {
        clientMeta = {};
      }
    }
    const FidelidadService = require('./fidelidadService');
    const fidelidadInfo = isMostradorSale ? {
      tipo: null,
      descuentoPorcentaje: 0,
      comprasCiclo: 0,
      enGracia: false,
      tieneCuenta: false
    } : FidelidadService.evaluarEstadoFidelidad(clientMeta.fidelidad || {
      tipo: clientMeta.tipo || (clienteObj.idUsuario ? 'Nuevo' : 'Mostrador'),
      comprasCiclo: clientMeta.ciclo !== undefined ? Number(clientMeta.ciclo) : (clientMeta.comprasCiclo || 0),
      comprasTotales: clientMeta.comprasTotales || 0,
      fechaInicioNivel: clientMeta.inicio || clientMeta.fechaInicioNivel || null,
      fechaVencimientoNivel: clientMeta.vence || clientMeta.fechaVencimientoNivel || null
    });

    // Calculate clear discount percentage
    let descuentoPorcentaje = obsData.descuentoPorcentaje || (isMostradorSale ? 0 : fidelidadInfo.descuentoPorcentaje) || 0;
    if (descuentoAplicado > 0 && subtotal > 0) {
      descuentoPorcentaje = Math.round((descuentoAplicado / subtotal) * 100);
    } else if (subtotal > total && subtotal > 0) {
      descuentoAplicado = subtotal - total;
      descuentoPorcentaje = Math.round((descuentoAplicado / subtotal) * 100);
    }

    const iva = Math.round(subtotal * 0.19);
    const precioOriginal = subtotal > total ? subtotal : (total + descuentoAplicado);
    const montoDescuento = descuentoAplicado;

    let estadoStr = 'Pendiente';
    if (v.estadoEntrega === 'PREPARANDO') estadoStr = 'En Preparación';
    else if (v.estadoEntrega === 'LISTO') estadoStr = 'Listo';
    else if (v.estadoEntrega === 'ENTREGADO') estadoStr = 'Completada';
    else if (v.estadoEntrega === 'CANCELADO') estadoStr = 'Anulada';
    else if (v.estadoEntrega) estadoStr = v.estadoEntrega;

    const responsable = v.usuario ? {
      idUsuario: v.usuario.idUsuario,
      nombre: `${v.usuario.nombre} ${v.usuario.apellidos || ''}`.trim(),
      email: v.usuario.email,
      rol: v.usuario.rolInfo?.nombre || (v.usuario.idRol === 1 ? 'Administrador' : v.usuario.idRol === 2 ? 'Vendedor' : 'Empleado'),
      tieneCuenta: true,
      estado: v.usuario.estado || 'Activo'
    } : {
      idUsuario: null,
      nombre: 'Sistema / Online',
      rol: 'Online',
      tieneCuenta: false,
      estado: 'Activo'
    };

    const ultimoCambio = Array.isArray(obsData.historialEstados) && obsData.historialEstados.length > 0
      ? obsData.historialEstados[obsData.historialEstados.length - 1]
      : null;

    const fechaCambioEstado = obsData.fechaCambioEstado || ultimoCambio?.fecha || v.fechaVenta || null;
    const horaEstado = formatColombiaTime(obsData.fechaCambioEstado || ultimoCambio?.fecha) || obsData.horaEstado || ultimoCambio?.hora || horario || "12:30 PM";

    const origenColumna = String(v.origen || '').toUpperCase();
    const isOnline = origenColumna ? origenColumna === 'ONLINE' : (
      String(v.tipoVenta || '').toUpperCase() === 'ONLINE' ||
      String(v.tipoVenta || '').toUpperCase() === 'DOMICILIO' ||
      String(obsData.origen || '').toUpperCase() === 'ONLINE' ||
      String(obsData.tipoVenta || '').toUpperCase() === 'ONLINE' ||
      (responsable && responsable.rol === 'Online') ||
      (!v.idUsuario && v.idCliente) ||
      (tipoEntrega === 'Domicilio' && (!v.usuario || v.usuario.idRol === 4))
    );

    const origen = isOnline ? 'ONLINE' : 'PUNTO_FISICO';
    const origenNombre = isOnline ? 'Venta Online' : 'Punto Físico';

    const hybridEst = computeHybridDeliveryEstimate({
      productos,
      tipoEntrega,
      estadoEntrega: v.estadoEntrega,
      savedTiempo: v.tiempoEstimadoEntrega || obsData.tiempoEstimadoEntrega || obsData.tiempoEstimado,
      savedModo: obsData.modoTiempoEntrega
    });
    const tiempoEstimadoEntrega = hybridEst.effectiveEstimate;

    return {
      id: v.idVenta,
      idVenta: v.idVenta,
      idDescuento: v.idDescuento || null,
      tipoVenta: v.tipoVenta || (tipoEntrega === 'Domicilio' ? 'DOMICILIO' : 'PUNTO_DE_VENTA'),
      numeroVenta,
      codigoPedido: numeroVenta,
      codigo: numeroVenta,
      numeroOrden: numeroVenta,
      clienteNombre,
      cliente: clienteNombre,
      idCliente: v.idCliente,
      idUsuario: v.idUsuario,
      responsable,
      clienteFidelidad: {
        tipo: isMostradorSale ? null : fidelidadInfo.tipo,
        descuentoPorcentaje: isMostradorSale ? 0 : (fidelidadInfo.descuentoPorcentaje || 0),
        comprasCiclo: isMostradorSale ? 0 : (fidelidadInfo.comprasCiclo || 0),
        enGracia: isMostradorSale ? false : !!fidelidadInfo.enGracia,
        tieneCuenta: !isMostradorSale && !!clienteObj.idUsuario
      },
      fecha: v.fechaVenta,
      fechaVenta: v.fechaVenta,
      fechaFormatted,
      horario,
      horaEstado,
      horaCambioEstado: horaEstado,
      fechaCambioEstado,
      tiemposEstados: obsData.tiemposEstados || null,
      historialEstados: obsData.historialEstados || [],
      origen,
      origenNombre,
      tiempoEstimadoEntrega,
      modoTiempoEntrega: hybridEst.modo,
      tiempoAutomaticoSugerido: hybridEst.autoEstimate,
      empaqueParaLlevar,
      tipoEntrega,
      metodoPago,
      metodoPagoNombre: String(metodoPago).toLowerCase() === 'wompi' ? 'Wompi (Pago en Línea)' : metodoPago,
      estadoPago,
      estadoAprobacion: v.estadoAprobacion || obsData.estadoAprobacion || 'PENDIENTE',
      estadoEntrega: v.estadoEntrega,
      estado: estadoStr,
      subtotal,
      iva,
      precioOriginal,
      descuentoPorcentaje,
      montoDescuento,
      descuentoAplicado,
      total,
      direccion: obsData.direccion || null,
      especificaciones: extractCleanSpecifications(obsData.especificaciones || obsData.nota || ""),
      observaciones: v.observaciones,
      checklistPreparacion: Array.isArray(obsData.checklistPreparacion) ? obsData.checklistPreparacion : null,
      pedidoCompleto: obsData.pedidoCompleto !== undefined ? Boolean(obsData.pedidoCompleto) : null,
      observacionCocina: obsData.observacionCocina || "",
      horaVerificacionCocina: obsData.horaVerificacionCocina || null,
      productos,
      detalles: (v.detalles || []).map(d => {
        const plain = typeof d?.toJSON === 'function' ? d.toJSON() : { ...d };
        const varName = String(plain?.variante?.nombre || '');
        const prodName = String(plain?.variante?.producto?.nombre || '');
        if (Number(plain?.idVariante) === 0 || varName.startsWith('__SISTEMA') || prodName.startsWith('__SISTEMA')) {
          plain.variante = null;
        }
        return plain;
      })
    };
  }

  static async getAll(filter = {}) {
    const filterObj = typeof filter === 'string' ? { periodo: filter } : (filter || {});
    const { periodo, estado, search } = filterObj;
    const { Op } = require('sequelize');
    const where = {};

    const normalizedPeriod = String(periodo || '').toLowerCase().trim();
    if (normalizedPeriod && !['todos', 'personalizado', 'all', ''].includes(normalizedPeriod)) {
      const now = new Date();
      if (normalizedPeriod === 'hoy') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        where.fechaVenta = { [Op.gte]: startOfDay };
      } else if (normalizedPeriod === '7dias' || normalizedPeriod === '7_dias' || normalizedPeriod === 'semana') {
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        where.fechaVenta = { [Op.gte]: sevenDaysAgo };
      } else if (normalizedPeriod === 'mes' || normalizedPeriod === 'este_mes' || normalizedPeriod === 'mes actual' || normalizedPeriod === 'mes_actual') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        where.fechaVenta = { [Op.gte]: startOfMonth };
      } else if (normalizedPeriod === 'mes_anterior' || normalizedPeriod === 'mes anterior') {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        where.fechaVenta = { [Op.between]: [startOfLastMonth, endOfLastMonth] };
      } else if (normalizedPeriod === '3_meses' || normalizedPeriod === 'ultimos_3_meses' || normalizedPeriod === 'últimos 3 meses' || normalizedPeriod === 'ultimos 3 meses') {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1, 0, 0, 0);
        where.fechaVenta = { [Op.gte]: threeMonthsAgo };
      } else if (normalizedPeriod === '6_meses' || normalizedPeriod === 'ultimos_6_meses' || normalizedPeriod === 'últimos 6 meses' || normalizedPeriod === 'ultimos 6 meses') {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1, 0, 0, 0);
        where.fechaVenta = { [Op.gte]: sixMonthsAgo };
      } else if (normalizedPeriod === 'ano' || normalizedPeriod === 'este_ano' || normalizedPeriod === 'año' || normalizedPeriod === 'año actual' || normalizedPeriod === 'ano actual') {
        const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
        where.fechaVenta = { [Op.gte]: startOfYear };
      }
    } else if (filterObj.fechaInicio || filterObj.fechaFin) {
      const fechaFilter = {};
      if (filterObj.fechaInicio) fechaFilter[Op.gte] = new Date(filterObj.fechaInicio);
      if (filterObj.fechaFin) {
        const endD = new Date(filterObj.fechaFin);
        endD.setHours(23, 59, 59, 999);
        fechaFilter[Op.lte] = endD;
      }
      where.fechaVenta = fechaFilter;
    }

    if (estado && estado !== 'Todos') {
      if (estado === 'Pendiente') {
        where.estadoEntrega = { [Op.in]: ['PENDIENTE', 'Pendiente'] };
      } else if (estado === 'En Preparación') {
        where.estadoEntrega = { [Op.in]: ['PREPARANDO', 'En Preparación'] };
      } else if (estado === 'Completada') {
        where.estadoEntrega = { [Op.in]: ['ENTREGADO', 'LISTO', 'Completada'] };
      } else if (estado === 'Anulada') {
        where.estadoEntrega = { [Op.in]: ['CANCELADO', 'Anulada'] };
      }
    }

    const { Variante, Product, FichaTecnica, DetalleFichaInsumo, Insumo, DetalleVentaAdicion, Adicion } = require('../../persistence/models');
    const ventas = await Venta.findAll({
      where,
      include: [
        { 
          model: Cliente, 
          as: 'cliente',
          include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] }]
        },
        { 
          model: User, 
          as: 'usuario', 
          attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'estado', 'idRol'],
          include: [{ model: Role, as: 'rolInfo', attributes: ['idRol', 'nombre'] }]
        },
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

    return ventas.map(v => this.formatVenta(v));
  }

  static async getStats(filter = {}) {
    const filterObj = typeof filter === 'string' ? { periodo: filter } : (filter || {});
    const list = await this.getAll(filterObj);
    const totalVentasSum = list.reduce((acc, v) => acc + Number(v.total || 0), 0);
    const pedidosCount = list.length;
    const ticketPromedioVal = pedidosCount > 0 ? Math.round(totalVentasSum / pedidosCount) : 0;
    const descOtorgadosSum = list.reduce((acc, v) => acc + Number(v.montoDescuento || v.descuentoAplicado || 0), 0);
    const uniqueClientsCount = new Set(list.map(v => v.idCliente || v.clienteNombre || v.cliente).filter(Boolean)).size || 1;
    const frecuenciaVal = pedidosCount > 0 ? parseFloat((pedidosCount / uniqueClientsCount).toFixed(1)) : 0.0;
    const tasaDescuentoVal = (totalVentasSum + descOtorgadosSum) > 0
      ? parseFloat(((descOtorgadosSum / (totalVentasSum + descOtorgadosSum)) * 100).toFixed(1))
      : 0.0;

    return {
      totalVentas: totalVentasSum,
      totalVentasFormatted: `$${totalVentasSum.toLocaleString('es-CO')}`,
      pedidosCount,
      ticketPromedio: ticketPromedioVal,
      ticketPromedioFormatted: `$${ticketPromedioVal.toLocaleString('es-CO')}`,
      totalDescuentos: descOtorgadosSum,
      totalDescuentosFormatted: `$${descOtorgadosSum.toLocaleString('es-CO')}`,
      frecuenciaCompra: frecuenciaVal,
      tasaDescuento: tasaDescuentoVal,
      uniqueClientsCount
    };
  }

  static async getById(id) {
    const { Variante, Product, FichaTecnica, DetalleFichaInsumo, Insumo, DetalleVentaAdicion, Adicion } = require('../../persistence/models');
    const v = await Venta.findByPk(id, {
      include: [
        { 
          model: Cliente, 
          as: 'cliente',
          include: [{ model: User, as: 'usuario', attributes: ['idUsuario', 'nombre', 'apellidos'] }]
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
      ]
    });
    if (!v) {
      const error = new Error('Venta no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return this.formatVenta(v);
  }

  static async getOrCreateClienteMostrador() {
    const { Op } = require('sequelize');
    let mostrador = await Cliente.findOne({
      where: {
        idUsuario: null,
        estado: 1,
        [Op.or]: [
          { direccion: { [Op.like]: '%"esMostrador":true%' } },
          { direccion: { [Op.like]: '%"apellidos":"Mostrador"%' } },
          { direccion: { [Op.like]: '%Cliente Mostrador%' } }
        ]
      }
    });

    if (!mostrador) {
      const metaStr = JSON.stringify({
        nombre: 'Cliente',
        apellidos: 'Mostrador',
        esMostrador: true,
        tipo: 'Nuevo',
        descuentoPorcentaje: 0,
        estado: 'Activo'
      });
      mostrador = await Cliente.create({
        idUsuario: null,
        direccion: metaStr,
        estado: 1
      });
    }
    return mostrador;
  }

  static async create(data) {
    let targetUserId = data.idUsuario || data.userId;

    // Strict Validation 1: Check user provided
    if (!targetUserId) {
      const error = new Error('No se especificó un usuario para realizar el pedido.');
      error.statusCode = 400;
      throw error;
    }

    // Strict Validation 2: Check user exists in DB
    const userObj = await User.findByPk(targetUserId, {
      include: [{ model: Role, as: 'rolInfo' }]
    });
    if (!userObj) {
      const error = new Error('El usuario especificado no existe en el sistema.');
      error.statusCode = 404;
      throw error;
    }

    // Strict Validation 3: Check user is ACTIVE
    if (userObj.estado === 'INACTIVO' || userObj.estado === '0' || userObj.estado === 0) {
      const error = new Error('Tu usuario está inactivo y no puedes realizar pedidos. Comunícate con el administrador para activar tu cuenta.');
      error.statusCode = 403;
      throw error;
    }

    // Determine if the operating user is staff (Admin, Vendedor, Cocinero)
    const userRole = userObj.idRol || (userObj.rolInfo ? userObj.rolInfo.nombre : null);
    const isStaff = (userRole === 1 || userRole === 2 || userRole === 3 || 
                     String(userRole).toLowerCase().includes('admin') || 
                     String(userRole).toLowerCase().includes('vendedor') || 
                     String(userRole).toLowerCase().includes('cocinero'));

    let finalClienteId = null;

    if (isStaff) {
      // Staff (Vendedor/Admin) creating POS sale -> seller is employee, NOT customer
      if (data.idCliente) {
        const targetCliente = await Cliente.findByPk(data.idCliente, {
          include: [{ model: User, as: 'usuario' }]
        });
        if (!targetCliente) {
          const error = new Error('El cliente seleccionado no existe en el sistema.');
          error.statusCode = 404;
          throw error;
        }

        let metaCli = {};
        if (targetCliente.direccion && targetCliente.direccion.trim().startsWith('{')) {
          try { metaCli = JSON.parse(targetCliente.direccion); } catch (e) { metaCli = {}; }
        }

        const isCliInactive = 
          targetCliente.estado === 0 || 
          targetCliente.estado === false || 
          metaCli.estado === 'Inactivo' || 
          metaCli.estado === 0 ||
          (targetCliente.usuario && (
            String(targetCliente.usuario.estado).toUpperCase() === 'INACTIVO' ||
            targetCliente.usuario.estado === 0 ||
            targetCliente.usuario.estado === false
          ));

        if (isCliInactive) {
          const clientDisplay = targetCliente.usuario
            ? `${targetCliente.usuario.nombre} ${targetCliente.usuario.apellidos || ''}`.trim()
            : (metaCli.nombre ? `${metaCli.nombre} ${metaCli.apellidos || ''}`.trim() : 'seleccionado');
          const error = new Error(`El cliente "${clientDisplay}" se encuentra inactivo y no tiene permitido realizar compras.`);
          error.statusCode = 400;
          throw error;
        }

        const isCliPending = targetCliente.usuario && String(targetCliente.usuario.estado).toUpperCase() === 'PENDIENTE';
        if (isCliPending) {
          const clientDisplay = `${targetCliente.usuario.nombre} ${targetCliente.usuario.apellidos || ''}`.trim();
          const error = new Error(`El cliente "${clientDisplay}" tiene su cuenta pendiente de activación y no puede realizar compras hasta activar su acceso.`);
          error.statusCode = 400;
          throw error;
        }

        finalClienteId = targetCliente.idCliente;
      } else {
        const mostrador = await this.getOrCreateClienteMostrador();
        finalClienteId = mostrador.idCliente;
      }
    } else {
      // Regular customer placing an order online
      let clienteObj = await Cliente.findOne({ 
        where: { idUsuario: targetUserId },
        include: [{ model: User, as: 'usuario' }]
      });
      if (!clienteObj) {
        clienteObj = await Cliente.create({
          idUsuario: targetUserId,
          direccion: data.direccion || '',
          estado: 1
        });
      }

      let clientMeta = {};
      if (clienteObj.direccion && clienteObj.direccion.trim().startsWith('{')) {
        try { clientMeta = JSON.parse(clienteObj.direccion); } catch (e) { clientMeta = {}; }
      }

      const isOnlineInactive = 
        clienteObj.estado === 0 || 
        clienteObj.estado === false || 
        clientMeta.estado === 'Inactivo' || 
        clientMeta.estado === 0 ||
        userObj.estado === 'INACTIVO' ||
        userObj.estado === 0 ||
        userObj.estado === '0';

      if (isOnlineInactive) {
        const error = new Error('No puedes realizar el pedido porque tu cuenta de cliente se encuentra inactiva. Comunícate con la administración para reactivar tu cuenta.');
        error.statusCode = 403;
        throw error;
      }

      finalClienteId = clienteObj.idCliente;
    }

    // Determinar y normalizar tipoVenta (PUNTO_DE_VENTA vs DOMICILIO)
    const rawTipoVenta = String(data.tipoVenta || "").toUpperCase();
    const rawEntrega = String(data.tipoEntrega || (data.mesa ? "En Mesa" : "")).toLowerCase();
    let resolvedTipoVenta = "PUNTO_DE_VENTA";

    if (rawTipoVenta.includes("DOMICILIO") || rawTipoVenta.includes("LINEA") || rawEntrega.includes("domicilio")) {
      resolvedTipoVenta = "DOMICILIO";
    } else {
      resolvedTipoVenta = "PUNTO_DE_VENTA";
    }

    // Si es venta rápida (PUNTO_DE_VENTA), asegurar que se asocie al responsable con rol Vendedor o Administrador
    let responsibleUserId = targetUserId;
    if (resolvedTipoVenta === "PUNTO_DE_VENTA") {
      if (!isStaff) {
        const { Op } = require('sequelize');
        const sellerUser = await User.findOne({
          include: [{ model: Role, as: 'rolInfo', where: { nombre: { [Op.like]: '%Vendedor%' } } }],
          where: { estado: { [Op.in]: [1, 'ACTIVO', '1'] } }
        }).catch(() => null);

        if (sellerUser) {
          responsibleUserId = sellerUser.idUsuario;
        }
      }
    }

    let parsedObs = {};
    if (typeof data.observaciones === 'string' && data.observaciones.startsWith('{')) {
      try { parsedObs = JSON.parse(data.observaciones); } catch (e) {}
    } else if (typeof data.observaciones === 'object' && data.observaciones !== null) {
      parsedObs = data.observaciones;
    }

    const rawDetails = data.detalles || data.items || [];

    let calculatedSubtotal = 0;
    for (const it of rawDetails) {
      const itPrice = Number(it.precioUnitario || it.precio || 0);
      const itQty = Number(it.cantidad || 1);
      const itAdds = Array.isArray(it.adiciones)
        ? it.adiciones.reduce((s, a) => s + (Number(a.precio || a.precioUnitario || 0)), 0)
        : 0;
      calculatedSubtotal += (itPrice + itAdds) * itQty;
    }

    const finalSubtotal = Number(data.subtotal) > 0 ? Number(data.subtotal) : calculatedSubtotal;
    let finalDescuento = Number(data.descuentoAplicado || data.descuento || 0);

    const ClienteService = require('./clienteService');
    const isMostradorSale = (!data.idCliente && isStaff) ||
      (data.clienteNombre && String(data.clienteNombre).toLowerCase().includes('mostrador')) ||
      (parsedObs.clienteNombre && String(parsedObs.clienteNombre).toLowerCase().includes('mostrador')) ||
      (!data.idCliente && isStaff);

    if (finalDescuento === 0 && finalClienteId && !isMostradorSale) {
      try {
        const clienteInfo = await ClienteService.getById(finalClienteId);
        if (clienteInfo && clienteInfo.tieneCuenta) {
          const nivel = clienteInfo.tipo || clienteInfo.fidelidad?.tipo || 'Nuevo';
          let pct = Number(clienteInfo.descuentoPorcentaje !== undefined ? clienteInfo.descuentoPorcentaje : (clienteInfo.fidelidad?.descuentoPorcentaje || 0));

          // Descuentos oficiales del Club de Fidelización Chazin Food:
          // - Cliente Nuevo: 0% OFF
          // - Cliente Regular: 5% OFF (vigencia 30 días)
          // - Cliente Frecuente: 10% OFF (vigencia 30 días + 10 días de gracia)
          // - Cliente VIP: 15% OFF (vigencia 30 días + 15 días de gracia)
          if (!pct || pct <= 0) {
            if (nivel === 'Regular') pct = 5;
            else if (nivel === 'Frecuente') pct = 10;
            else if (nivel === 'VIP') pct = 15;
            else pct = 0;
          }

          if (pct > 0 && ['Regular', 'Frecuente', 'VIP'].includes(nivel)) {
            finalDescuento = Math.round(finalSubtotal * (pct / 100));
          }
        }
      } catch (e) {
        // Continue without blocking
      }
    }

    const finalTotal = Math.max(0, finalSubtotal - finalDescuento);

    // Ítem #123: origen de la venta (ONLINE = tienda web, PUNTO_FISICO = POS / mostrador)
    const rawOrigen = String(data.origen || parsedObs.origen || '').toUpperCase().replace(/\s+/g, '_');
    let origenVenta;
    if (rawOrigen === 'ONLINE' || rawOrigen === 'WEB') {
      origenVenta = 'ONLINE';
    } else if (rawOrigen.includes('PUNTO') || rawOrigen.includes('FISICO') || rawOrigen === 'POS') {
      origenVenta = 'PUNTO_FISICO';
    } else {
      origenVenta = isStaff ? 'PUNTO_FISICO' : 'ONLINE';
    }
    // Un cliente autenticado (no staff) nunca puede registrar ventas como punto físico
    if (!isStaff) origenVenta = 'ONLINE';

    // Ítem #122: las ventas online solo admiten pago electrónico con Wompi
    const metodoPagoSolicitado = String(data.metodoPago || parsedObs.metodoPago || '').trim();
    if (origenVenta === 'ONLINE' && (!metodoPagoSolicitado || metodoPagoSolicitado.toLowerCase() === 'efectivo')) {
      const error = new Error('Las ventas online únicamente admiten pago electrónico a través de Wompi.');
      error.statusCode = 400;
      throw error;
    }

    // Ítem #124: tiempo estimado de entrega híbrido (Automático según fichas técnicas + modalidad o Manual si se especifica)
    const initialItemsForPrep = (Array.isArray(data.productos) && data.productos.length > 0)
      ? data.productos
      : (Array.isArray(parsedObs.productos) && parsedObs.productos.length > 0)
        ? parsedObs.productos
        : rawDetails;
    const initialTipoEntrega = data.tipoEntrega || parsedObs.tipoEntrega || (origenVenta === 'ONLINE' ? 'Domicilio' : (data.mesa ? 'En Mesa' : 'Recoger'));
    const initialHybridEst = computeHybridDeliveryEstimate({
      productos: initialItemsForPrep,
      tipoEntrega: initialTipoEntrega,
      estadoEntrega: 'PENDIENTE',
      savedTiempo: data.tiempoEstimadoEntrega || parsedObs.tiempoEstimadoEntrega || '',
      savedModo: data.modoTiempoEntrega || parsedObs.modoTiempoEntrega || ''
    });
    const tiempoEstimadoEntregaVenta = String(initialHybridEst.effectiveEstimate).trim().slice(0, 60);

    // Ítem #11: el empaque para llevar es independiente del tipo de entrega
    const empaqueParaLlevar = Boolean(
      data.empaqueParaLlevar || parsedObs.empaqueParaLlevar ||
      (data.especificaciones && typeof data.especificaciones === 'object' && data.especificaciones.empaqueParaLlevar)
    );

    const now = new Date();
    const formattedHorario = formatColombiaTime(now);
    const formattedHorarioExacto = formatColombiaTimeWithSeconds(now);

    const obsObj = {
      horario: data.horario || parsedObs.horario || formattedHorario,
      tipoEntrega: data.tipoEntrega || parsedObs.tipoEntrega || (data.mesa ? "En Mesa" : "Recoger"),
      metodoPago: data.metodoPago || parsedObs.metodoPago || "Efectivo",
      direccion: data.direccion || parsedObs.direccion || "Recoger en Local",
      estadoPago: data.estadoPago || parsedObs.estadoPago || "Pagado",
      codigoPedido: data.codigoPedido || data.numeroVenta || parsedObs.codigoPedido || `VEN-${String(Date.now()).slice(-4)}`,
      clienteNombre: data.clienteNombre || parsedObs.clienteNombre || `${userObj.nombre} ${userObj.apellidos || ''}`.trim(),
      productos: (Array.isArray(data.productos) && data.productos.length > 0)
        ? data.productos
        : (Array.isArray(parsedObs.productos) && parsedObs.productos.length > 0)
          ? parsedObs.productos
          : rawDetails.map(it => {
              const itPrice = Number(it.precioUnitario || it.precio || 0);
              const itQty = Number(it.cantidad || 1);
              const itAdds = Array.isArray(it.adiciones)
                ? it.adiciones.reduce((s, a) => s + (Number(a.precio || a.precioUnitario || 0)), 0)
                : 0;
              return {
                idVariante: it.idVariante || it.varianteId,
                nombre: it.nombre || it.observaciones || it.observacion || "Producto",
                cantidad: itQty,
                precioUnitario: itPrice,
                total: Number(it.subtotal || it.total) > 0 ? Number(it.subtotal || it.total) : (itPrice + itAdds) * itQty,
                observaciones: it.observacion || it.observaciones || "",
                ingredientesRemovidos: Array.isArray(it.ingredientesRemovidos) ? it.ingredientesRemovidos : [],
                personalizaciones: (it.personalizaciones && typeof it.personalizaciones === 'object') ? it.personalizaciones : undefined,
                adiciones: it.adiciones || it.idAdiciones || []
              };
            }),
      especificaciones: extractCleanSpecifications(
        data.especificaciones !== undefined
          ? data.especificaciones
          : (data.observacion !== undefined
            ? data.observacion
            : (parsedObs.especificaciones !== undefined
              ? parsedObs.especificaciones
              : (parsedObs.nota !== undefined
                ? parsedObs.nota
                : "")))
      ),
      efectivoConCuanto: parsedObs.efectivoConCuanto || (data.datosPago ? data.datosPago.efectivoConCuanto : null) || "",
      vueltoEfectivo: parsedObs.vueltoEfectivo || (data.datosPago ? data.datosPago.vueltoEfectivo : null) || 0,
      transferenciaReferencia: parsedObs.transferenciaReferencia || (data.datosPago ? data.datosPago.transferReferencia : null) || "",
      transferBanco: parsedObs.transferBanco || (data.datosPago ? data.datosPago.transferBanco : null) || "",
      tarjetaNumero: parsedObs.tarjetaNumero || (data.datosPago ? data.datosPago.tarjetaNumero : null) || "",
      origen: origenVenta,
      tiempoEstimadoEntrega: tiempoEstimadoEntregaVenta,
      empaqueParaLlevar,
      estadoCocina: 'EN_COLA',
      horaEstado: formattedHorario,
      horaExactaEstado: formattedHorarioExacto,
      fechaCambioEstado: now.toISOString(),
      tiemposEstados: {
        enCola: {
          estado: 'En Cola',
          hora: formattedHorario,
          horaExacta: formattedHorarioExacto,
          fecha: now.toISOString()
        }
      },
      historialEstados: [
        {
          estado: 'PENDIENTE',
          etiqueta: 'En Cola',
          hora: formattedHorario,
          horaExacta: formattedHorarioExacto,
          fecha: now.toISOString()
        }
      ]
    };

    // Las ventas online no pueden autodeclararse pagadas: quedan pendientes hasta confirmación de Wompi o aprobación manual (Ítem #116)
    if (origenVenta === 'ONLINE' && !isStaff) {
      obsObj.estadoPago = 'Pendiente';
    }

    // Auto-aprobación en Ventas: las ventas en Punto de Venta (POS) o con pago confirmado/aprobado
    // se aprueban directamente en el módulo de Ventas, convirtiéndose en órdenes de producción (Ítem 114 y 116)
    const esPOS = resolvedTipoVenta === 'PUNTO_DE_VENTA' && origenVenta === 'PUNTO_FISICO';
    const esPagado = isStaff && String(obsObj.estadoPago || data.estadoPago || '').toLowerCase() === 'pagado';
    const esAprobadoExplicito = isStaff && (data.estadoAprobacion === 'APROBADO' || parsedObs.estadoAprobacion === 'APROBADO');

    const finalEstadoAprobacion = (esPOS || esPagado || esAprobadoExplicito)
      ? 'APROBADO' 
      : (data.estadoAprobacion || parsedObs.estadoAprobacion || 'PENDIENTE');

    obsObj.estadoAprobacion = finalEstadoAprobacion;

    const obsStr = JSON.stringify(obsObj);

    const venta = await Venta.create({
      idCliente: finalClienteId,
      idUsuario: responsibleUserId,
      idDescuento: data.idDescuento || null,
      tipoVenta: resolvedTipoVenta,
      subtotal: finalSubtotal,
      descuentoAplicado: finalDescuento,
      total: finalTotal,
      estadoEntrega: data.estadoEntrega || data.estado || 'ENTREGADO',
      observaciones: obsStr,
      estadoAprobacion: finalEstadoAprobacion,
      origen: origenVenta,
      tiempoEstimadoEntrega: tiempoEstimadoEntregaVenta
    });

    if (rawDetails.length > 0) {
      const { sequelize, DetalleVentaAdicion } = require('../../persistence/models');

      for (let detailIdx = 0; detailIdx < rawDetails.length; detailIdx++) {
        const d = rawDetails[detailIdx];
        const obsProdItem = Array.isArray(obsObj.productos) ? obsObj.productos[detailIdx] : null;
        let chosenVarianteId = null;

        // 1. Verificar si d.idVariante existe directamente en la tabla `variante`
        if (d.idVariante) {
          try {
            const [matchById] = await sequelize.query(
              'SELECT idVariante FROM variante WHERE idVariante = :id LIMIT 1',
              { replacements: { id: d.idVariante } }
            );
            if (matchById && matchById.length > 0) {
              chosenVarianteId = matchById[0].idVariante;
            }
          } catch (e) {
            console.warn('Error al consultar idVariante:', e.message);
          }
        }

        // 2. Si no coincide, buscar si existe variante asociada al idProducto
        if (!chosenVarianteId) {
          const prodId = d.idProducto || d.idVariante;
          if (prodId) {
            try {
              const [matchByProd] = await sequelize.query(
                'SELECT idVariante FROM variante WHERE idProducto = :id LIMIT 1',
                { replacements: { id: prodId } }
              );
              if (matchByProd && matchByProd.length > 0) {
                chosenVarianteId = matchByProd[0].idVariante;
              }
            } catch (e) {
              console.warn('Error al consultar idProducto en variante:', e.message);
            }
          }
        }

        // 3. Si no hay coincidencia, tomar cualquier variante existente en la base de datos
        if (!chosenVarianteId) {
          try {
            const [anyVar] = await sequelize.query('SELECT idVariante FROM variante LIMIT 1');
            if (anyVar && anyVar.length > 0) {
              chosenVarianteId = anyVar[0].idVariante;
            }
          } catch (e) {
            console.warn('Error al buscar variante por defecto:', e.message);
          }
        }

        // 4. Si la tabla `variante` está completamente vacía, crear dinámicamente una variante estándar
        if (!chosenVarianteId) {
          try {
            const targetProdId = d.idProducto || d.idVariante || 1;
            const [prodCheck] = await sequelize.query(
              'SELECT idProducto, nombre, precio FROM producto WHERE idProducto = :id LIMIT 1',
              { replacements: { id: targetProdId } }
            );

            let finalProdId = targetProdId;
            let varNombre = d.observaciones || d.observacion || d.nombre || 'Estándar';
            let varPrecio = d.precioUnitario || d.precio || 0;

            if (!prodCheck || prodCheck.length === 0) {
              const [firstProd] = await sequelize.query('SELECT idProducto, nombre, precio FROM producto LIMIT 1');
              if (firstProd && firstProd.length > 0) {
                finalProdId = firstProd[0].idProducto;
                varNombre = firstProd[0].nombre;
                varPrecio = firstProd[0].precio;
              }
            } else {
              varNombre = prodCheck[0].nombre;
              varPrecio = prodCheck[0].precio;
            }

            await sequelize.query(
              'INSERT INTO variante (idProducto, nombre, precio, estado) VALUES (:idProducto, :nombre, :precio, 1)',
              { replacements: { idProducto: finalProdId, nombre: String(varNombre).slice(0, 80), precio: varPrecio } }
            );

            const [newVarRow] = await sequelize.query(
              'SELECT idVariante FROM variante WHERE idProducto = :idProducto ORDER BY idVariante DESC LIMIT 1',
              { replacements: { idProducto: finalProdId } }
            );
            if (newVarRow && newVarRow.length > 0) {
              chosenVarianteId = newVarRow[0].idVariante;
            }
          } catch (e) {
            console.error('Error creando variante dinámica:', e.message);
          }
        }

        if (chosenVarianteId) {
          const prodDisplayName = String(d.nombre || obsProdItem?.nombre || '').trim();
          const obsCandidates = [
            d.observacion,
            obsProdItem?.observacion,
            obsProdItem?.observaciones,
            d.observaciones
          ]
            .map(v => (typeof v === 'string' ? v.trim() : ''))
            .filter(Boolean);
          const customNote = obsCandidates.find(
            c => c.toLowerCase() !== prodDisplayName.toLowerCase()
          ) || obsCandidates[0] || prodDisplayName || null;

          const createdDetalle = await DetalleVentaProducto.create({
            idVenta: venta.idVenta,
            idVariante: chosenVarianteId,
            cantidad: d.cantidad || 1,
            precioUnitario: d.precioUnitario || d.precio || 0,
            subtotal: d.subtotal || ((d.precioUnitario || d.precio || 0) * (d.cantidad || 1)),
            observaciones: customNote
          });

          // Descuento Automático de Insumos según Ficha Técnica del Producto o Variante específica
          try {
            const { Insumo, Variante, Trazabilidad } = require('../../persistence/models');
            let targetProductId = d.idProducto;
            if (!targetProductId && chosenVarianteId) {
              const varRow = await Variante.findByPk(chosenVarianteId);
              if (varRow && varRow.idProducto) targetProductId = varRow.idProducto;
            }
            if (!targetProductId && d.idVariante) {
              const varRow = await Variante.findByPk(d.idVariante);
              if (varRow && varRow.idProducto) targetProductId = varRow.idProducto;
            }

            const recipeResult = await VentaService.resolveRecipeOrInsumoForDetail(d, chosenVarianteId, targetProductId);
            const itemQty = Number(d.cantidad || 1);

            // Detección de Combo para descuento automático de productos vinculados
            let comboItems = [];
            let prodRow = null;
            if (targetProductId) {
              const { Product: ProdModel, ComboProducto: CPModel } = require('../../persistence/models');
              try {
                prodRow = await ProdModel.findByPk(targetProductId);
                if (prodRow) {
                  let cfg = prodRow.configuracionCombo;
                  if (typeof cfg === 'string') {
                    try { cfg = JSON.parse(cfg); } catch (e) { cfg = null; }
                  }
                  if (cfg && cfg.esCombo) {
                    if (Array.isArray(cfg.productosAsociados) && cfg.productosAsociados.length > 0) {
                      comboItems = cfg.productosAsociados;
                    } else if (Array.isArray(cfg.itemsCombo) && cfg.itemsCombo.length > 0) {
                      comboItems = cfg.itemsCombo;
                    }
                  }
                  if (comboItems.length === 0) {
                    const dbComboItems = await CPModel.findAll({ where: { idCombo: targetProductId } });
                    if (dbComboItems && dbComboItems.length > 0) {
                      comboItems = dbComboItems.map(ci => ({ idProducto: ci.idProducto, cantidad: ci.cantidad }));
                    }
                  }
                }
              } catch (comboLookupErr) {
                console.warn('Error identificando productos de combo para inventario:', comboLookupErr.message);
              }
            }

            if (recipeResult.directInsumoId) {
              const insumo = await Insumo.findByPk(recipeResult.directInsumoId);
              if (insumo && !isInsumoRemovedByMiseEnPlace(insumo, d, obsProdItem)) {
                const totalADescontar = itemQty;
                const stockActual = Number(insumo.stock || 0);
                const nuevoStock = Math.max(0, stockActual - totalADescontar);
                insumo.stock = nuevoStock;
                await insumo.save();

                try {
                  await Trazabilidad.create({
                    tipo: 'CONSUMO_VENTA',
                    entidadNombre: insumo.nombre,
                    detalle: `Consumo de ${totalADescontar.toFixed(2)} und por Venta #${venta.idVenta} (${itemQty}x ${insumo.nombre})`,
                    idInsumo: insumo.idInsumo,
                    tipoMovimiento: 'SALIDA',
                    cantidad: totalADescontar,
                    motivo: `Venta #${venta.idVenta}`,
                    usuarioId: responsibleUserId || targetUserId || null
                  });
                } catch (tzErr) {
                  console.warn('Error registrando trazabilidad de insumo:', tzErr.message);
                }
              }
            } else if (comboItems.length > 0) {
              // Descuento automático de inventario para cada producto individual que compone el combo
              for (const ci of comboItems) {
                const childProdId = ci.idProducto || ci.id;
                const childQty = (Number(ci.cantidad || 1)) * itemQty;
                if (childProdId && childQty > 0) {
                  try {
                    const childRecipe = await VentaService.resolveRecipeOrInsumoForDetail({ idProducto: childProdId, cantidad: childQty }, null, childProdId);
                    if (childRecipe.directInsumoId) {
                      const insumoChild = await Insumo.findByPk(childRecipe.directInsumoId);
                      if (insumoChild) {
                        const stockAct = Number(insumoChild.stock || 0);
                        insumoChild.stock = Math.max(0, stockAct - childQty);
                        await insumoChild.save();
                        try {
                          await Trazabilidad.create({
                            tipo: 'CONSUMO_VENTA',
                            entidadNombre: insumoChild.nombre,
                            detalle: `Consumo de ${childQty} und por Venta #${venta.idVenta} (Combo: ${prodRow?.nombre || targetProductId} -> ${insumoChild.nombre})`,
                            idInsumo: insumoChild.idInsumo,
                            tipoMovimiento: 'SALIDA',
                            cantidad: childQty,
                            motivo: `Venta #${venta.idVenta}`,
                            usuarioId: responsibleUserId || targetUserId || null
                          });
                        } catch (e) {}
                      }
                    } else if (childRecipe.ficha && Array.isArray(childRecipe.ficha.detalles)) {
                      for (const det of childRecipe.ficha.detalles) {
                        const cantPorPlato = Number(det.cantidad || 0);
                        const recipeUnit = det.unidadMedida || 'und';
                        if (cantPorPlato > 0 && det.idInsumo) {
                          const insumo = await Insumo.findByPk(det.idInsumo);
                          if (insumo) {
                            const insumoUnit = insumo.unidadMedida || recipeUnit;
                            const cantConvertida = convertUnits(cantPorPlato, recipeUnit, insumoUnit);
                            const totalADescontar = cantConvertida * childQty;
                            const stockActual = Number(insumo.stock || 0);
                            insumo.stock = Math.max(0, stockActual - totalADescontar);
                            await insumo.save();
                            try {
                              await Trazabilidad.create({
                                tipo: 'CONSUMO_VENTA',
                                entidadNombre: insumo.nombre,
                                detalle: `Consumo de ${totalADescontar.toFixed(2)} ${insumoUnit} por Venta #${venta.idVenta} (Combo: ${prodRow?.nombre || targetProductId} -> Prod #${childProdId})`,
                                idInsumo: insumo.idInsumo,
                                tipoMovimiento: 'SALIDA',
                                cantidad: totalADescontar,
                                motivo: `Venta #${venta.idVenta}`,
                                usuarioId: responsibleUserId || targetUserId || null
                              });
                            } catch (tzErr) {}
                          }
                        }
                      }
                    }
                  } catch (childErr) {
                    console.warn(`Error descontando producto #${childProdId} de combo:`, childErr.message);
                  }
                }
              }
            } else if (recipeResult.ficha && Array.isArray(recipeResult.ficha.detalles)) {
              for (const det of recipeResult.ficha.detalles) {
                const cantPorPlato = Number(det.cantidad || 0);
                const recipeUnit = det.unidadMedida || 'und';
                if (cantPorPlato > 0 && det.idInsumo) {
                  const insumo = await Insumo.findByPk(det.idInsumo);
                  if (insumo) {
                    // Respetar Mise & Place: si el cliente quitó este ingrediente ("Sin ..."), no se descuenta de inventario
                    if (isInsumoRemovedByMiseEnPlace(insumo, d, obsProdItem)) {
                      continue;
                    }
                    const insumoUnit = insumo.unidadMedida || recipeUnit;
                    const cantConvertida = convertUnits(cantPorPlato, recipeUnit, insumoUnit);
                    const totalADescontar = cantConvertida * itemQty;
                    const stockActual = Number(insumo.stock || 0);
                    const nuevoStock = Math.max(0, stockActual - totalADescontar);
                    insumo.stock = nuevoStock;
                    await insumo.save();

                    try {
                      await Trazabilidad.create({
                        tipo: 'CONSUMO_VENTA',
                        entidadNombre: insumo.nombre,
                        detalle: `Consumo de ${totalADescontar.toFixed(2)} ${insumoUnit} por Venta #${venta.idVenta} (${itemQty}x Prod #${recipeResult.targetProductId || targetProductId})`,
                        idInsumo: insumo.idInsumo,
                        tipoMovimiento: 'SALIDA',
                        cantidad: totalADescontar,
                        motivo: `Venta #${venta.idVenta}`,
                        usuarioId: responsibleUserId || targetUserId || null
                      });
                    } catch (tzErr) {
                      console.warn('Error registrando trazabilidad de insumo:', tzErr.message);
                    }
                  }
                }
              }
            }
          } catch (mrpErr) {
            console.warn('Error descontando insumos de receta:', mrpErr.message);
          }

          // Guardar adiciones si fueron enviadas y descontar su insumo de inventario
          const adicList = d.idAdiciones || d.adiciones || [];
          if (Array.isArray(adicList) && adicList.length > 0) {
            const { Insumo, Trazabilidad } = require('../../persistence/models');
            for (const adItem of adicList) {
              const adId = typeof adItem === 'object' ? (adItem.id || adItem.idAdicion || adItem.idInsumo) : adItem;
              const adCantidad = typeof adItem === 'object' ? (Number(adItem.cantidad) || 1) : 1;
              let adPrecio = typeof adItem === 'object' ? (Number(adItem.precio !== undefined ? adItem.precio : adItem.precioAdicion) || 0) : 0;
              if (adId) {
                try {
                  const insumoAd = await Insumo.findByPk(adId);
                  if (insumoAd && adPrecio <= 0 && insumoAd.precioAdicion) {
                    adPrecio = Number(insumoAd.precioAdicion) || 0;
                  }

                  await DetalleVentaAdicion.create({
                    idDetalleVenta: createdDetalle.idDetalleVenta,
                    idAdicion: adId,
                    cantidad: adCantidad,
                    precio: adPrecio,
                    subtotal: adPrecio * adCantidad
                  });

                  // Descontar inventario del insumo vinculado a la adición
                  if (insumoAd) {
                    const itemQty = Number(d.cantidad || 1);
                    const totalAdDescontar = adCantidad * itemQty;
                    const stockActual = Number(insumoAd.stock || 0);
                    const nuevoStock = Math.max(0, stockActual - totalAdDescontar);
                    insumoAd.stock = nuevoStock;
                    await insumoAd.save();

                    try {
                      await Trazabilidad.create({
                        tipo: 'CONSUMO_ADICION',
                        entidadNombre: insumoAd.nombre,
                        detalle: `Adición ${insumoAd.nombre} (${totalAdDescontar} ${insumoAd.unidadMedida || 'und'}) en Venta #${venta.idVenta}`,
                        idInsumo: insumoAd.idInsumo,
                        tipoMovimiento: 'SALIDA',
                        cantidad: totalAdDescontar,
                        motivo: `Venta #${venta.idVenta} (Adición)`,
                        usuarioId: responsibleUserId || targetUserId || null
                      });
                    } catch (tzAdErr) {
                      console.warn('Error registrando trazabilidad de adición:', tzAdErr.message);
                    }
                  }
                } catch (errAd) {
                  console.warn('Error guardando DetalleVentaAdicion o descontando stock:', errAd.message);
                }
              }
            }
          }
        }
      }
    }

    // Trigger client loyalty progression (strictly only for registered customer accounts and when sale is approved)
    if (finalClienteId && !isMostradorSale && finalEstadoAprobacion === 'APROBADO') {
      await this.registrarFidelidadUnaVez(venta.idVenta);
    }

    return this.getById(venta.idVenta);
  }

  static async updateEstado(id, estado) {
    const v = await Venta.findByPk(id);
    if (!v) {
      const error = new Error('Venta no encontrada');
      error.statusCode = 404;
      throw error;
    }

    let estadoEnum = estado;
    if (estado === 'Pendiente') estadoEnum = 'PENDIENTE';
    else if (estado === 'En Preparación') estadoEnum = 'PREPARANDO';
    else if (estado === 'Listo') estadoEnum = 'LISTO';
    else if (estado === 'Completada' || estado === 'Entregado') estadoEnum = 'ENTREGADO';
    else if (estado === 'Anulada' || estado === 'CANCELADO') estadoEnum = 'CANCELADO';

    const estadoAnterior = v.estadoEntrega;
    v.estadoEntrega = estadoEnum;
    if (estadoEnum === 'CANCELADO') {
      v.estadoAprobacion = 'RECHAZADO';
    } else if (estadoEnum === 'PREPARANDO' || estadoEnum === 'LISTO' || estadoEnum === 'ENTREGADO') {
      v.estadoAprobacion = 'APROBADO';
    }

    // Actualizar hora del estado dinámicamente en observaciones
    let obsData = {};
    try {
      obsData = typeof v.observaciones === 'string' && v.observaciones.startsWith('{')
        ? JSON.parse(v.observaciones)
        : { nota: v.observaciones || '' };
    } catch (e) {
      obsData = { nota: v.observaciones || '' };
    }

    const ahoraEstado = new Date();
    const horaActual = formatColombiaTime(ahoraEstado);
    const horaActualConSegundos = formatColombiaTimeWithSeconds(ahoraEstado);
    obsData.horaEstado = horaActual;
    obsData.horaExactaEstado = horaActualConSegundos;
    obsData.fechaCambioEstado = ahoraEstado.toISOString();

    if (!obsData.tiemposEstados || typeof obsData.tiemposEstados !== 'object') {
      const baseHora = formatColombiaTime(v.fechaVenta) || obsData.horario || horaActual;
      obsData.tiemposEstados = {
        enCola: {
          estado: 'En Cola',
          hora: baseHora,
          horaExacta: formatColombiaTimeWithSeconds(v.fechaVenta) || baseHora,
          fecha: v.fechaVenta ? new Date(v.fechaVenta).toISOString() : ahoraEstado.toISOString()
        }
      };
    }

    if (estadoEnum === 'PREPARANDO') {
      obsData.estadoCocina = 'EN_PREPARACION';
      obsData.fechaInicioPreparacion = ahoraEstado.toISOString();
      obsData.horaInicioPreparacion = horaActual;
      obsData.tiemposEstados.enPreparacion = {
        estado: 'En Preparación',
        hora: horaActual,
        horaExacta: horaActualConSegundos,
        fecha: ahoraEstado.toISOString()
      };
    } else if (estadoEnum === 'LISTO') {
      obsData.estadoCocina = 'LISTO';
      obsData.fechaListo = ahoraEstado.toISOString();
      obsData.horaListo = horaActual;
      obsData.tiemposEstados.listo = {
        estado: 'Listo',
        hora: horaActual,
        horaExacta: horaActualConSegundos,
        fecha: ahoraEstado.toISOString()
      };
      if (obsData.modoTiempoEntrega !== 'MANUAL') {
        const esDom = String(obsData.tipoEntrega || v.tipoVenta || '').toLowerCase().includes('domicilio');
        const autoListo = esDom ? '15-20 min' : 'Listo para entrega';
        obsData.tiempoEstimadoEntrega = autoListo;
        v.tiempoEstimadoEntrega = autoListo;
      }
    } else if (estadoEnum === 'ENTREGADO') {
      obsData.estadoCocina = 'ENTREGADO';
      obsData.fechaEntrega = ahoraEstado.toISOString();
      obsData.horaEntrega = horaActual;
      obsData.tiemposEstados.entregado = {
        estado: 'Entregado',
        hora: horaActual,
        horaExacta: horaActualConSegundos,
        fecha: ahoraEstado.toISOString()
      };
      obsData.tiempoEstimadoEntrega = 'Entregado';
      obsData.modoTiempoEntrega = 'AUTO';
      v.tiempoEstimadoEntrega = 'Entregado';
    }
    if (!Array.isArray(obsData.historialEstados)) obsData.historialEstados = [];
    obsData.historialEstados.push({
      estado: estadoEnum,
      etiqueta: estado,
      hora: horaActual,
      horaExacta: horaActualConSegundos,
      fecha: ahoraEstado.toISOString()
    });
    v.observaciones = JSON.stringify(obsData);

    await v.save();

    // Reintegrar insumos si la venta fue anulada/cancelada y no estaba ya cancelada
    if (estadoEnum === 'CANCELADO' && estadoAnterior !== 'CANCELADO') {
      try {
        const saleData = await this.getById(id);
        if (saleData && Array.isArray(saleData.detalles)) {
          const { Insumo, Variante } = require('../../persistence/models');
          for (let idx = 0; idx < saleData.detalles.length; idx++) {
            const d = saleData.detalles[idx];
            const obsProdItem = Array.isArray(saleData.productos) ? saleData.productos[idx] : null;
            let prodId = d.idProducto;
            if (!prodId && d.idVariante) {
              const varRow = await Variante.findByPk(d.idVariante);
              if (varRow) prodId = varRow.idProducto;
            }

            const recipeResult = await VentaService.resolveRecipeOrInsumoForDetail(d, d.idVariante, prodId);
            const itemQty = Number(d.cantidad || 1);

            if (recipeResult.directInsumoId) {
              const insumo = await Insumo.findByPk(recipeResult.directInsumoId);
              if (insumo && !isInsumoRemovedByMiseEnPlace(insumo, d, obsProdItem)) {
                insumo.stock = Number(insumo.stock || 0) + itemQty;
                await insumo.save();
              }
            } else if (recipeResult.ficha && Array.isArray(recipeResult.ficha.detalles)) {
              for (const det of recipeResult.ficha.detalles) {
                const cantPorPlato = Number(det.cantidad || 0);
                const recipeUnit = det.unidadMedida || 'und';
                if (cantPorPlato > 0 && det.idInsumo) {
                  const insumo = await Insumo.findByPk(det.idInsumo);
                  if (insumo) {
                    if (isInsumoRemovedByMiseEnPlace(insumo, d, obsProdItem)) {
                      continue;
                    }
                    const insumoUnit = insumo.unidadMedida || recipeUnit;
                    const cantConvertida = convertUnits(cantPorPlato, recipeUnit, insumoUnit);
                    const totalARestaurar = cantConvertida * itemQty;
                    insumo.stock = Number(insumo.stock || 0) + totalARestaurar;
                    await insumo.save();
                  }
                }
              }
            }
          }
        }
      } catch (restockErr) {
        console.warn('Error reintegrando insumos por cancelación:', restockErr.message);
      }
    }

    // Si la venta estaba PENDIENTE y ahora fue aprobada/procesada, registrar fidelidad del cliente (una sola vez)
    if (estadoAnterior === 'PENDIENTE' && (estadoEnum === 'PREPARANDO' || estadoEnum === 'LISTO' || estadoEnum === 'ENTREGADO')) {
      if (v.idCliente) {
        await VentaService.registrarFidelidadUnaVez(v.idVenta);
      }
    }

    return this.getById(id);
  }

  static async resolveRecipeOrInsumoForDetail(d, chosenVarianteId, targetProductId) {
    const { FichaTecnica, DetalleFichaInsumo, Variante, VarianteInsumo, Insumo, Product } = require('../../persistence/models');
    const { Op } = require('sequelize');

    // Revisar todo el texto descriptivo del ítem
    const rawText = [
      d.observaciones,
      d.observacion,
      d.nombre,
      d.sabor,
      d.saborSeleccionado
    ].filter(Boolean).join(' ').toLowerCase();

    const isExplicitOriginal = rawText.includes('original') || rawText.includes('clásica') || rawText.includes('clasica') || rawText.includes('regular');
    const hasDietKeyword = rawText.includes('sin azúcar') || rawText.includes('sin azucar') || rawText.includes('light') || rawText.includes('zero') || rawText.includes('black');

    const isCoca = (targetProductId === 8) || (d.idProducto === 8) || (d.idProducto === 16) || rawText.includes('coca');
    const isPepsi = (targetProductId === 11) || (d.idProducto === 11) || rawText.includes('pepsi');

    // 1. Caso Coca-Cola: Distinguir con total precisión entre Original y Sin Azúcar / Light
    if (isCoca) {
      const isLightSale = !isExplicitOriginal && (
        (d.idProducto === 16) ||
        (d.idVariante === 20 && !rawText.includes('original')) ||
        (d.idVariante === 76 && !rawText.includes('original')) ||
        (d.idVariante === 77 && !rawText.includes('original')) ||
        hasDietKeyword
      );

      if (isLightSale) {
        // Descontar Coca-Cola Sin Azúcar / Light (Insumo 32)
        try {
          const fichaLight = await FichaTecnica.findOne({
            where: { [Op.or]: [{ idProducto: 16 }, { idVariante: 20 }], estado: 1 },
            include: [{ model: DetalleFichaInsumo, as: 'detalles' }]
          });
          if (fichaLight && Array.isArray(fichaLight.detalles) && fichaLight.detalles.length > 0) {
            return { ficha: fichaLight, targetProductId: 16, resolvedName: 'Coca-Cola Sin Azúcar / Light 400ml' };
          }
        } catch (e) {}
        return { directInsumoId: 32, targetProductId: 16, resolvedName: 'Coca-Cola Sin Azúcar / Light 400ml' };
      } else {
        // Descontar Coca-Cola Original (Insumo 29)
        try {
          const fichaOrig = await FichaTecnica.findOne({
            where: { idProducto: 8, idVariante: null, estado: 1 },
            include: [{ model: DetalleFichaInsumo, as: 'detalles' }]
          });
          if (fichaOrig && Array.isArray(fichaOrig.detalles) && fichaOrig.detalles.length > 0) {
            return { ficha: fichaOrig, targetProductId: 8, resolvedName: 'Coca-Cola Original 400ml' };
          }
        } catch (e) {}
        return { directInsumoId: 29, targetProductId: 8, resolvedName: 'Coca-Cola Original 400ml' };
      }
    }

    // 2. Caso Pepsi: Distinguir entre Regular y Light / Black
    if (isPepsi) {
      const isPepsiLight = !isExplicitOriginal && (
        (d.idVariante === 22 && !rawText.includes('regular') && !rawText.includes('original')) ||
        hasDietKeyword
      );
      if (isPepsiLight) {
        try {
          const fichaPepsiLight = await FichaTecnica.findOne({
            where: { idVariante: 22, estado: 1 },
            include: [{ model: DetalleFichaInsumo, as: 'detalles' }]
          });
          if (fichaPepsiLight && Array.isArray(fichaPepsiLight.detalles) && fichaPepsiLight.detalles.length > 0) {
            return { ficha: fichaPepsiLight, targetProductId: 11, resolvedName: 'Pepsi Light / Black 400ml' };
          }
        } catch (e) {}
        return { directInsumoId: 34, targetProductId: 11, resolvedName: 'Pepsi Light / Black 400ml' };
      } else {
        return { directInsumoId: 33, targetProductId: 11, resolvedName: 'Pepsi Regular 400ml' };
      }
    }

    // 3. Caso Postobón y Bebidas Específicas por Sabor (reconocimiento estricto)
    const isUva = (((rawText.includes('postob') || rawText.includes('gaseosa')) && rawText.includes('uva')) || (targetProductId === 38) || (d.idProducto === 38));
    const isNaranja = (((rawText.includes('postob') || rawText.includes('gaseosa')) && rawText.includes('naranja')) || (targetProductId === 39) || (d.idProducto === 39));
    const isColombiana = (((rawText.includes('postob') || rawText.includes('gaseosa') || rawText.includes('kola')) && rawText.includes('colombiana')) || (targetProductId === 12) || (d.idProducto === 12)) && !isUva && !isNaranja && !rawText.includes('manzana');
    const isManzana = (((rawText.includes('postob') || rawText.includes('gaseosa')) && rawText.includes('manzana')) || (targetProductId === 9) || (d.idProducto === 9)) && !isUva && !isNaranja && !isColombiana;
    const isSprite = rawText.includes('sprite') || (targetProductId === 13) || (d.idProducto === 13);
    const isQuatro = (((rawText.includes('cuatro') || rawText.includes('quatro')) && (rawText.includes('gaseosa') || rawText.includes('toronja'))) || (targetProductId === 14) || (d.idProducto === 14));
    const isAgua = ((rawText.includes('agua') && (rawText.includes('cristal') || rawText.includes('mineral') || rawText.includes('botella'))) || (targetProductId === 10) || (d.idProducto === 10));

    if (isUva) {
      return { directInsumoId: 47, targetProductId: 38, resolvedName: 'Gaseosa Uva Postobón 400ml' };
    }
    if (isNaranja) {
      return { directInsumoId: 48, targetProductId: 39, resolvedName: 'Gaseosa Naranja Postobón 400ml' };
    }
    if (isColombiana) {
      return { directInsumoId: 35, targetProductId: 12, resolvedName: 'Gaseosa Colombiana Postobón 400ml' };
    }
    if (isManzana) {
      return { directInsumoId: 30, targetProductId: 9, resolvedName: 'Manzana Postobón 400ml' };
    }
    if (isSprite) {
      return { directInsumoId: 36, targetProductId: 13, resolvedName: 'Gaseosa Sprite 400ml' };
    }
    if (isQuatro) {
      return { directInsumoId: 37, targetProductId: 14, resolvedName: 'Gaseosa Cuatro Toronja 400ml' };
    }
    if (isAgua) {
      return { directInsumoId: 31, targetProductId: 10, resolvedName: 'Agua Cristal sin Gas 500ml' };
    }

    // 4. Demás casos generales (Platos, combos, etc.)
    const varId = chosenVarianteId || d.idVariante;
    let varRow = null;
    let varDeltas = [];
    if (varId) {
      try {
        varRow = await Variante.findByPk(varId);
        varDeltas = await VarianteInsumo.findAll({
          where: { idVariante: varId },
          include: [
            { model: Insumo, as: 'insumo' },
            { model: Insumo, as: 'insumoReemplazado' }
          ]
        });
      } catch (e) {}
    }

    if (varId) {
      try {
        const fichaVar = await FichaTecnica.findOne({
          where: { idVariante: varId, tipo: 'VARIANTE', estado: 1 },
          include: [{ model: DetalleFichaInsumo, as: 'detalles' }]
        });
        if (fichaVar && Array.isArray(fichaVar.detalles) && fichaVar.detalles.length > 0) {
          return { ficha: fichaVar, targetProductId: fichaVar.idProducto || targetProductId, resolvedName: varRow?.nombre };
        }
        // Compatibilidad con fichas especiales por variante (ej. Coca-Cola Light / Pepsi Light sin varDeltas)
        if (!varDeltas || varDeltas.length === 0) {
          const legacyFichaVar = await FichaTecnica.findOne({
            where: { idVariante: varId, estado: 1 },
            include: [{ model: DetalleFichaInsumo, as: 'detalles' }]
          });
          if (legacyFichaVar && Array.isArray(legacyFichaVar.detalles) && legacyFichaVar.detalles.length > 0) {
            return { ficha: legacyFichaVar, targetProductId: legacyFichaVar.idProducto || targetProductId, resolvedName: varRow?.nombre };
          }
        }
      } catch (e) {}
    }

    const finalProdId = d.idProducto || targetProductId || varRow?.idProducto;
    if (finalProdId) {
      try {
        const { Op } = require('sequelize');
        const fichaBase = await FichaTecnica.findOne({
          where: {
            idProducto: finalProdId,
            estado: 1,
            [Op.or]: [{ tipo: 'PRODUCTO' }, { tipo: null }]
          },
          include: [{ model: DetalleFichaInsumo, as: 'detalles' }],
          order: [['idFichaTecnica', 'ASC']]
        });
        if (fichaBase) {
          if (varDeltas && varDeltas.length > 0) {
            // Aplicar modificaciones delta de la variante a la receta base
            let effectiveDetalles = (fichaBase.detalles || []).map(det => ({
              idDetalleFicha: det.idDetalleFicha,
              idFichaTecnica: det.idFichaTecnica,
              idInsumo: det.idInsumo,
              cantidad: Number(det.cantidad || 0),
              unidadMedida: det.unidadMedida,
              insumo: det.insumo
            }));

            for (const delta of varDeltas) {
              const deltaAccion = String(delta.tipoAccion || 'AGREGAR').toUpperCase();
              const deltaQty = Number(delta.cantidad || 0);

              if (deltaAccion === 'AGREGAR') {
                effectiveDetalles.push({
                  idInsumo: delta.idInsumo,
                  cantidad: deltaQty,
                  unidadMedida: delta.unidadMedida || delta.insumo?.unidadMedida || 'und',
                  insumo: delta.insumo
                });
              } else if (deltaAccion === 'REEMPLAZAR') {
                if (delta.idInsumoReemplazado) {
                  effectiveDetalles = effectiveDetalles.filter(det => Number(det.idInsumo) !== Number(delta.idInsumoReemplazado));
                }
                effectiveDetalles.push({
                  idInsumo: delta.idInsumo,
                  cantidad: deltaQty,
                  unidadMedida: delta.unidadMedida || delta.insumo?.unidadMedida || 'und',
                  insumo: delta.insumo
                });
              } else if (deltaAccion === 'MODIFICAR_CANTIDAD') {
                const existingIdx = effectiveDetalles.findIndex(det => Number(det.idInsumo) === Number(delta.idInsumo));
                if (existingIdx >= 0) {
                  effectiveDetalles[existingIdx].cantidad = deltaQty;
                  if (delta.unidadMedida) effectiveDetalles[existingIdx].unidadMedida = delta.unidadMedida;
                } else {
                  effectiveDetalles.push({
                    idInsumo: delta.idInsumo,
                    cantidad: deltaQty,
                    unidadMedida: delta.unidadMedida || delta.insumo?.unidadMedida || 'und',
                    insumo: delta.insumo
                  });
                }
              } else if (deltaAccion === 'QUITAR') {
                effectiveDetalles = effectiveDetalles.filter(det => Number(det.idInsumo) !== Number(delta.idInsumo));
              }
            }

            const customFicha = {
              ...(fichaBase.toJSON ? fichaBase.toJSON() : fichaBase),
              detalles: effectiveDetalles
            };
            return {
              ficha: customFicha,
              targetProductId: finalProdId,
              resolvedName: varRow?.nombre ? `${varRow.nombre}` : null
            };
          }

          return { ficha: fichaBase, targetProductId: finalProdId, resolvedName: varRow?.nombre };
        }
      } catch (e) {}
    }

    return { ficha: null, targetProductId: finalProdId };
  }

  static async updateTiempoEntrega(id, tiempoEstimadoEntrega, modoTiempoEntrega = null) {
    const v = await Venta.findByPk(id);
    if (!v) {
      const error = new Error('Venta no encontrada');
      error.statusCode = 404;
      throw error;
    }
    const raw = String(tiempoEstimadoEntrega || '').trim();
    const rawModo = String(modoTiempoEntrega || '').trim().toUpperCase();
    const isAutoLiteral =
      raw.toUpperCase() === 'AUTO' ||
      raw.toUpperCase() === 'AUTOMATICO' ||
      raw.toUpperCase() === 'AUTOMÁTICO';
    const isAutoSwitch = rawModo === 'AUTO' || isAutoLiteral;

    if (!isAutoSwitch && (!raw || raw.length > 50 || /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(raw) || /[^a-zA-Z0-9\s.,\-áéíóúñÁÉÍÓÚÑ]/i.test(raw) || /\.{2,}|-{2,}/.test(raw))) {
      const error = new Error('Formato de tiempo de entrega no válido.');
      error.statusCode = 400;
      throw error;
    }
    let obsData = {};
    try {
      obsData = typeof v.observaciones === 'string' && v.observaciones.startsWith('{')
        ? JSON.parse(v.observaciones)
        : { nota: v.observaciones || '' };
    } catch (e) {
      obsData = { nota: v.observaciones || '' };
    }

    if (isAutoSwitch) {
      const hybridEst = computeHybridDeliveryEstimate({
        productos: Array.isArray(obsData.productos) ? obsData.productos : [],
        tipoEntrega: obsData.tipoEntrega || (v.tipoVenta === 'DOMICILIO' ? 'Domicilio' : 'En Mesa'),
        estadoEntrega: v.estadoEntrega || 'PENDIENTE',
        savedTiempo: '',
        savedModo: 'AUTO'
      });
      const finalAutoTime = (!isAutoLiteral && raw) ? raw : hybridEst.autoEstimate;
      obsData.modoTiempoEntrega = 'AUTO';
      obsData.tiempoEstimadoEntrega = finalAutoTime;
      v.tiempoEstimadoEntrega = finalAutoTime;
    } else {
      obsData.modoTiempoEntrega = 'MANUAL';
      obsData.tiempoEstimadoEntrega = raw;
      v.tiempoEstimadoEntrega = raw;
    }

    v.observaciones = JSON.stringify(obsData);
    await v.save();
    return this.getById(id);
  }

  static async cancelar(id) {
    return this.updateEstado(id, 'CANCELADO');
  }

  /**
   * Registra la compra en el programa de fidelidad una única vez por venta (idempotente).
   * Evita el doble conteo cuando el webhook de Wompi, la verificación manual y la aprobación
   * del administrador se ejecutan sobre la misma venta (Ítem #119).
   */
  static async registrarFidelidadUnaVez(idVenta) {
    const { sequelize } = require('../../persistence/models');
    const transaction = await sequelize.transaction();
    let idClienteARegistrar = null;
    try {
      const v = await Venta.findByPk(idVenta, { transaction, lock: transaction.LOCK.UPDATE });
      if (!v || !v.idCliente) {
        await transaction.commit();
        return false;
      }
      let obsData = {};
      try {
        obsData = typeof v.observaciones === 'string' && v.observaciones.startsWith('{')
          ? JSON.parse(v.observaciones)
          : { nota: v.observaciones || '' };
      } catch (e) {
        obsData = { nota: v.observaciones || '' };
      }
      const clienteNombre = String(obsData.clienteNombre || '').toLowerCase();
      if (obsData.fidelidadContabilizada || clienteNombre.includes('mostrador')) {
        await transaction.commit();
        return false;
      }
      const clienteRow = await Cliente.findByPk(v.idCliente, { transaction });
      if (!clienteRow || !clienteRow.idUsuario) {
        await transaction.commit();
        return false;
      }
      obsData.fidelidadContabilizada = true;
      obsData.fechaFidelidadContabilizada = new Date().toISOString();
      v.observaciones = JSON.stringify(obsData);
      await v.save({ transaction });
      await transaction.commit();
      idClienteARegistrar = v.idCliente;
    } catch (err) {
      await transaction.rollback().catch(() => {});
      console.warn('Error marcando fidelidad de la venta:', err.message);
      return false;
    }

    if (idClienteARegistrar) {
      const ClienteService = require('./clienteService');
      await ClienteService.registrarCompraFidelidad(idClienteARegistrar).catch(err =>
        console.warn('Error registrando fidelidad:', err.message)
      );
      return true;
    }
    return false;
  }

  /**
   * Aprueba manualmente el pago de una venta pendiente (ej. transferencias o pagos verificados),
   * pasándola a Producción (Ítem #116).
   */
  static async aprobarPago(id, usuarioAprobador = null) {
    const { Pago } = require('../../persistence/models');
    const v = await Venta.findByPk(id);
    if (!v) {
      const error = new Error('Venta no encontrada');
      error.statusCode = 404;
      throw error;
    }
    if (v.estadoEntrega === 'CANCELADO' || v.estadoAprobacion === 'RECHAZADO') {
      const error = new Error('No se puede aprobar el pago de una venta anulada o rechazada.');
      error.statusCode = 400;
      throw error;
    }
    if (v.estadoAprobacion === 'APROBADO') {
      const error = new Error('El pago de esta venta ya fue aprobado.');
      error.statusCode = 400;
      throw error;
    }

    let obsData = {};
    try {
      obsData = typeof v.observaciones === 'string' && v.observaciones.startsWith('{')
        ? JSON.parse(v.observaciones)
        : { nota: v.observaciones || '' };
    } catch (e) {
      obsData = { nota: v.observaciones || '' };
    }

    const ahora = new Date();
    const horaActual = formatColombiaTime(ahora);
    obsData.estadoPago = 'Pagado';
    obsData.estadoAprobacion = 'APROBADO';
    obsData.horaEstado = horaActual;
    obsData.fechaCambioEstado = ahora.toISOString();
    obsData.fechaAprobacionPago = ahora.toISOString();
    obsData.aprobadoPor = usuarioAprobador
      ? `${usuarioAprobador.nombre || ''} ${usuarioAprobador.apellidos || ''}`.trim() || 'Administrador'
      : 'Administrador';
    if (!Array.isArray(obsData.historialEstados)) obsData.historialEstados = [];
    obsData.historialEstados.push({ estado: 'PAGO_APROBADO', hora: horaActual, fecha: ahora.toISOString() });

    v.estadoAprobacion = 'APROBADO';
    if (!v.estadoEntrega || v.estadoEntrega === 'PENDIENTE') {
      v.estadoEntrega = 'PENDIENTE';
    }
    v.observaciones = JSON.stringify(obsData);
    await v.save();

    try {
      await Pago.update({ estado: 'APROBADO' }, { where: { idVenta: v.idVenta } });
    } catch (pagoErr) {
      console.warn('Error actualizando pagos asociados:', pagoErr.message);
    }

    await this.registrarFidelidadUnaVez(v.idVenta);

    return this.getById(v.idVenta);
  }
}

module.exports = VentaService;
