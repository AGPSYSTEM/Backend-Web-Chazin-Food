/**
 * Servicio Centralizado de Fidelización de Clientes (Loyalty & Streak Engine)
 * Reglas de negocio:
 * - Nuevo (0% desc): Requiere 3 compras para subir a Regular.
 * - Regular (5% desc): Dura 1 mes (30 días). Si expira sin compras, baja a Nuevo (sin días de gracia extra).
 * - Frecuente (10% desc): Requiere 3 compras en Regular. Dura 1 mes (30 días). Al expirar, tiene 10 días de gracia; si vence, baja a Regular.
 * - VIP (15% desc): Requiere 3 compras en Frecuente. Dura 1 mes (30 días). Al expirar, tiene 15 días de gracia; si vence, baja a Frecuente (con sus 10 días de gracia).
 * - Cada vez que se sube de nivel o se renueva con 3 compras, se restablece el mes (30 días completos).
 */

const NIVELES_CONFIG = {
  Nuevo: {
    nombre: "Nuevo",
    descuento: 0,
    comprasParaSubir: 3,
    siguienteNivel: "Regular",
    diasVigencia: null,
    diasGracia: 0,
    nivelInferior: "Nuevo"
  },
  Regular: {
    nombre: "Regular",
    descuento: 5,
    comprasParaSubir: 3,
    siguienteNivel: "Frecuente",
    diasVigencia: 30,
    diasGracia: 0,
    nivelInferior: "Nuevo"
  },
  Frecuente: {
    nombre: "Frecuente",
    descuento: 10,
    comprasParaSubir: 3,
    siguienteNivel: "VIP",
    diasVigencia: 30,
    diasGracia: 10,
    nivelInferior: "Regular"
  },
  VIP: {
    nombre: "VIP",
    descuento: 15,
    comprasParaSubir: 3,
    siguienteNivel: "VIP", // Top tier
    diasVigencia: 30,
    diasGracia: 15,
    nivelInferior: "Frecuente"
  }
};

