const crypto = require("crypto");

function sortObject(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sortObject);
    }

    if (obj && typeof obj === "object") {
        return Object.keys(obj)
            .sort()
            .reduce((acc, key) => {
                acc[key] = sortObject(obj[key]);
                return acc;
            }, {});
    }

    return obj;
}

function generateCacheField(apiName, payload) {
    const normalizedPayload = sortObject(payload);

    const hash = crypto
        .createHash("sha256")
        .update(JSON.stringify(normalizedPayload))
        .digest("hex");

    return `${apiName}:${hash}`;
}

function getClientCacheKey(clientId) {
    const today = new Date()
        .toISOString()
        .split("T")[0];

    return `client_cache:${clientId}:${today}`;
}

function getSecondsUntilMidnight() {
    const now = new Date();

    const midnight = new Date(now);

    midnight.setHours(24, 0, 0, 0);

    return Math.floor(
        (midnight.getTime() - now.getTime()) / 1000
    );
}

module.exports = {
    generateCacheField,
    getClientCacheKey,
    getSecondsUntilMidnight,
};