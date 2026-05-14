const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Opinion extends Model {}

     init({
    id_opiniones: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nombre: {
        type: DataTypes.STRING (30),
        allowNull: false
    },

    imagen: {
        type: DataTypes.TEXT,
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
        type: DataTypes.STRING (50),
        allowNull: false
    }

}, {
    sequelize,
    modelName: "Opinion",
    tableName: "opiniones",
    timestamps: false
});

module.exports = Opinion;