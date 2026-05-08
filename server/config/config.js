require('dotenv').config();

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

const getEnvValue = (key, fallbackValue = '') => {
  return String(process.env[key] || fallbackValue).split('#')[0].trim();
};

const parseDurationMs = (value, fallbackValue) => {
  const rawValue = String(value || fallbackValue).split('#')[0].trim();
  const match = rawValue.match(/^(\d+)(ms|s|m|h|d)?$/i);

  if (!match) {
    return parseDurationMs(fallbackValue, '0s');
  }

  const amount = Number(match[1]);
  const unit = (match[2] || 's').toLowerCase();

  const multipliers = {
    ms: 1,
    s: SECOND_IN_MS,
    m: MINUTE_IN_MS,
    h: HOUR_IN_MS,
    d: DAY_IN_MS,
  };

  return amount * multipliers[unit];
};

const isProduction = getEnvValue('NODE_ENV') === 'production';


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

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  path: '/',
};

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: parseDurationMs(getEnvValue('JWT_EXPIRES'), '15m'),
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: parseDurationMs(
    getEnvValue('JWT_REFRESH_EXPIRES', getEnvValue('REFRESH_TOKEN_EXPIRES')),
    '7d'
  ),
};

const CLEAR_AUTH_COOKIE_OPTIONS = COOKIE_OPTIONS;

const DEFAULT_CORS_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
];

const CORS_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const CORS_OPTIONS = {
  origin(origin, callback) {
    const allowedOrigins = CORS_ORIGINS.length ? CORS_ORIGINS : DEFAULT_CORS_ORIGINS;

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};


module.exports = {
  development_db_config: DATABASE,
  test_db_config: DATABASE,
  production_db_config: DATABASE,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  CLEAR_AUTH_COOKIE_OPTIONS,
  CORS_OPTIONS
};
