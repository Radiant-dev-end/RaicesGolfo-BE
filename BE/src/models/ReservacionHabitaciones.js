const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class ReservacionHabitaciones extends Model {}

ReservacionHabitaciones.init({
    id_reservacion_habitaciones: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nombre_usuario: {
        type: DataTypes.STRING (100),
        allowNull: false
    },

    id_habitacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    nombre_habitacion: {
        type: DataTypes.STRING (50),
        allowNull: false
    },

    checkIn: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    checkOut: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    tiempo: {
        type: DataTypes.DATETIME,
        allowNull: false
    },

    precio: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },

    estado: {
        type: DataTypes.STRING (50),
        defaultValue: "Pendiente"
    },

    creado_en: {
        type: DataTypes.DATE,
        allowNull: false
    },

    tipo: {
        type: DataTypes.STRING (50),
        allowNull: false
    },

    item: {
        type: DataTypes.STRING (50),
        allowNull: false
    },

    date: {
        type: DataTypes.STRING (100),
        allowNull: false
    }

}, {
    sequelize,
    modelName: "RoomReservation",
    tableName: "room_reservations",
    timestamps: false
});

module.exports = RoomReservation;