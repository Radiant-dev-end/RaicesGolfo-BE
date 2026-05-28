const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Tour extends Model {}

Tour.init({
    id_tours: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nombre: {
        type: DataTypes.STRING (50),
        allowNull: false
    },

    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    precio: {
        type: DataTypes.DECIMAL (10,2),
        allowNull: false
    },

    duracion: {
        type: DataTypes.STRING (50),
        allowNull: false
    },

    tipo: {
        type: DataTypes.STRING (50),
        allowNull: false
    },
<<<<<<< HEAD

=======
    imagen: {
        type: DataTypes.TEXT,
        allowNull: false
    },
>>>>>>> 304ceb4bcc6eae6de179494f37c5768d2b51a2dd
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }

}, {
    sequelize,
    modelName: "Tour",
    tableName: "tours",
    timestamps: false
});

module.exports = Tour;