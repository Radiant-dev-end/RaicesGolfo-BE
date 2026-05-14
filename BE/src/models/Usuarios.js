const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Usuario extends Model {}

Usuario.init({
    id_usuarios: {
        type: DataTypes.INTEGER,
<<<<<<< HEAD
        autoIncrement: true,
        primaryKey: true
    },

    email: {
        type: DataTypes.STRING (255),
=======
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: DataTypes.STRING(255),
>>>>>>> f0a5797f5eb603b203767b878d9211a455d8e67f
        allowNull: false,
        unique: true
    },

    password: {
<<<<<<< HEAD
        type: DataTypes.STRING (255),
=======
        type: DataTypes.STRING(255),
>>>>>>> f0a5797f5eb603b203767b878d9211a455d8e67f
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