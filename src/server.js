require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
