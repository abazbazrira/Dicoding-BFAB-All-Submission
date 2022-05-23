const redis = require('redis');
const { REDIS_CONFIG } = require('../../config');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      host: REDIS_CONFIG.SERVER
    });
    this._client.on('error', (error) => console.error(error));
  }

  set(key, value) {
    return new Promise((resolve, reject) => {
      this._client.set(key, value, 'EX', REDIS_CONFIG.DURATION, (error, ok) => {
        if (error) return reject(error);
        return resolve(ok);
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this._client.get(key, (error, reply) => {
        if (error) return reject(error);
        if (reply === null) return reject(new Error('Cache tidak ditemukan'));
        return resolve(reply.toString());
      });
    });
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      this._client.del(key, (error, count) => {
        if (error) return reject(error);
        return resolve(count);
      });
    });
  }
}

module.exports = CacheService;
