const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const { getDashboardDataController } = require('../controllers/dashboard.controller');

router.get('/', authenticate, getDashboardDataController);

module.exports = { dashboardRoutes: router };
