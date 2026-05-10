const swaggerJSDoc = require("swagger-jsdoc");
const { SERVER_PORT } = require("../../config/config");

const serverUrl = `http://localhost:${SERVER_PORT}/api`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Employee Performance API",
      version: "1.0.0",
      description: "API documentation for the employee performance backend.",
    },
    servers: [
      {
        url: serverUrl,
        description: "API server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
  },
  apis: ["./src/app.js", "./src/modules/**/*.routes.js"],
};

module.exports = swaggerJSDoc(options);
