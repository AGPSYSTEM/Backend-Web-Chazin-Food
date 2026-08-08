// In-memory store for production orders initialized with sample data matching the reference mockup
let ordenesProduccion = [
  {
    id: 1,
    codigo: "OP-001",
    platilloNombre: "Hamburguesa Especial",
    imagen: "🍔",
    cantidad: 2,
    responsable: "Carlos R.",
    cocinero: "Carlos R.",
    tiempo: "15 min",
    fecha: "2026-06-23",
    horaInicio: "10:15",
    prioridad: "Alta",
    estado: "En Preparación",
    alerta: true,
    observaciones: "Sin cebolla, queso extra",
    ingredientes: [
      { nombre: "Pan de hamburguesa artesanal", cantidad: "2 unidades" },
      { nombre: "Carne de res 150g", cantidad: "2 unidades" },
      { nombre: "Queso cheddar", cantidad: "4 lonchas" },
      { nombre: "Salsa especial de la casa", cantidad: "2 porciones" }
    ]
  },
  {
    id: 2,
    codigo: "OP-002",
    platilloNombre: "Pollo Broaster",
    imagen: "🍗",
    cantidad: 1,
    responsable: "María G.",
    cocinero: "María G.",
    tiempo: "20 min",
    fecha: "2026-06-23",
    horaInicio: "10:00",
    prioridad: "Media",
    estado: "En Preparación",
    alerta: false,
    observaciones: "Papas crujientes",
    ingredientes: [
      { nombre: "Presas de pollo apanado", cantidad: "4 piezas" },
      { nombre: "Papas a la francesa", cantidad: "1 porción (250g)" },
      { nombre: "Ensalada coleslaw", cantidad: "1 porción" }
    ]
  },
  {
    id: 3,
    codigo: "OP-003",
    platilloNombre: "Salchipapa Grande",
    imagen: "🍟",
    cantidad: 3,
    responsable: "Carlos R.",
    cocinero: "Carlos R.",
    tiempo: "10 min",
    fecha: "2026-06-23",
    horaInicio: "09:45",
    prioridad: "Normal",
    estado: "Listo",
    alerta: false,
    observaciones: "Salsa tártara aparte",
    ingredientes: [
      { nombre: "Papas amarillas fritas", cantidad: "3 porciones" },
      { nombre: "Salchicha manguera premium", cantidad: "6 unidades" },
      { nombre: "Queso costeño rallado", cantidad: "3 porciones" },
      { nombre: "Salsa tártara y rosada", cantidad: "3 porciones" }
    ]
  },
  {
    id: 4,
    codigo: "OP-004",
    platilloNombre: "Combo Familiar",
    imagen: "🍱",
    cantidad: 1,
    responsable: "Juan P.",
    cocinero: "Juan P.",
    tiempo: "25 min",
    fecha: "2026-06-23",
    horaInicio: "09:30",
    prioridad: "Alta",
    estado: "Despachado",
    alerta: true,
    observaciones: "Para llevar con cubiertos",
    ingredientes: [
      { nombre: "Hamburguesas sencillas", cantidad: "2 unidades" },
      { nombre: "Perros calientes", cantidad: "2 unidades" },
      { nombre: "Papas familiares", cantidad: "1 porción grande" },
      { nombre: "Gaseosa 1.5L", cantidad: "1 botella" }
    ]
  },
  {
    id: 5,
    codigo: "OP-005",
    platilloNombre: "Perro Caliente",
    imagen: "🌭",
    cantidad: 2,
    responsable: "María G.",
    cocinero: "María G.",
    tiempo: "12 min",
    fecha: "2026-06-23",
    horaInicio: "09:50",
    prioridad: "Normal",
    estado: "Entregado",
    alerta: false,
    observaciones: "Con tocineta extra",
    ingredientes: [
      { nombre: "Pan de hot dog", cantidad: "2 unidades" },
      { nombre: "Salchicha", cantidad: "2 unidades" },
      { nombre: "Aderezos", cantidad: "2 porciones" }
    ]
  },
  {
    id: 6,
    codigo: "OP-006",
    platilloNombre: "Pizza Familiar Combo",
    imagen: "🍕",
    cantidad: 1,
    responsable: "Ana M.",
    cocinero: "Ana M.",
    tiempo: "35 min",
    fecha: "2026-06-23",
    horaInicio: "09:10",
    prioridad: "Normal",
    estado: "Entregado",
    alerta: false,
    observaciones: "Mesa 4",
    ingredientes: [
      { nombre: "Masa de pizza familiar", cantidad: "1 unidad" },
      { nombre: "Queso mozzarella", cantidad: "300g" },
      { nombre: "Jamón y pepperoni", cantidad: "200g" }
    ]
  },
  {
    id: 7,
    codigo: "OP-007",
    platilloNombre: "Gaseosa Coca Cola 1.5L",
    imagen: "🥤",
    cantidad: 4,
    responsable: "Pedro S.",
    cocinero: "Pedro S.",
    tiempo: "2 min",
    fecha: "2026-06-23",
    horaInicio: "10:30",
    prioridad: "Normal",
    estado: "En Cola",
    alerta: false,
    observaciones: "Bien fría",
    ingredientes: [
      { nombre: "Botella Coca Cola 1.5L", cantidad: "4 unidades" }
    ]
  },
  {
    id: 8,
    codigo: "OP-008",
    platilloNombre: "Hamburguesa Doble Carne",
    imagen: "🍔",
    cantidad: 1,
    responsable: "Carlos R.",
    cocinero: "Carlos R.",
    tiempo: "15 min",
    fecha: "2026-06-23",
    horaInicio: "10:32",
    prioridad: "Alta",
    estado: "En Cola",
    alerta: true,
    observaciones: "Término medio",
    ingredientes: [
      { nombre: "Pan brioche", cantidad: "1 unidad" },
      { nombre: "Carne de res 150g", cantidad: "2 unidades" },
      { nombre: "Queso cheddar", cantidad: "2 lonchas" }
    ]
  }
];

