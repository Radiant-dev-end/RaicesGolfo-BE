const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class opiniones extends Model {}

opiniones.init({
<<<<<<< HEAD
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
=======
    id_opiniones: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
>>>>>>> 39cdd133329de56ef661b3541f5b0961bb6bb3d5
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