// In-memory store for production orders initialized with sample data matching the reference mockup
let ordenesProduccion = [
  {
    id: 1,
    codigo: "OP-001",
    platilloNombre: "Hamburguesa Especial",
    imagen: "🍔",
    cantidad: 2,
    responsable: "Carlos R.",
    tiempo: "15min",
    prioridad: "Alta",
    estado: "En Preparación",
    alerta: true,
    observaciones: "Sin cebolla, queso extra"
  },
  {
    id: 2,
    codigo: "OP-002",
    platilloNombre: "Pollo Broaster",
    imagen: "🍗",
    cantidad: 1,
    responsable: "María G.",
    tiempo: "20min",
    prioridad: "Media",
    estado: "En Preparación",
    alerta: false,
    observaciones: "Papas crujientes"
  },
  {
    id: 3,
    codigo: "OP-003",
    platilloNombre: "Salchipapa Grande",
    imagen: "🍟",
    cantidad: 3,
    responsable: "Carlos R.",
    tiempo: "10min",
    prioridad: "Normal",
    estado: "Listo",
    alerta: false,
    observaciones: "Salsa tártara aparte"
  },
  {
    id: 4,
    codigo: "OP-004",
    platilloNombre: "Combo Familiar",
    imagen: "🍱",
    cantidad: 1,
    responsable: "Juan P.",
    tiempo: "25min",
    prioridad: "Alta",
    estado: "Despachado",
    alerta: true,
    observaciones: "Para llevar con cubiertos"
  },
  {
    id: 5,
    codigo: "OP-005",
    platilloNombre: "Pizza Familiar Combo",
    imagen: "🍕",
    cantidad: 1,
    responsable: "Ana M.",
    tiempo: "35min",
    prioridad: "Normal",
    estado: "Entregado",
    alerta: false,
    observaciones: "Entregado en mesa 4"
  },
  {
    id: 6,
    codigo: "OP-006",
    platilloNombre: "Perro Caliente Especial",
    imagen: "🌭",
    cantidad: 2,
    responsable: "Pedro S.",
    tiempo: "5min",
    prioridad: "Normal",
    estado: "En Cola",
    alerta: false,
    observaciones: "Con tocineta extra"
  },
  {
    id: 7,
    codigo: "OP-007",
    platilloNombre: "Gaseosa Coca Cola 1.5L",
    imagen: "🥤",
    cantidad: 4,
    responsable: "Pedro S.",
    tiempo: "2min",
    prioridad: "Normal",
    estado: "En Cola",
    alerta: false,
    observaciones: "Bien fría"
  },
  {
    id: 8,
    codigo: "OP-008",
    platilloNombre: "Hamburguesa Doble Carne",
    imagen: "🍔",
    cantidad: 1,
    responsable: "Carlos R.",
    tiempo: "1min",
    prioridad: "Alta",
    estado: "En Cola",
    alerta: true,
    observaciones: "Término medio"
  }
];

class ProduccionService {
  static async getAll() {
    return ordenesProduccion;
  }

  static async create(data) {
    const nextId = ordenesProduccion.length > 0 ? Math.max(...ordenesProduccion.map((o) => Number(o.id) || 0)) + 1 : 1;
    const newOrden = {
      id: nextId,
      codigo: data.codigo || `OP-00${nextId}`,
      platilloNombre: data.platilloNombre || data.nombre || "Nuevo Platillo",
      imagen: data.imagen || "🍔",
      cantidad: Number(data.cantidad) || 1,
      responsable: data.responsable || "Carlos R.",
      tiempo: data.tiempo || "10min",
      prioridad: data.prioridad || "Normal",
      estado: data.estado || "En Cola",
      alerta: Boolean(data.alerta),
      observaciones: data.observaciones || ""
    };
    ordenesProduccion.push(newOrden);
    return newOrden;
  }

  static async updateEstado(id, nuevoEstado) {
    const numericId = Number(id);
    const index = ordenesProduccion.findIndex((o) => String(o.id) === String(id) || o.id === numericId);
    if (index !== -1) {
      ordenesProduccion[index].estado = nuevoEstado;
      return ordenesProduccion[index];
    }
    return { id, estado: nuevoEstado, message: "Estado actualizado" };
  }

  static async delete(id) {
    ordenesProduccion = ordenesProduccion.filter((o) => String(o.id) !== String(id));
    return { message: "Orden de producción eliminada" };
  }
}

module.exports = ProduccionService;
