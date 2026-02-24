const { redisClient } = require('../config/redis');

class CacheService {
    async get(key) {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(key, value, ttlSeconds) {
        await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    }

    async del(key) {
        await redisClient.del(key);
    }

    async delByPattern(pattern) {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    }

    async incrementView(articleId) {
        return await redisClient.incr(`article_views:${articleId}`);
    }

    async getViews() {
        const keys = await redisClient.keys('article_views:*');
        const results = [];
        for (const key of keys) {
            const count = await redisClient.get(key);
            const articleId = key.split(':')[1];
            results.push({ articleId, count: parseInt(count, 10), key });
        }
        return results;
    }

    async getAndResetViews() {
        const keys = await redisClient.keys('article_views:*');
        const results = [];
        for (const key of keys) {
            const count = await redisClient.get(key);
            const articleId = key.split(':')[1];
            results.push({ articleId, count: parseInt(count, 10) });
            await redisClient.del(key);
        }
        return results;
    }
}

module.exports = new CacheService();