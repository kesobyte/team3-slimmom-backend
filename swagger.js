import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Basic Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Slimmom API",
      version: "1.0.0",
      description: "API for managing diary records and user authentication",
    },
    servers: [
      {
        url: "https://goit-slimmom-team-03-d472951ab141.herokuapp.com/",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/api/*.js", "./controllers/*.js"], // Paths to files containing your annotated endpoints
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
