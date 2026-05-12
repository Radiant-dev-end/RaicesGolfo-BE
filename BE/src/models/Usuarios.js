const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Usuario extends Model {}

Usuario.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    role: {
        type: DataTypes.STRING,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    photo: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: false
});

module.exports = Usuario;