const express = require("express");
const helmet = require("helmet");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(helmet());
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

const routes = require("./src/routes");

// Health check handler
const healthCheckResponse = (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Health ok",
    timestamp: new Date().toISOString(),
  });
};

app.get("/health-check", healthCheckResponse);
app.get("/health", healthCheckResponse);
app.get("/api/health-check", healthCheckResponse);
app.get("/api/health", healthCheckResponse);

// Application routes (auth/internal-login, logout, etc.)
app.use(routes);

const server = require("http").createServer(app);
const mode = process.env.MODE || "development";
console.info(`Running in mode ${mode}`);

server.listen(process.env.APP_PORT, () => {
  console.info(`Server started on port ${process.env.APP_PORT}`);
});

module.exports = { app, server };

