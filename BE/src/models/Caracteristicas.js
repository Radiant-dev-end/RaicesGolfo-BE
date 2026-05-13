const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Caracteristica extends Model {}

Caracteristica.init({
    id_caracteristicas: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nombre: {
        type: DataTypes.STRING (50),
        allowNull: false
    },

    icono: {
        type: DataTypes.TEXT,
        allowNull: false
    }

}, {
    sequelize,
    modelName: "Caracteristica",
    tableName: "caracteristicas",
    timestamps: false
});

module.exports = Caracteristica;