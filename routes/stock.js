const express = require('express');
const router = express.Router();
const StockA = require('../models/stockA');

// Obtener todos los registros de stock
router.get('/', async (req, res) => {
  try {
    const stock = await StockA.findAll();
    res.render('stock', { StockData: stock });
  } catch (error) {
    console.error('Error al obtener stock:', error);
    res.status(500).json({ message: 'Error al obtener el stock.' });
  }
});

// Crear un nuevo registro de stock
router.post('/', async (req, res) => {
  const { producto_id_b, almacen_id_b, cantidad } = req.body;
  try {
    const nuevoStock = await StockA.create({ producto_id_b, almacen_id_b, cantidad });
    res.status(201).json(nuevoStock);
  } catch (error) {
    console.error('Error al crear stock:', error);
    res.status(500).json({ message: 'Error al crear stock.' });
  }
});

// Actualizar un registro de stock
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { producto_id_b, almacen_id_b, cantidad } = req.body;
  try {
    const stock = await StockA.findByPk(id);
    if (!stock) {
      return res.status(404).json({ message: 'Registro de stock no encontrado.' });
    }
    await stock.update({ producto_id_b, almacen_id_b, cantidad });
    res.status(200).json(stock);
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ message: 'Error al actualizar stock.' });
  }
});

// Eliminar un registro de stock
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const stock = await StockA.findByPk(id);
    if (!stock) {
      return res.status(404).json({ message: 'Registro de stock no encontrado.' });
    }
    await stock.destroy();
    res.status(200).json({ message: 'Registro de stock eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar stock:', error);
    res.status(500).json({ message: 'Error al eliminar stock.' });
  }
});

module.exports = router;
