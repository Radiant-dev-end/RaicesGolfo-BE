const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class RecuperacionCodigo extends Model { }

RecuperacionCodigo.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'usuarios',
            key: 'id_usuarios'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    correo: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    codigo: {
        type: DataTypes.STRING(10), // Guardaremos el código (ej: 123456)
        allowNull: false
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    fecha_expiracion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'usado', 'expirado'),
        allowNull: false,
        defaultValue: 'pendiente'
    }
}, {
    sequelize,
    modelName: "RecuperacionCodigo",
    tableName: "recuperacion_codigos",
    timestamps: false
});

module.exports = RecuperacionCodigo;
