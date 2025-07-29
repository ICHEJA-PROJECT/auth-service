import 'dotenv/config';
import { EnvsI } from './domain/interfaces/EnvsI';
import { envsValidator } from './validators/envs.validator';

const getEnvs = (): EnvsI => {
  const { error, value } = envsValidator.validate({
    ...process.env,
    BROKER_HOSTS: process.env.BROKER_HOSTS?.split(','),
  });

  if (error) {
    throw new Error(`Invalid environment variables: ${error.message}`);
  }

  return {
    JWT_SECRET: value.JWT_SECRET,
    ENCRYPTION_KEY: value.ENCRYPTION_KEY,
    JWT_EXPIRATION: value.JWT_EXPIRATION,
    DB_NAME: value.DB_NAME,
    DB_PORT: value.DB_PORT,
    DB_HOST: value.DB_HOST,
    DB_USERNAME: value.DB_USERNAME,
    DB_PASSWORD: value.DB_PASSWORD,
    BROKER_HOSTS: value.BROKER_HOSTS,
    DISABILITY_SERVICE_URL: value.DISABILITY_SERVICE_URL,
  };
};

export const envsValues = getEnvs();
