"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("recuperacion_codigos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id_usuarios'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      correo: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      codigo: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fecha_expiracion: {
        type: Sequelize.DATE,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'usado', 'expirado'),
        allowNull: false,
        defaultValue: 'pendiente'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("recuperacion_codigos");
  }
};
