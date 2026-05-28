const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Opiniones extends Model {}

Opiniones.init({
    id_opiniones: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },

    imagen: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },

    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    comentario: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    experiencia: {
        type: DataTypes.STRING(50),
        allowNull: false
    }

}, {
    sequelize,
    modelName: "Opiniones",
    tableName: "opiniones",
    timestamps: false
});

module.exports = Opiniones;