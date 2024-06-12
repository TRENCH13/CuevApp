const { Router } = require("express");
const router = Router();
const path = require("path");

const basePath = "../public/Repartidor/";

router.get("/pedidos", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "pedidos.html"));
});

module.exports = router;
