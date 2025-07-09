const express = require('express');
const router = express.Router();

const { createUserController, getUsersListController } = require('../controllers/users.controller');
const { authenticate } = require('../middleware/authenticate');

router.get('/', authenticate, getUsersListController);
router.post('/', authenticate, createUserController);

module.exports = { userRoutes: router };
