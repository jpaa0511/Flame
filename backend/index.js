// Load environment variables from .env file
require("dotenv").config();
const PORT = 3000;

// Import and initialize Express
const express = require("express");
const app = express();
const http = require('http').createServer(app);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Configure Socket.IO with CORS
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
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

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing logging middleware
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('Request Body:', req.body);
  }
  next();
});

app.use(express.static('public'));

// Routes
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const matchRoutes = require("./src/routes/matchRoutes");
const chatRoutes = require("./src/routes/chatRoutes");

// API routes without /api prefix
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/matches", matchRoutes);
app.use("/chat", chatRoutes);

// Documentation Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

require("./src/sockets/chatSocket")(io);

// Start server
http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});