const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Gastronomia extends Model {}

Gastronomia.init({
  id_gastronomia: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
    precio_minimo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    precio_maximo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  tipo: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING(30),
    defaultValue: 'disponible',
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Gastronomia',
  tableName: 'gastronomia',
  timestamps: false,
});

module.exports = Gastronomia;
