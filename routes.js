const { Router } = require("express");
const router = Router();
const path = require("path");

// Endpoint de inicio
router.get("/", (req, res) => {
  res.send("index.html");
});
router.get("/lost", (req, res) => {
  res.sendFile(path.join(__dirname, "productos.html"));
});
router.get("/", (req, res) => {
  res.send("index.html");
});
router.get("/", (req, res) => {
  res.send("index.html");
});
router.get("/", (req, res) => {
  res.send("index.html");
});
router.get("/", (req, res) => {
  res.send("index.html");
});
router.get("/", (req, res) => {
  res.send("index.html");
});
router.get("/", (req, res) => {
  res.send("index.html");
});

module.exports = router;
