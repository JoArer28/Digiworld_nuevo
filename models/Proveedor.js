const { Sequelize, DataTypes } = require('sequelize');

// Conexión con la base de datos
const sequelize = new Sequelize('ttfashio_digiworld', 'ttfashio_miau', 'lPQwwBPbRAkw', {
  host: '162.241.2.35',
  dialect: 'mysql',
});

const Proveedor = sequelize.define('Proveedor', {
    id_proveedores: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING
    },
    ubicacion: {
      type: DataTypes.STRING
    },
    correo_contacto: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'proveedores', // Nombre de la tabla en la base de datos
    timestamps: false
  });
  
  module.exports = Proveedor;