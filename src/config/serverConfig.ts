import dotenv from 'dotenv';
dotenv.config();
export default {
  PORT: process.env.PORT || 8080,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
};
