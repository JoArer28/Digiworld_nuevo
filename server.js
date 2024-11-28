const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const multer = require('multer');
const bcrypt = require('bcrypt');

//Importaciones de RUTAS
const inventarioRoutes = require('./routes/inventario'); // Importa las rutas
const proveedoresRoutes = require('./routes/proveedores');
const stockRoutes = require('./routes/stock');

// Configuración de la base de datos
const db = mysql.createConnection({
  host: '162.241.2.35',
  user: 'ttfashio_miau',
  password: 'lPQwwBPbRAkw',
  database: 'ttfashio_digiworld',
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));


// Configuración de multer para manejo de archivos
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5 MB
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//BUSCADOR
app.get('/buscar', (req, res) => {
  const query = req.query.query;
  
  if (query) {
      // Consulta a la base de datos para buscar por ID o Nombre
      const sql = `
          SELECT * FROM productos_a 
          WHERE id_producto LIKE ? OR nombre LIKE ?
      `;
      db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
          if (err) {
              console.log(err);
              return res.status(500).send('Error en la búsqueda');
          }
          // Pasar los resultados al template
          res.render('inventario', { productos: results });
      });
  } else {
      // Si no hay búsqueda, mostrar todos los productos
      const sql = 'SELECT * FROM productos_a';
      db.query(sql, (err, results) => {
          if (err) {
              console.log(err);
              return res.status(500).send('Error al obtener los productos');
          }
          res.render('inventario', { productos: results });
      });
  }
});
//BUSCADOR

//VISTAS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//FIN VISTAS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', inventarioRoutes);
app.use('/proveedores', proveedoresRoutes);
app.use('/stock', stockRoutes);
//MIDDLEWARE


app.set('view engine', 'ejs');
app.set('views', './views');

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
// Ruta para obtener todos los productos
app.get('/todos-los-productos', (req, res) => {
  const query = "SELECT * FROM productos_a"; // Consulta SQL
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).send('Error al obtener productos');
    }
    res.render('inventario', { productos: results }); // Renderizar la vista con los resultados
  });
});


app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verificar si los campos están vacíos
  if (!username || !password) {
    return res.status(400).send('Por favor, completa todos los campos.');
  }

  // Consultar el usuario en la base de datos
  const query = 'SELECT * FROM usuarios WHERE nombre_usuario = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Error al buscar el usuario:', err);
      return res.status(500).send('Error interno del servidor');
    }

    const user = results[0];

    // Si el usuario no existe
    if (!user) {
      return res.status(400).send('Usuario no encontrado');
    }

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    const match = await bcrypt.compare(password, user.contraseña);
    if (!match) {
      return res.status(400).send('Contraseña incorrecta');
    }
    
    res.redirect('/inicio');
  });
});

app.get('/register', (req, res) => res.render('register', { successMessage: null }));

