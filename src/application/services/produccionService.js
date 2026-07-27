// Producción service - Returns empty data since the production table doesn't exist yet.
// This prevents 404 errors in the frontend while the module is being developed.

class ProduccionService {
  static async getAll() {
    return [];
  }

  static async create(data) {
    return {
      id: Date.now(),
      codigo: `PROD-${String(Date.now()).slice(-4)}`,
      estado: 'PENDIENTE',
      ...data,
      fechaCreacion: new Date()
    };
  }

  static async updateEstado(id, estado) {
    return { id, estado, message: 'Estado actualizado' };
  }

  static async delete(id) {
    return { message: 'Orden de producción eliminada' };
  }
}

module.exports = ProduccionService;
