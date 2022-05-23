require('dotenv').config();

const getEnv = (key) => {
  const env = process.env[key];
  if (!env) throw new Error(`Couldn't find enviroment variabel: ${key}`);
  return env;
};

const SERVER_CONFIG = {
  PORT: getEnv('PORT'),
  HOST: getEnv('HOST'),
};

const JWT_CONFIG = {
  ACCESS_TOKEN_KEY: getEnv('ACCESS_TOKEN_KEY'),
  REFRESH_TOKEN_KEY: getEnv('REFRESH_TOKEN_KEY'),
  AUTH_STRATEGY_NAME: 'openmusic_jwt',
  AUTH_STRATEGY_SCHEME: 'jwt',
  AUTH_STRATEGY_OPTIONS: {
    keys: getEnv('ACCESS_TOKEN_KEY'),
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: getEnv('ACCESS_TOKEN_AGE'),
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  },
};

const RABBITMQ_CONFIG = {
  RABBITMQ_SERVER: getEnv('RABBITMQ_SERVER'),
};

const REDIS_CONFIG = {
  SERVER: getEnv('REDIS_SERVER'),
  DURATION: 1800,
};

module.exports = {
  getEnv,
  SERVER_CONFIG,
  JWT_CONFIG,
  RABBITMQ_CONFIG,
  REDIS_CONFIG,
};
