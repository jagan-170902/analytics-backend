require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const logger = require("./utils/logger");
const authRoutes = require("./routes/auth");
const analyticsRoutes = require("./routes/analytics");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: "1mb" }));

// Log HTTP requests and send them to winston
app.use(
  morgan("combined", {
    stream: {
      write: (msg) => logger.info(msg.trim()),
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);

// Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler
app.use(errorHandler);

module.exports = app;