const { Sequelize, DataTypes } = require('sequelize');

// Conexión con la base de datos
const sequelize = new Sequelize('ttfashio_digiworld', 'ttfashio_miau', 'lPQwwBPbRAkw', {
  host: '162.241.2.35',
  dialect: 'mysql',
});

// Definición del modelo
const StockA = sequelize.define('StockA', {
    id_stock_a: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    producto_id_b: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    almacen_id_b: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'stock_a', // Nombre de la tabla en la base de datos
    timestamps: false
  });
  
  module.exports = StockA;