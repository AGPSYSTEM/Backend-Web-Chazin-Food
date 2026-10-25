const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, changeUserPassword, toggleUserStatus, deleteUser } = require('../controllers/userController');
const { registerUser, loginUser, forgotPassword, resetPassword, getUserProfile, updateUserProfile, googleAuth, verifyActivation, activateAccount } = require('../controllers/authController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

const allowSelfOrEditUsers = (req, res, next) => {
  if (req.user && String(req.user.id || req.user.idUsuario) === String(req.params.id)) {
    return next();
  }
  return requirePrivilege('Usuarios', 'Editar')(req, res, next);
};

router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/registro', registerUser);
router.post('/register', registerUser);
router.post('/recuperar-contrasena', forgotPassword);
router.post('/forgot-password', forgotPassword);
router.post('/restablecer-contrasena', resetPassword);
router.post('/reset-password', resetPassword);
router.get('/verificar-activacion', verifyActivation);
router.post('/activar-cuenta', activateAccount);

// Perfil de usuario autenticado
router.route('/perfil')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/')
  .get(protect, getUsers)
  .post(protect, requirePrivilege('Usuarios', 'Crear'), createUser);

router.route('/:id')
  .get(protect, getUserById)
  .put(protect, allowSelfOrEditUsers, updateUser)
  .delete(protect, requirePrivilege('Usuarios', 'Eliminar'), deleteUser);

router.put('/:id/password', protect, allowSelfOrEditUsers, changeUserPassword);
router.put('/:id/contrasena', protect, allowSelfOrEditUsers, changeUserPassword);
router.patch('/:id/password', protect, allowSelfOrEditUsers, changeUserPassword);
router.patch('/:id/contrasena', protect, allowSelfOrEditUsers, changeUserPassword);

router.patch('/:id/estado', protect, requirePrivilege('Usuarios', 'Editar'), toggleUserStatus);
router.put('/:id/estado', protect, requirePrivilege('Usuarios', 'Editar'), toggleUserStatus);

module.exports = router;
