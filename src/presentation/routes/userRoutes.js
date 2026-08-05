const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, changeUserPassword, toggleUserStatus, deleteUser } = require('../controllers/userController');
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/registro', registerUser);
router.post('/register', registerUser);
router.post('/recuperar-contrasena', forgotPassword);
router.post('/forgot-password', forgotPassword);
router.post('/restablecer-contrasena', resetPassword);
router.post('/reset-password', resetPassword);

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.put('/:id/password', changeUserPassword);
router.put('/:id/contrasena', changeUserPassword);
router.patch('/:id/password', changeUserPassword);
router.patch('/:id/contrasena', changeUserPassword);

router.patch('/:id/estado', toggleUserStatus);
router.put('/:id/estado', toggleUserStatus);

module.exports = router;
