require("dotenv").config();


const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
};

const DATABASE = {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres',
    logging: false,
    timezone: '+05:30',
};


const ACCESS_TOKEN_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: Number(process.env.JWT_EXPIRES) * 1000, // Convert seconds to milliseconds
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES) * 1000, // Convert seconds to milliseconds
};

const CLEAR_AUTH_COOKIE_OPTIONS = COOKIE_OPTIONS;

const ALLOWED_CORS_ORIGINS = [
  "*", // given all for now later change to specific origins
];

const SERVER_PORT = process.env.PORT || 5000;

module.exports = {
  development_db_config: DATABASE,
  test_db_config: DATABASE,
  production_db_config: DATABASE,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  CLEAR_AUTH_COOKIE_OPTIONS,
  ALLOWED_CORS_ORIGINS,
  SERVER_PORT,
};
