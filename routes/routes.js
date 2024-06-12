const { Router } = require("express");
const router = Router();
const path = require("path");

const basePath = "../public/";

// Endpoint de inicio
router.get("/", (req, res) => {
  res.send("index.html");
});

router.get("/carrito", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "carrito.html"));
});

router.get("/productdetails", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "detailsProduct.html"));
});

router.get("/adress", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "adress.html"));
});

router.get("/iniciosesion", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "iniciosesion.html"));
});

router.get("/main", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "main.html"));
});

router.get("/pedidos", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "pedidos.html"));
});

router.get("/productos", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "productos.html"));
});

router.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "profile.html"));
});

router.get("/ingreso", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "ingreso.html"));
});

router.get("/registro", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "registro.html"));
});

router.get("/thanks", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "thanks.html"));
});

router.get("/mostrarDetalles", (req, res) => {
  res.sendFile(path.join(__dirname, basePath + "productDetails.html"));
});

module.exports = router;
