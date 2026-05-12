const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Role extends Model {}

Role.init({
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }

}, {
    sequelize,
    modelName: "Role",
    tableName: "roles",
    timestamps: false
});

module.exports = Role;