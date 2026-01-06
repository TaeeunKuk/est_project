// backend/src/config/redis.js
const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('connect', () => console.log('✅ Redis Connected!'));
redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));

redisClient.connect().catch(console.error);

module.exports = redisClient;