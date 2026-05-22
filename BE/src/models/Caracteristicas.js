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
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    asunto: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    userId: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(30),
        defaultValue: 'Pendiente'
    },
    respuestaAdmin: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    respondidoAt: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    sequelize,
    modelName: "Caracteristica",
    tableName: "caracteristicas",
    timestamps: false
});

module.exports = Caracteristica;