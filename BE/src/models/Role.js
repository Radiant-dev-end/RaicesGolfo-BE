const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Role extends Model {}

Role.init({

    id_roles: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nombre: {
        type: DataTypes.STRING (50),
        allowNull: false
    },

    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    }

}, {
    sequelize,
    modelName: "Role",
    tableName: "roles",
    timestamps: false
});

module.exports = Role;