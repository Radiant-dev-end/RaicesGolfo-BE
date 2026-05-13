const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Usuario extends Model {}

Usuario.init({
<<<<<<< HEAD
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: DataTypes.STRING(100),
=======
    id_usuarios: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    email: {
        type: DataTypes.STRING (255),
>>>>>>> 39cdd133329de56ef661b3541f5b0961bb6bb3d5
        allowNull: false,
        unique: true
    },

    password: {
<<<<<<< HEAD
        type: DataTypes.STRING(255),
=======
        type: DataTypes.STRING (255),
>>>>>>> 39cdd133329de56ef661b3541f5b0961bb6bb3d5
        allowNull: false
    },

    id_roles: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    nombre: {
        type: DataTypes.STRING (100),
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