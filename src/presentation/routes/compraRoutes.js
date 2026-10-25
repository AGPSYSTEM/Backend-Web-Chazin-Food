const express = require('express');
const router = express.Router();
const { getCompras, getCompraById, createCompra, updateCompra, cancelarCompra } = require('../controllers/compraController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(requirePrivilege(['Gestión de Compras', 'Insumos', 'Dashboard'], 'Ver'), getCompras)
  .post(requirePrivilege('Gestión de Compras', 'Crear'), createCompra);

router.route('/:id')
  .get(requirePrivilege(['Gestión de Compras', 'Insumos', 'Dashboard'], 'Ver'), getCompraById)
  .put(requirePrivilege('Gestión de Compras', 'Editar'), updateCompra);

// Nota (Ítem 84): Se retira PUT /:id/estado ya que una compra registrada no es editable
router.put('/:id/cancelar', (req, res, next) => {
  // Permitir devolución/anulación si cuenta con privilegio Editar o Eliminar en Gestión de Compras
  const userRol = String(req.user?.rol || '').toLowerCase().trim();
  if (userRol === 'administrador' || userRol === 'admin' || Number(req.user?.idRol) === 1) return next();
  const perms = Array.isArray(req.user?.permisos) ? req.user.permisos : [];
  const hasGranular = perms.some(p => p.startsWith('Gestión de Compras:'));
  if (!hasGranular && perms.includes('Gestión de Compras')) return next();
  if (perms.includes('Gestión de Compras:Editar') || perms.includes('Gestión de Compras:Eliminar')) return next();
  return res.status(403).json({ message: 'No tienes privilegios para registrar devoluciones o anulaciones de compras.' });
}, cancelarCompra);

module.exports = router;
