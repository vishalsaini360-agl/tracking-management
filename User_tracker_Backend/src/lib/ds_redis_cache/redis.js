const { createClient } = require("redis");
const redisURL = process?.env?.APP_DS_REDIS_URL;
const redisClient = createClient({
    url: redisURL
    // url: 'redis://digital-shelf-dev-cache.fjgir3.ng.0001.aps1.cache.amazonaws.com:6379'
});

let redisAvailable = false;

redisClient.on("connect", () => {
    console.log("Redis Connecting...");
});

redisClient.on("ready", () => {
    redisAvailable = true;
    console.log("Redis Ready");
});

redisClient.on("error", (err) => {
    redisAvailable = false;
    if (process.env.APP_DS_REDIS_URL) {
        console.error("Redis Error:", err.message);
    }
});

redisClient.on("end", () => {
    redisAvailable = false;
    console.log("Redis Connection Closed");
});

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error("Redis connection failed:", err.message);
        redisAvailable = false;
    }
})();

module.exports = {
    redisURL,
    redisClient,
    isRedisAvailable: () => redisAvailable
};