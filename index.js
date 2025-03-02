const express = require("express");
const app = express();
const PORT = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

app.use(express.json());

const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const matchRoutes = require("./src/routes/matchRoutes");

app.use(userRoutes);
app.use(authRoutes);
app.use(matchRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(PORT, () =>
  console.log("Servidor corriendo en http://localhost:" + PORT)
);

