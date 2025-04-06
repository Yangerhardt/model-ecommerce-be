import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('REDIS_URL is not defined');
}

const redis = new Redis(redisUrl, {
  tls:
    process.env.REDIS_TLS === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
});
redis.on('error', (err: Error) => {
  console.error('Redis Error:', err);
});

export default redis;
