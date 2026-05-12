const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Habitacion extends Model {}

Habitacion.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

    imagen: {
        type: DataTypes.STRING,
        allowNull: true
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: "disponible"
    },

    features: {
        type: DataTypes.JSON,
        allowNull: true
    }

}, {
    sequelize,
    modelName: "Habitacion",
    tableName: "habitaciones",
    timestamps: false
});

module.exports = Habitacion;