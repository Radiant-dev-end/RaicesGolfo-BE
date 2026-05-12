const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class ReservacionHabitaciones extends Model {}

ReservacionHabitaciones.init({
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

    roomId: {
        type: DataTypes.STRING,
        allowNull: false
    },

    roomName: {
        type: DataTypes.STRING,
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

    time: {
        type: DataTypes.STRING,
        allowNull: false
    },

    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: "Pendiente"
    },

    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },

    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    item: {
        type: DataTypes.STRING,
        allowNull: false
    },

    date: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    sequelize,
    modelName: "RoomReservation",
    tableName: "room_reservations",
    timestamps: false
});

module.exports = RoomReservation;