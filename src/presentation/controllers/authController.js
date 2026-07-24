const AuthService = require('../../application/services/authService');

const registerUser = async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, correo, contrasena, contraseña, password } = req.body;
    const finalEmail = email || correo;
    const finalPassword = password || contrasena || contraseña;

    const result = await AuthService.login(finalEmail, finalPassword);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const result = await AuthService.getUserProfile(req.user._id || req.user.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await AuthService.forgotPassword(req.body);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await AuthService.resetPassword(req.body);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
};