class FidelidadService {
  /**
   * Normaliza y evalúa el estado de fidelidad del cliente según fechas actuales
   */
  static evaluarEstadoFidelidad(fidelidadData = {}, totalVentasReales = 0) {
    const now = new Date();
    let tipo = fidelidadData.tipo || "Nuevo";
    if (tipo === "NUEVO") tipo = "Nuevo";
    if (tipo === "REGULAR") tipo = "Regular";
    if (tipo === "FRECUENTE") tipo = "Frecuente";
    if (tipo === "vip") tipo = "VIP";

    let comprasCiclo = Number(fidelidadData.comprasCiclo || 0);
    let comprasTotales = Number(fidelidadData.comprasTotales || totalVentasReales || 0);
    let fechaInicio = fidelidadData.fechaInicioNivel ? new Date(fidelidadData.fechaInicioNivel) : new Date();
    let fechaVencimiento = fidelidadData.fechaVencimientoNivel ? new Date(fidelidadData.fechaVencimientoNivel) : null;

    // Si es un cliente antiguo sin fecha de vencimiento pero con nivel asignado
    if (!fechaVencimiento && tipo !== "Nuevo") {
      fechaVencimiento = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    let enGracia = false;
    let diasRestantes = null;
    let diasGraciaRestantes = 0;
    let estadoCiclo = "ACTIVO"; // 'ACTIVO' | 'EN_GRACIA' | 'EXPIRADO'

    // Evaluación para clientes en niveles con vigencia (Regular, Frecuente, VIP)
    if (tipo !== "Nuevo" && fechaVencimiento) {
      const msDiff = fechaVencimiento.getTime() - now.getTime();
      const diasVigenciaRestantes = Math.ceil(msDiff / (1000 * 60 * 60 * 24));

      if (diasVigenciaRestantes > 0) {
        // Nivel activo dentro del mes
        diasRestantes = diasVigenciaRestantes;
        enGracia = false;
        estadoCiclo = "ACTIVO";
      } else {
        // El mes venció, evaluar periodos de gracia
        const diasExpirado = Math.abs(diasVigenciaRestantes);

        if (tipo === "VIP") {
          const limiteGraciaVIP = 15;
          if (diasExpirado <= limiteGraciaVIP) {
            // Está en periodo de gracia VIP de 15 días
            enGracia = true;
            diasGraciaRestantes = Math.max(1, limiteGraciaVIP - diasExpirado);
            diasRestantes = 0;
            estadoCiclo = "EN_GRACIA";
          } else {
            // Pasaron los 15 días de gracia de VIP -> Baja a Frecuente
            const diasExcedidosFrecuente = diasExpirado - limiteGraciaVIP;
            const limiteGraciaFrecuente = 10;

            if (diasExcedidosFrecuente <= limiteGraciaFrecuente) {
              // Ahora está en periodo de gracia de Frecuente (10 días)
              tipo = "Frecuente";
              enGracia = true;
              diasGraciaRestantes = Math.max(1, limiteGraciaFrecuente - diasExcedidosFrecuente);
              diasRestantes = 0;
              estadoCiclo = "EN_GRACIA";
              comprasCiclo = 0;
            } else {
              // Pasaron también los 10 días de gracia -> Baja a Regular
              tipo = "Regular";
              enGracia = false;
              diasGraciaRestantes = 0;
              diasRestantes = 30; // Nuevo ciclo de 1 mes en Regular
              fechaVencimiento = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
              fechaInicio = now;
              estadoCiclo = "ACTIVO";
              comprasCiclo = 0;
            }
          }
        } else if (tipo === "Frecuente") {
          const limiteGraciaFrecuente = 10;
          if (diasExpirado <= limiteGraciaFrecuente) {
            // Está en periodo de gracia Frecuente de 10 días
            enGracia = true;
            diasGraciaRestantes = Math.max(1, limiteGraciaFrecuente - diasExpirado);
            diasRestantes = 0;
            estadoCiclo = "EN_GRACIA";
          } else {
            // Pasaron los 10 días -> Baja a Regular
            tipo = "Regular";
            enGracia = false;
            diasGraciaRestantes = 0;
            diasRestantes = 30;
            fechaVencimiento = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            fechaInicio = now;
            estadoCiclo = "ACTIVO";
            comprasCiclo = 0;
          }
        } else if (tipo === "Regular") {
          // Regular no tiene días de gracia extra -> Baja directo a Nuevo
          tipo = "Nuevo";
          enGracia = false;
          diasGraciaRestantes = 0;
          diasRestantes = null;
          fechaVencimiento = null;
          estadoCiclo = "ACTIVO";
          comprasCiclo = 0;
        }
      }
    }

    const config = NIVELES_CONFIG[tipo] || NIVELES_CONFIG.Nuevo;
    const comprasParaSiguiente = config.comprasParaSubir - (comprasCiclo % config.comprasParaSubir);
    const progresoPorcentaje = Math.min(100, Math.round(((comprasCiclo % config.comprasParaSubir) / config.comprasParaSubir) * 100));

    return {
      tipo,
      descuentoPorcentaje: config.descuento,
      comprasCiclo: comprasCiclo % config.comprasParaSubir,
      comprasTotales,
      comprasFaltantes: comprasParaSiguiente === 0 ? 3 : comprasParaSiguiente,
      comprasMeta: config.comprasParaSubir,
      progresoPorcentaje,
      siguienteNivel: config.siguienteNivel,
      fechaInicioNivel: fechaInicio ? fechaInicio.toISOString() : null,
      fechaVencimientoNivel: fechaVencimiento ? fechaVencimiento.toISOString() : null,
      diasRestantes,
      enGracia,
      diasGraciaRestantes,
      estadoCiclo
    };
  }

  /**
   * Registra una compra aprobada/completada y actualiza el nivel de fidelidad
   */
  static registrarCompra(fidelidadActual = {}) {
    const estado = this.evaluarEstadoFidelidad(fidelidadActual);
    const now = new Date();

    let nuevoTipo = estado.tipo;
    let nuevoComprasCiclo = (estado.comprasCiclo || 0) + 1;
    let comprasTotales = (estado.comprasTotales || 0) + 1;
    let ascendio = false;
    let renovo = false;

    // Si compra durante el periodo de gracia, reactiva su nivel con 1 mes limpio
    if (estado.enGracia) {
      renovo = true;
      nuevoComprasCiclo = 1; // 1ra compra de su nuevo ciclo reactivado
    } else if (nuevoComprasCiclo >= 3) {
      if (nuevoTipo === "Nuevo") {
        nuevoTipo = "Regular";
        ascendio = true;
      } else if (nuevoTipo === "Regular") {
        nuevoTipo = "Frecuente";
        ascendio = true;
      } else if (nuevoTipo === "Frecuente") {
        nuevoTipo = "VIP";
        ascendio = true;
      } else if (nuevoTipo === "VIP") {
        // En VIP se renueva la membresía mensual (no acumula tiempo extra, inicia 30 días limpios)
        nuevoTipo = "VIP";
        renovo = true;
      }
      nuevoComprasCiclo = 0;
    }

    // Regla de NO SUMAR TIEMPO ACUMULADO:
    // Si asciende o renueva, inicia un nuevo mes limpio de 30 días (now + 30d).
    // Si es una compra intermedia dentro de su mes activo, NO altera la fecha de vencimiento original.
    let nuevaFechaVencimiento = fidelidadActual.fechaVencimientoNivel 
      ? new Date(fidelidadActual.fechaVencimientoNivel) 
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (ascendio || renovo || !fidelidadActual.fechaVencimientoNivel || estado.enGracia || nuevoTipo !== estado.tipo) {
      nuevaFechaVencimiento = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    const config = NIVELES_CONFIG[nuevoTipo] || NIVELES_CONFIG.Nuevo;
    const msDiff = nuevaFechaVencimiento.getTime() - now.getTime();
    const diasRestantes = nuevoTipo === "Nuevo" ? null : Math.max(1, Math.ceil(msDiff / (1000 * 60 * 60 * 24)));

    return {
      tipo: nuevoTipo,
      descuentoPorcentaje: config.descuento,
      comprasCiclo: nuevoComprasCiclo,
      comprasTotales,
      comprasFaltantes: 3 - nuevoComprasCiclo,
      comprasMeta: 3,
      progresoPorcentaje: Math.round((nuevoComprasCiclo / 3) * 100),
      siguienteNivel: config.siguienteNivel,
      fechaInicioNivel: (ascendio || renovo || !fidelidadActual.fechaInicioNivel) ? now.toISOString() : fidelidadActual.fechaInicioNivel,
      fechaVencimientoNivel: nuevoTipo === "Nuevo" ? null : nuevaFechaVencimiento.toISOString(),
      diasRestantes,
      enGracia: false,
      diasGraciaRestantes: 0,
      estadoCiclo: "ACTIVO",
      ascendio,
      renovo
    };
  }

  /**
   * Obtiene la configuración de todos los niveles para mostrar en la UI
   */
  static getCatalogoNiveles() {
    return [
      {
        nivel: "Nuevo",
        descuento: 0,
        badge: "🌱",
        descripcion: "Nivel inicial para clientes que comienzan su experiencia en Chazin Food.",
        requisito: "0 - 2 compras",
        duracion: "Permanente hasta alcanzar 3 compras"
      },
      {
        nivel: "Regular",
        descuento: 5,
        badge: "🥉",
        descripcion: "5% de descuento en todos tus pedidos.",
        requisito: "3 compras en nivel Nuevo",
        duracion: "1 mes (30 días). Si no compras en el mes, baja a Nuevo."
      },
      {
        nivel: "Frecuente",
        descuento: 10,
        badge: "🥈",
        descripcion: "10% de descuento en todos tus pedidos.",
        requisito: "3 compras en nivel Regular",
        duracion: "1 mes (30 días) + 10 días de gracia extra para mantener la racha."
      },
      {
        nivel: "VIP",
        descuento: 15,
        badge: "🥇",
        descripcion: "15% de descuento exclusivo en todos tus pedidos.",
        requisito: "3 compras en nivel Frecuente",
        duracion: "1 mes (30 días) + 15 días de gracia extra para mantener la racha."
      }
    ];
  }
}

module.exports = FidelidadService;
