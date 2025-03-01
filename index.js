const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Importar rutas
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const matchRoutes = require("./src/routes/matchRoutes");

// Usar rutas
app.use(userRoutes);
app.use(authRoutes);
app.use(matchRoutes);

// Iniciar servidor
app.listen(PORT, () => console.log('Servidor corriendo en http://localhost:'+ PORT));