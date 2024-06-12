const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
require("dotenv").config({ path: "./.env" });

// Settings
const PORT = process.env.PORT || 3000;

// Middleware para analizar las solicitudes con cuerpo JSON
app.use(bodyParser.json());
app.set("json spaces", 2);

// Rutas
app.use(express.static("./public"));
app.use(require("./routes/routes.js"));
app.use("/admin", require("./routes/adminRouter.js"));
app.use("/executive", require("./routes/executiveRouter.js"));
app.use("/deliveryman", require("./routes/deliverymanRouter.js"));

// Endpoint WildCard
app.all("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "./public/notfound.html"));
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
