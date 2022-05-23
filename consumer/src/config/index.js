require('dotenv').config();

const getEnv = (key) => {
  const env = process.env[key];
  if (!env) throw new Error(`Couldn't find enviroment variabel: ${key}`);
  return env;
};

const RABBITMQ_CONFIG = {
  RABBITMQ_SERVER: getEnv('RABBITMQ_SERVER'),
  QUEUE: 'export:playlist-songs',
};

const NODEMAILER_CONFIG = {
  TRANSPORT_OPTIONS: {
    host: getEnv('MAIL_HOST'),
    port: getEnv('MAIL_PORT'),
    secure: true,
    auth: {
      user: getEnv('MAIL_ADDRESS'),
      pass: getEnv('MAIL_PASSWORD'),
    },
  },
};

module.exports = { getEnv, RABBITMQ_CONFIG, NODEMAILER_CONFIG };
