const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Usuario extends Model {}

Usuario.init({
    id_usuarios: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    id_roles: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    foto: {
        type: DataTypes.TEXT,
        allowNull: true
    }

}, {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: false
});

module.exports = Usuario;