const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Habitacion extends Model {}

Habitacion.init({
    id_habitaciones: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    id_caracteristicas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    numero: {
        type: DataTypes.STRING (10),
        allowNull: false
    },

    nombre: {
        type: DataTypes.STRING (50),
        allowNull: false
    },

    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    precio_noche: {
        type: DataTypes.DECIMAL (10,2),
        allowNull: false
    },

    capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    tipo: {
        type: DataTypes.STRING (30),
        allowNull: false
    },

    disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },

    imagen: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    estado: {
        type: DataTypes.STRING (30),
        defaultValue: "disponible"
    },

    features: {
        type: DataTypes.JSON,
        allowNull: false
    }

}, {
    sequelize,
    modelName: "Habitacion",
    tableName: "habitaciones",
    timestamps: false
});

module.exports = Habitacion;