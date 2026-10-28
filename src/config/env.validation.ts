import * as Joi from 'joi';

const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),

  MONGODB_HOST: Joi.string().required(),
  MONGODB_PORT: Joi.number().port().required(),
  MONGODB_DATABASE_NAME: Joi.string().required(),
  MONGODB_USERNAME: Joi.string().required(),
  MONGODB_PASSWORD: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRE_IN: Joi.string().default('1h'),

  AWS_S3_BUCKET: Joi.string().required(),
  AWS_S3_REGION: Joi.string().required(),
  AWS_S3_ENDPOINT: Joi.string().uri().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_KEY: Joi.string().required(),

  ALLOWED_ORIGINS: Joi.string().required(),

  MULTI_URL: Joi.string().uri().optional(),
  MULTI_TOKEN: Joi.string().optional(),
}).unknown(true);

export function validateEnv(config: Record<string, unknown>) {
  const { error, value } = envValidationSchema.validate(config, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  return value;
}
