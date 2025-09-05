// import mongoose from 'mongoose';
const mongoose = require('mongoose');
const { NODE_ENV, DEVELOPMENT_DB_URI, PRODUCTION_DB_URI } = require('../constant/env.constant');

const connection = mongoose.connection;

const dbURI = NODE_ENV === 'development' ? DEVELOPMENT_DB_URI : PRODUCTION_DB_URI;
const databaseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false
};

const initializeDBConnection = () => {
  mongoose.connect(dbURI, databaseOptions);

  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
  }
};

connection.on('connected', () => {
  console.log(`MongoDB connected at kiran_fashion DB [${NODE_ENV}]`);
});

connection.on('disconnected', () => {
  console.log(`MongoDB connected at ${dbURI}`);
});

connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
});

module.exports = { initializeDBConnection };
