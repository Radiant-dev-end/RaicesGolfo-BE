const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Tour extends Model {}

Tour.init({
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

    duracion: {
        type: DataTypes.STRING,
        allowNull: false
    },

    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }

}, {
    sequelize,
    modelName: "Tour",
    tableName: "tours",
    timestamps: false
});

module.exports = Tour;