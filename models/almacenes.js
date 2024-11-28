const { Sequelize, DataTypes } = require('sequelize');

// Conexión con la base de datos
const sequelize = new Sequelize('ttfashio_digiworld', 'ttfashio_miau', 'lPQwwBPbRAkw', {
  host: '162.241.2.35',
  dialect: 'mysql',
});

const Almacen = sequelize.define('Almacen', {
  id_almacenes: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'almacenes',
  timestamps: false
});

module.exports = Almacen;
