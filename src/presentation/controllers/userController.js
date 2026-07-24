const UserService = require('../../application/services/userService');

const getUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const newUser = await UserService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const updatedUser = await UserService.toggleStatus(req.params.id, estado);
    res.json(updatedUser);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const result = await UserService.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
};
