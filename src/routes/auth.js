const express = require('express');
const router = express.Router();

const { loginController, getLoggedInUserDetails } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/authenticate');

router.post('/login', loginController);
router.get('/me', authenticate, getLoggedInUserDetails);

module.exports = { authRoutes: router };