class ProduccionService {
  /*Devuelve todas las órdenes de producción almacenadas en memoria. */
  static async getAll() {
    return ordenesProduccion;
  }
  /*Crea una nueva orden de producción, genera un ID automáticamente,
   asigna valores por defecto cuando es necesario y la agrega al arreglo de órdenes. */
  static async create(data) {
    const nextId = ordenesProduccion.length > 0 ? Math.max(...ordenesProduccion.map((o) => Number(o.id) || 0)) + 1 : 1;
    const newOrden = {
      id: nextId,
      codigo: data.codigo || `OP-00${nextId}`,
      platilloNombre: data.platilloNombre || data.nombre || "Nuevo Platillo",
      imagen: data.imagen || "🍔",
      cantidad: Number(data.cantidad) || 1,
      responsable: data.responsable || "Carlos R.",
      cocinero: data.responsable || "Carlos R.",
      tiempo: data.tiempo || "15 min",
      fecha: new Date().toISOString().split("T")[0],
      horaInicio: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      prioridad: data.prioridad || "Normal",
      estado: data.estado || "En Cola",
      alerta: Boolean(data.alerta),
      observaciones: data.observaciones || "",
      ingredientes: [
        { nombre: "Ingrediente principal", cantidad: `${Number(data.cantidad) || 1} unidades` },
        { nombre: "Acompañamiento", cantidad: "1 porción" }
      ]
    };
    ordenesProduccion.push(newOrden);
    return newOrden;
  }
  /*Busca una orden por su ID y actualiza únicamente su estado, por ejemplo de 'En Cola' a 'En Preparación' o 'Listo'. */
  static async updateEstado(id, nuevoEstado) {
    const numericId = Number(id);
    const index = ordenesProduccion.findIndex((o) => String(o.id) === String(id) || o.id === numericId);
    if (index !== -1) {
      ordenesProduccion[index].estado = nuevoEstado;
      return ordenesProduccion[index];
    }
    return { id, estado: nuevoEstado, message: "Estado actualizado" };
  }
  /*Elimina una orden de producción del arreglo utilizando su ID. */
  static async delete(id) {
    ordenesProduccion = ordenesProduccion.filter((o) => String(o.id) !== String(id));
    return { message: "Orden de producción eliminada" };
  }
}

module.exports = ProduccionService;
