// import mongoose from 'mongoose';
const mongoose = require('mongoose');

const connection = mongoose.connection;

const dbURI = process.env.DB_URI;
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
  console.log(`MongoDB connected at kiran_fashion DB`);
});

connection.on('disconnected', () => {
  console.log(`MongoDB connected at ${dbURI}`);
});

connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
});

module.exports = { initializeDBConnection };
