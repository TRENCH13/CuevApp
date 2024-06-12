const { Router } = require("express");
const router = Router();
const path = require("path");

const basePath = "../public/Administrador/";

router.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "menuadmin.html"));
});

module.exports = router;