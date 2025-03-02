const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const matchRoutes = require("./src/routes/matchRoutes");

app.use(userRoutes);
app.use(authRoutes);
app.use(matchRoutes);

app.listen(PORT, () =>
  console.log("Servidor corriendo en http://localhost:" + PORT)
);
