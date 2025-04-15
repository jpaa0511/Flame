// Load environment variables from .env file
require("dotenv").config();
const PORT = process.env.API_PORT;

// Import and initialize Express
const express = require("express");
const app = express();

// Import database connection function
const { dbConnection } = require("./backend/database/config");

// Connect to the database
dbConnection();

// Import Swagger tools for API documentation
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

// Middleware to parse JSON request bodies
app.use(express.json());

// Import route modules
const userRoutes = require("./backend/src/routes/userRoutes");
const authRoutes = require("./backend/src/routes/authRoutes");
const matchRoutes = require("./backend/src/routes/matchRoutes");

// Register routes with the app
app.use(userRoutes);
app.use(authRoutes);
app.use(matchRoutes);

// Serve Swagger API documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Start the server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);


