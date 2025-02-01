import * as dotenv from 'dotenv';
dotenv.config();

export type ConfigType = {
  appPort: number;
  dbUrl: string;
  nodeEnv: string;
  accessSecret: string;
  accessTime: string;
  refreshSecret: string;
  refreshTime: string;
};

const requiredVariables = [
  'APP_PORT',
  'DB_URL',
  'NODE_ENV',
  'JWT_ACCESS_SECRET',
  'JWT_ACCESS_TIME',
  'JWT_REFRESH_SECRET',
  'JWT_REFRESH_TIME',
];

const missingVariables = requiredVariables.filter((variable) => {
  const value = process.env[variable];
  return !value || value.trim() === '';
});

if (missingVariables.length > 0) {
  console.error(`Missing or empty environment variables`);
  process.exit(1);
}

export const config: ConfigType = {
  appPort: +process.env.APP_PORT,
  dbUrl: process.env.DB_URL,
  nodeEnv: process.env.NODE_ENV,
  accessSecret: process.env.JWT_ACCESS_SECRET,
  accessTime: process.env.JWT_ACCESS_TIME,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshTime: process.env.JWT_REFRESH_TIME,
};
