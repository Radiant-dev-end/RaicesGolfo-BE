const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class opiniones extends Model {}

opiniones.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    imagen: {
        type: DataTypes.STRING,
        allowNull: true
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
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    sequelize,
    modelName: "Opinion",
    tableName: "opiniones",
    timestamps: false
});

module.exports = Opinion;