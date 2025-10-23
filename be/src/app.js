const express = require("express");
const { swaggerUi, swaggerSpec } = require("../swagger/swagger");

const app = express();
app.use(express.json());

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Route test
/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Test API
 *     description: Returns Hello World message
 *     responses:
 *       200:
 *         description: Success
 */
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello World from Cookpad Backend 👋" });
});

module.exports = app;
