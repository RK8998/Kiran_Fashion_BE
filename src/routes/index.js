const express = require('express');
const router = express.Router();

const { productRoutes } = require('./products');
const { userRoutes } = require('./users');
const { authRoutes } = require('./auth');
const { notesRoutes } = require('./notes');
const { salesRoutes } = require('./sales');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/notes', notesRoutes);
router.use('/sales', salesRoutes);

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
