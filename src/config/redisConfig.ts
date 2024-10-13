import Redis, { RedisOptions } from 'ioredis';

import serverConfig from './serverConfig';

const { REDIS_HOST, REDIS_PORT } = serverConfig;

const redisConfig: RedisOptions = {
  port: Number(REDIS_PORT),
  host: REDIS_HOST,
  maxRetriesPerRequest: null,
};
const redisConnection = new Redis(redisConfig);
export default redisConnection;
