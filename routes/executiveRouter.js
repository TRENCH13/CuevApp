const { Router } = require("express");
const router = Router();
const path = require("path");

const basePath = "../public/Ejecutivo/";

/* Ejecutivos */
router.get("/asignacion", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "asignacionpedido.html"));
});

router.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "menuejecutivo.html"));
});

router.get("/revisionpedido", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "revisionpedido.html"));
});

module.exports = router;
