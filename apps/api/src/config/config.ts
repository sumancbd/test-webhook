import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

export const configOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  isGlobal: true,

  validationSchema: Joi.object({
    // API
    APP_NAME: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9_]*$')).min(3).max(30),
    APP_PORT: Joi.string().required(),
    APP_HOST: Joi.string().required(),
    // DB
    DATABASE_URL: Joi.string().required(),

  }).unknown(),
  validationOptions: {
    abortEarly: true,
  },
};
