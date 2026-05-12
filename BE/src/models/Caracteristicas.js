const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Caracteristica extends Model {}

Caracteristica.init({
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    icono: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    sequelize,
    modelName: "Caracteristica",
    tableName: "caracteristicas",
    timestamps: false
});

module.exports = Caracteristica;