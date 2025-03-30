const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL, {
  // Remova a opção TLS caso o Redis não suporte SSL
  tls:
    process.env.REDIS_TLS === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
});

redis.on('error', (err) => console.error('Redis Error:', err));

module.exports = redis;
