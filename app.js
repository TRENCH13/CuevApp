const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//const cors = require("cors");
require("dotenv").config({ path: "./.env" });

// Settings
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: ["MBAPPES"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "Access-Control-Allow-Origin",
  ],
};

// Middleware para analizar las solicitudes con cuerpo JSON
app.use(bodyParser.json());
app.set("json spaces", 2);

// CORS
//app.use(cors(corsOptions));

//Rutas WEB
app.use(express.static("./"));
app.use(require("./routes.js"));

// Endpoint WildCard
app.all("*", (req, res) => {
  res
    .status(404)
    .json({ error: true, message: "NO EXISTE EL RECURSO SOLICITADO" });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
