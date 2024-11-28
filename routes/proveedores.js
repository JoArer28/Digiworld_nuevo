// routes/proveedores.js
const express = require('express');
const router = express.Router();
const Proveedor = require('../models/Proveedor');

// Obtener todos los proveedores
router.get('/', async (req, res) => {
    try {
        const proveedores = await Proveedor.findAll();
        res.render('proveedores', { Proveedores: proveedores });
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).send('Error al cargar los proveedores.');
      }
});

// Crear un nuevo proveedor
router.post('/', async (req, res) => {
  const { nombre, telefono, ubicacion, correo_contacto } = req.body;
  try {
    const nuevoProveedor = await Proveedor.create({
      nombre,
      telefono,
      ubicacion,
      correo_contacto,
    });
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ message: 'Error al crear proveedor.' });
  }
});

// Actualizar un proveedor
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, ubicacion, correo_contacto } = req.body;
  try {
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({ message: 'Proveedor no encontrado.' });
    }
    await proveedor.update({ nombre, telefono, ubicacion, correo_contacto });
    res.status(200).json(proveedor);
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ message: 'Error al actualizar proveedor.' });
  }
});

// Eliminar un proveedor
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({ message: 'Proveedor no encontrado.' });
    }
    await proveedor.destroy();
    res.status(200).json({ message: 'Proveedor eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ message: 'Error al eliminar proveedor.' });
  }
});

module.exports = router;
