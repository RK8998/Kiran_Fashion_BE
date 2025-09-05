module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  DEVELOPMENT_DB_URI: process.env.DEVELOPMENT_DB_URI,
  PRODUCTION_DB_URI: process.env.PRODUCTION_DB_URI,

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
};
