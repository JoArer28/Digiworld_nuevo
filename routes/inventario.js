const express = require('express');
const router = express.Router();
const Producto = require('../models/productos'); // Importar el modelo

// Ruta para obtener todos los productos
router.get('/inventario', async (req, res) => {
  try {
    const productos = await Producto.findAll(); // Consultar todos los productos
    res.render('inventario', { productos }); // Renderizar la vista con los productos
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos');
  }
});

module.exports = router;
