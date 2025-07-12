const express = require('express');
const router = express.Router();

const {
  createUserController,
  getUsersListController,
  getUsersByIdController,
  deleteUsersByIdController,
  updateUserController
} = require('../controllers/users.controller');
const { authenticate } = require('../middleware/authenticate');

router.get('/', authenticate, getUsersListController);
router.get('/:id', authenticate, getUsersByIdController);
router.post('/', authenticate, createUserController);
router.put('/:id', authenticate, updateUserController);
router.delete('/:id', authenticate, deleteUsersByIdController);

module.exports = { userRoutes: router };
