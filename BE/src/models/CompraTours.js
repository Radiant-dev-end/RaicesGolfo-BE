const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class CompraTour extends Model {}

CompraTour.init({
    id_compras: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuarios: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_tours: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_compra: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    precio_pagado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(30),
        defaultValue: "Completado"
    }
}, {
    sequelize,
    modelName: "CompraTour",
    tableName: "compra_tours",
    timestamps: false
});

module.exports = CompraTour;
