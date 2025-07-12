const express = require('express');
const router = express.Router();

const { userRoutes } = require('./users');
const { authRoutes } = require('./auth');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

router.get('/test-server', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Kiran Fashion API',
    status: 'success',
    data: {
      name: 'Kiran Fashion',
      version: '1.0.0',
      description: 'API for Kiran Fashion business'
    }
  });
});

module.exports = router;
