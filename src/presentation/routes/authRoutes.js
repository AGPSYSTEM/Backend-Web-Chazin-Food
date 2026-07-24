const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../../infrastructure/middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/registro', registerUser);
router.post('/login', loginUser);
router.post('/recuperar-contrasena', forgotPassword);
router.post('/forgot-password', forgotPassword);
router.post('/restablecer-contrasena', resetPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getUserProfile);
router.get('/perfil', protect, getUserProfile);

module.exports = router;
