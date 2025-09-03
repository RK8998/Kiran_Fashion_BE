require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { initializeDBConnection } = require('./database');
const initRoutes = require('./routes');

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

initializeDBConnection();

app.use('/api', initRoutes);

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}/api`);
// });

// ✅ DO NOT use app.listen() on Vercel
module.exports = app;
