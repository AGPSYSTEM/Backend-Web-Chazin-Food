const EventoService = require('../../application/services/eventoService');

class EventoController {
  static async getAll(req, res, next) {
    try {
      const result = await EventoService.getAll();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const result = await EventoService.getById(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const result = await EventoService.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const result = await EventoService.update(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const result = await EventoService.delete(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = EventoController;
