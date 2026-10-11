let config;
if (process.env.NODE_ENV === "development") {
  config = require("./appConfig.js");
}
if (process.env.NODE_ENV === "staging") {
  config = require("./appConfig.json");
}
if (process.env.NODE_ENV === "production") {
  config = require("./appConfig.json");
}

module.exports = config;