app.post('/register', upload.single('imagen_usuario'), async (req, res) => {
  const { username, password, confirmPassword, nombre_completo, email, telefono, rol } = req.body;

  // Validación de campos obligatorios
  if (!username || !password || !confirmPassword || !rol) {
    return res.status(400).json({ successMessage: 'Todos los campos son obligatorios.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ successMessage: 'Las contraseñas no coinciden.' });
  }

  // Validación de tipo de archivo
  if (req.file && !req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({ successMessage: 'Solo se permiten archivos de imagen.' });
  }

  try {
    // Verificar si el nombre de usuario ya existe
    const checkUserQuery = 'SELECT * FROM usuarios WHERE nombre_usuario = ?';
    db.query(checkUserQuery, [username], async (err, results) => {
      if (err) {
        console.error('Error al verificar el nombre de usuario:', err);
        return res.status(500).json({ successMessage: 'Error al verificar el nombre de usuario.' });
      }

      if (results.length > 0) {
        // Si el nombre de usuario ya existe
        return res.status(400).json({ successMessage: 'El nombre de usuario ya está en uso.' });
      }

      // Si el nombre de usuario no existe, proceder con el registro
      const hashedPassword = await bcrypt.hash(password, 10);
      const imagen_usuario = req.file ? req.file.buffer : null;

      const query = `INSERT INTO usuarios (nombre_usuario, contraseña, rol, nombre_completo, email, telefono, imagen_usuario) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;

      db.query(query, [username, hashedPassword, rol, nombre_completo, email, telefono, imagen_usuario], (err, result) => {
        if (err) {
          console.error('Error al insertar el usuario:', err);
          return res.status(500).json({ successMessage: 'Error al registrar al usuario.' });
        }

        console.log('Usuario registrado exitosamente:', result);
        return res.status(200).json({ successMessage: '¡Usuario registrado exitosamente!' });
      });
    });
  } catch (err) {
    console.error('Error en el registro:', err);
    return res.status(500).json({ successMessage: 'Ocurrió un error inesperado. Inténtalo nuevamente.' });
  }
});


// Rutas de página de inicio
app.get('/inicio', (req, res) => {
  res.render('inicio');
});

app.get('/stock', (req, res) => {
  res.render('stock');
});

app.get('/proveedores', (req, res) => {
  res.render('proveedores');
});

app.get('/inventario', (req, res) => {
  res.render('inventario');
});

app.get('/informes', (req, res) => {
  const query = "SELECT * FROM auditoria"; // Consulta para obtener todos los registros de la tabla auditoria

  db.query(query, (err, resultado) => {
      if (err) {
          console.error('Error al obtener registros de auditoría:', err);
          return res.status(500).send('Error al obtener registros de auditoría');
      }
      if (resultado.length === 0) {
          return res.status(404).send('No se encontraron registros de auditoría');
      }
      // Pasar los datos obtenidos a la vista
      res.render('informes', { auditoria: resultado });
  });
  //res.render('informes');
});


//CRUD 
// Ruta para obtener los datos de un producto para editar
app.get('/editar/:id_producto', (req, res) => {
  const idProducto = req.params.id_producto; // Asegúrate de que el nombre del parámetro sea id_producto
  const query = "SELECT * FROM productos_a WHERE id_producto = ?";
  db.query(query, [idProducto], (err, resultado) => {
      if (err) {
          console.error('Error al obtener producto:', err);
          return res.status(500).send('Error al obtener producto');
      }
      if (resultado.length === 0) {
          return res.status(404).send('Producto no encontrado');
      }
      res.render('editarProducto', { producto: resultado[0] });
  });
});


// Ruta para actualizar un producto
app.post('/editar/:id', (req, res) => {
  const { nombre, codigo, categoria, descripcion, inventario, umbral, precio } = req.body;
  const idProducto = req.params.id;
  const query = `
      UPDATE productos_a SET nombre = ?, codigo = ?, categoria = ?, descripcion = ?, inventario = ?, umbral = ?, precio = ? 
      WHERE id_producto = ?
  `;
  db.query(query, [nombre, codigo, categoria, descripcion, inventario, umbral, precio, idProducto], (err, result) => {
      if (err) {
          console.error('Error al actualizar producto:', err);
          return res.status(500).send('Error al actualizar producto');
      }
      res.redirect('/todos-los-productos'); // Redirige de vuelta a la lista
  });
});

// Ruta para eliminar un producto
app.get('/eliminar/:id', (req, res) => {
  const idProducto = req.params.id;
  const query = "DELETE FROM productos_a WHERE id_producto = ?";
  db.query(query, [idProducto], (err, result) => {
      if (err) {
          console.error('Error al eliminar producto:', err);
          return res.status(500).send('Error al eliminar producto');
      }
      res.redirect('/todos-los-productos'); // Redirige de vuelta a la lista
  });
});


// Ruta para obtener un proveedor para editar
app.get('/editar-proveedor/:id', (req, res) => {
  const idProveedor = req.params.id; // Obtener el id del proveedor desde la URL
  const query = "SELECT * FROM proveedores WHERE id_proveedores = ?";
  db.query(query, [idProveedor], (err, resultado) => {
    if (err) {
      console.error('Error al obtener proveedor:', err);
      return res.status(500).send('Error al obtener proveedor');
    }
    if (resultado.length === 0) {
      return res.status(404).send('Proveedor no encontrado');
    }
    res.render('editarProveedor', { proveedor: resultado[0] });
  });
});


// Ruta para actualizar un proveedor
app.post('/editar-proveedor/:id', (req, res) => {
  const { nombre, telefono, ubicacion, correo_contacto } = req.body;
  const idProveedor = req.params.id;
  const query = `
      UPDATE proveedores SET nombre = ?, telefono = ?, ubicacion = ?, correo_contacto = ? 
      WHERE id_proveedores = ?
  `;
  db.query(query, [nombre, telefono, ubicacion, correo_contacto, idProveedor], (err, result) => {
    if (err) {
      console.error('Error al actualizar proveedor:', err);
      return res.status(500).send('Error al actualizar proveedor');
    }
    res.redirect('/proveedores'); // Redirige a la lista de proveedores
  });
});


// Ruta para eliminar un proveedor
app.get('/eliminar-proveedor/:id', (req, res) => {
  const idProveedor = req.params.id;
  const query = "DELETE FROM proveedores WHERE id_proveedores = ?";
  db.query(query, [idProveedor], (err, result) => {
    if (err) {
      console.error('Error al eliminar proveedor:', err);
      return res.status(500).send('Error al eliminar proveedor');
    }
    res.redirect('/proveedores'); // Redirige a la lista de proveedores
  });
});


app.get('/informes', (req, res) => {
  const query = 'SELECT * FROM auditoria ORDER BY fecha_operacion DESC';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener los datos de auditoría:', error);
      return res.status(500).send('Error al obtener los datos');
    }

    // Renderiza la vista con los datos
    console.log(results); // Asegúrate de que contiene los datos esperados
    res.render('informes', { auditoria: results });
  });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});