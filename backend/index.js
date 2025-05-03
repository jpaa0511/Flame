// Load environment variables from .env file
require("dotenv").config();
const PORT = process.env.API_PORT;

// Import and initialize Express
const express = require("express");
const app = express();
const http = require('http').createServer(app);

// Configure Socket.IO with CORS
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Import and execute connection to the database
const { dbConnection } = require("./database/config");
dbConnection();

// Middleware to parse JSON
app.use(express.json());
const cors = require("cors");
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.static('public'));

// Routes
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const matchRoutes = require("./src/routes/matchRoutes");
const chatRoutes = require("./src/routes/chatRoutes");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/chat", chatRoutes);

// Documentation Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Modularization of sockets
require("./src/sockets/chatSocket")(io);

// Start server
http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});