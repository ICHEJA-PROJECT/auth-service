import * as Joi from 'joi';
import { EnvsI } from '../domain/interfaces/EnvsI';

export const envsValidator = Joi.object<EnvsI>({
  JWT_SECRET: Joi.string()
    .required()
    .description('The secret key for the JWT token'),
  ENCRYPTION_KEY: Joi.string()
    .required()
    .description('The key for the encryption'),
  JWT_EXPIRATION: Joi.string()
    .required()
    .description('The expiration time for the JWT token'),
  DB_NAME: Joi.string().required().description('The name of the database'),
  DB_PORT: Joi.number().required().description('The port of the database'),
  DB_HOST: Joi.string().required().description('The host of the database'),
  DB_USERNAME: Joi.string()
    .required()
    .description('The username of the database'),
  DB_PASSWORD: Joi.string()
    .required()
    .description('The password of the database'),
  BROKER_HOSTS: Joi.array()
    .items(Joi.string())
    .required()
    .description('The hosts of the message broker'),
  DISABILITY_SERVICE_URL: Joi.string()
    .required()
    .description('The URL of the disability service'),
}).unknown(true);
