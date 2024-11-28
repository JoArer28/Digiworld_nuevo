const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// Ruta de registro
router.post('/register', async (req, res) => {
  const { nombre_usuario, contraseña, rol, nombre_completo, email, telefono } = req.body;

  if (!nombre_usuario || !contraseña || !rol) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    // Verifica si el usuario ya existe
    const [existingUser] = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Inserta el nuevo usuario
    db.query(
      'INSERT INTO usuarios (nombre_usuario, contraseña, rol, nombre_completo, email, telefono) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre_usuario, hashedPassword, rol, nombre_completo, email, telefono],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error al registrar el usuario' });
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta de login
router.post('/login', (req, res) => {
  const { nombre_usuario, contraseña } = req.body;

  if (!nombre_usuario || !contraseña) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al buscar el usuario' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = results[0];

    // Verifica la contraseña
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  });
});

module.exports = router;
