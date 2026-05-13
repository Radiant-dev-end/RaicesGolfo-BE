const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Opinion extends Model {}

<<<<<<< HEAD
opiniones.init({
<<<<<<< HEAD
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
=======
=======
Opinion.init({
>>>>>>> fa0e21eda95f4fe6728d179ca40812f8f0aa122a
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