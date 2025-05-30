// Load environment variables from .env file
require("dotenv").config();
const PORT = 3000;

// Import and initialize Express
const express = require("express");
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const cookieParser = require('cookie-parser');

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

// Configuración de CORS para cookies
app.use(cors({
  origin: ['http://localhost:4000', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear cookies
app.use(cookieParser());

// Body parsing logging middleware
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('Request Body:', req.body);
  }
  next();
});

app.use(express.static('public'));

// Exponer la carpeta uploads como estática
app.use('/uploads', express.static('uploads'));

// Routes
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const matchRoutes = require("./src/routes/matchRoutes");
const chatRoutes = require("./src/routes/chatRoutes");

// API routes without
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/chat", chatRoutes);

// Documentation Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

require("./src/sockets/chatSocket")(io);

// Start server
http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});