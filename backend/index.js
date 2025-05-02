// Load environment variables from .env file
require("dotenv").config();
const PORT = process.env.API_PORT;

// Import and initialize Express
const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Import CORS
const cors = require("cors");

// Configure CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4000'], // URLs permitidas
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Servir archivos estáticos
app.use(express.static('public'));

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
const chatRoutes = require("./src/routes/chatRoutes");

// Register routes with the app
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/chat", chatRoutes);

// Serve Swagger API documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Unirse a una sala de chat específica
  socket.on('join-chat', (matchId) => {
    socket.join(matchId);
    console.log(`Usuario ${socket.id} se unió al chat ${matchId}`);
  });

  // Manejar mensajes
  socket.on('send-message', async (data) => {
    console.log('Mensaje recibido del cliente:', data);
    const { matchId, senderId, content } = data;
    
    // Verificar que el match existe y el usuario es parte de él
    const Match = require('./src/models/Match');
    const match = await Match.findOne({
      _id: matchId,
      users: senderId,
      isActive: true
    });

    if (!match) {
      console.log('Match no encontrado o inactivo');
      return;
    }

    // Obtener el ID del receptor (el otro usuario en el match)
    const receiverId = match.users.find(userId => userId.toString() !== senderId);
    console.log('ID del receptor:', receiverId);

    // Guardar mensaje en la base de datos
    const Message = require('./src/models/Message');
    const message = new Message({
      match: matchId,
      sender: senderId,
      receiver: receiverId,
      content
    });
    await message.save();
    console.log('Mensaje guardado en la base de datos');

    // Actualizar el último mensaje del match
    match.lastMessage = content;
    match.lastMessageAt = new Date();
    await match.save();

    // Emitir mensaje a todos los usuarios en la sala
    const messageData = {
      sender: senderId,
      content,
      timestamp: new Date()
    };
    console.log('Emitiendo mensaje a la sala:', messageData);
    io.to(matchId).emit('receive-message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Start the server
http.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);


