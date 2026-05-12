const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Reservation extends Model {}

Reservation.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },

    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },

    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    habId: {
        type: DataTypes.STRING,
        allowNull: false
    },

    habName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: "Pendiente"
    },

    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    }

}, {
    sequelize,
    modelName: "Reservation",
    tableName: "reservations",
    timestamps: false
});

module.exports = Reservation;