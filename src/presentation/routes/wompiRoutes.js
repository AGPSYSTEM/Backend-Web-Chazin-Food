const express = require('express');
const router = express.Router();
const {
  crearIntencionPago,
  verificarTransaccion,
  handleWebhook,
} = require('../controllers/wompiController');

// Crear intención de pago con firma de integridad SHA-256
router.post('/intencion', crearIntencionPago);

// Consultar y verificar estado de una transacción Wompi
router.get('/verificar/:idTransaccion', verificarTransaccion);

// Webhook para recepción de notificaciones asíncronas de Wompi
router.post('/webhook', handleWebhook);

module.exports = router;
