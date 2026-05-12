const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Reservaciones extends Model {}

Reservaciones.init({
    id_reservaciones: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    id_habitaciones: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_usuarios: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    nombre_usuario: {
        type: DataTypes.STRING (100),
        allowNull: false
    },

    

    nombre_habitacion: {
        type: DataTypes.STRING,
        allowNull: false
    },

    precio: {
        type: DataTypes.DECIMAL (10,2),
        allowNull: false
    },

    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    estado: {
        type: DataTypes.STRING (30),
        defaultValue: "Pendiente"
    },

    creado_en: {
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