const { Sequelize, DataTypes } = require('sequelize');

// Conexión con la base de datos
const sequelize = new Sequelize('ttfashio_digiworld', 'ttfashio_miau', 'lPQwwBPbRAkw', {
  host: '162.241.2.35',
  dialect: 'mysql',
});

// Definición del modelo de la tabla `productos_a`
const Producto = sequelize.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING,
    unique: true
  },
  categoria: {
    type: DataTypes.STRING
  },
  descripcion: {
    type: DataTypes.STRING
  },
  inventario: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  umbral: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2)
  },
  ultima_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'productos_a', // Nombre de la tabla en MySQL
  timestamps: false
});

module.exports = Producto;
