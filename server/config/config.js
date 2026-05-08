require('dotenv').config();



const DATABASE = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    timezone: '+05:30',
};

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax', // for production set it as none 
  maxAge: Number(process.env.JWT_EXPIRES) * 1000,
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax', // for production set it as none
  maxAge: Number(process.env.JWT_REFRESH_EXPIRES) * 1000,
};


module.exports = {
  development_db_config: DATABASE,
  test_db_config: DATABASE,
  production_db_config: DATABASE,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS
};