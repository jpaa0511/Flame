// Load environment variables from .env file
require("dotenv").config();
const PORT = process.env.API_PORT;

// Import and initialize Express
const express = require("express");
const app = express();

// Import CORS
const cors = require("cors");

// Configure CORS
app.use(cors({
  origin: 'http://localhost:4000', // URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Import database connection function
const { dbConnection } = require("./database/config");

// Connect to the database
dbConnection();

// Import Swagger tools for API documentation
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

// Middleware to parse JSON request bodies
app.use(express.json());

// Import route modules
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const matchRoutes = require("./src/routes/matchRoutes");

// Register routes with the app
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);

// Serve Swagger API documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Start the server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);


