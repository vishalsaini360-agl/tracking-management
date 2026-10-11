const { redisClient, isRedisAvailable } = require("./redis");
const redisEnv = process?.env?.APP_DS_REDIS_ENVIRONMENT ?? "";

const {
    generateCacheField,
    getClientCacheKey,
    // getSecondsUntilMidnight,
} = require("./cacheHelper");

const getCacheClientId = (req_headers) => {
    const x_dsm_client_id = req_headers?.['X-dsm-client-id'] || req_headers?.['x-dsm-client-id'];
    const ES_client_id = req_headers?.['x-dsm-client-es-id'] ?? "main";
    const cache_client_id = redisEnv + "_" + x_dsm_client_id + "_" + ES_client_id;
    return cache_client_id;
}

async function getCache(
    cache_client_id,
    cache_api_name,
    cache_api_payload
) {
    if (!isRedisAvailable()) return null;
    const hashKey =
        getClientCacheKey(cache_client_id);

    const field =
        generateCacheField(
            cache_api_name,
            cache_api_payload
        );

    const cached =
        await redisClient?.hGet(
            hashKey,
            field
        );

    return cached
        ? JSON.parse(cached)
        : null;
}

async function setCache(
    cache_client_id,
    cache_api_name,
    cache_api_payload,
    response,
    ttl_time = (6 * 60 * 60) //6 hours
) {
    if (isRedisAvailable()) {
        const hashKey =
            getClientCacheKey(cache_client_id);

        const field =
            generateCacheField(
                cache_api_name,
                cache_api_payload
            );

        await redisClient?.hSet(
            hashKey,
            field,
            JSON.stringify(response)
        );

        const ttl =
            await redisClient?.ttl(hashKey);

        if (ttl < 0) {
            await redisClient?.expire(
                hashKey,
                // getSecondsUntilMidnight()
                (ttl_time) //6 hours
            );
        }
    }
}

async function clearClientCache(
    cache_client_id
) {
    if (isRedisAvailable()) {
        const hashKey =
            getClientCacheKey(cache_client_id);

        await redisClient?.del(hashKey);
    }
}

async function clearClientCacheAllDays(cache_client_id) {
    if (isRedisAvailable()) {
        try {
            const pattern = `client_cache:${cache_client_id}:*`;
            let cursor = "0";
            do {
                const { cursor: nextCursor, keys } = await redisClient?.scan(cursor, { MATCH: pattern, COUNT: 100 });

                cursor = nextCursor;

                if (keys.length > 0) {
                    await redisClient?.del(...keys);
                }
            } while (cursor !== "0");
            return true;
        } catch (error) {
            console.error("Redis clear cache error >>>>>", error);
            return false;
        }
    } else {
        return false;
    }
}

async function clearClientCacheAllDaysForAllClients() {
    if (isRedisAvailable()) {
        try {
            // const pattern = `client_cache:*`;
            // let cursor = "0";
            // do {
            //     const { cursor: nextCursor, keys } = await redisClient?.scan(cursor, { MATCH: pattern, COUNT: 100 });

            //     cursor = nextCursor;

            //     if (keys.length > 0) {
            //         await redisClient?.del(...keys);
            //     }
            // } while (cursor !== "0");
            await redisClient?.flushAll(); // Clear all keys in Redis
            return true;
        } catch (error) {
            console.error("Redis clear all client cache error >>>>>", error);
            return false;
        }
    } else {
        return false;
    }
}

module.exports = {
    redisEnv,
    getCacheClientId,
    getCache,
    setCache,
    clearClientCache,
    clearClientCacheAllDays,
    clearClientCacheAllDaysForAllClients
};







