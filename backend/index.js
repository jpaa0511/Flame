require("dotenv").config();

const express = require("express");
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

const io = require('socket.io')(http, {
  cors: {
    origin: [process.env.BACKEND_URL, process.env.FRONTEND_URL],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const { dbConnection } = require("./database/config");
dbConnection();

app.use(express.json());

app.use(cors({
  origin: [process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());

app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('Request Body:', req.body);
  }
  next();
});

app.use(express.static('public'));

app.use('/uploads', express.static('uploads'));

const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const matchRoutes = require("./src/routes/matchRoutes");
const chatRoutes = require("./src/routes/chatRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/chat", chatRoutes);

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

require("./src/sockets/chatSocket")(io);

http.listen(process.env.BACKEND_PORT, () => {
  console.log(`Server running at ${process.env.BACKEND_URL}`);
});