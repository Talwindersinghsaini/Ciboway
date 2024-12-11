import { Config } from '@prisma/client';

const config: Config = {
  data: {
    provider: 'sqlite',
    url: process.env.DATABASE_URL,
  },
  log: ['query', 'info', 'warn', 'error'],
};

export default config;