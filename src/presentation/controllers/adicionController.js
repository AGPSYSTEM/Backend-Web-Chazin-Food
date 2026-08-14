const AdicionService = require('../../application/services/adicionService');

class AdicionController {
  static async getAll(req, res, next) {
    try {
      const adiciones = await AdicionService.getAll();
      res.json(adiciones);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const adicion = await AdicionService.getById(req.params.id);
      res.json(adicion);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const adicion = await AdicionService.create(req.body);
      res.status(201).json(adicion);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const adicion = await AdicionService.update(req.params.id, req.body);
      res.json(adicion);
    } catch (error) {
      next(error);
    }
  }

  static async softDelete(req, res, next) {
    try {
      const result = await AdicionService.softDelete(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdicionController;
