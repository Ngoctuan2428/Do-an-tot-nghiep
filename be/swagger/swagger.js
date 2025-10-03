const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cookpad Clone API",
      version: "1.0.0",
      description: "API documentation for Cookpad clone backend",
    },
  },
  apis: ["./src/app.js", "./src/routes/*.js"], // nơi chứa comment Swagger
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
