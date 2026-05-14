"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reservations", {
      id_reservaciones: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      id_usuarios: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "usuarios",
          key: "id_usuarios"
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      nombre_usuario: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      nombre_habitacion: {
        type: Sequelize.STRING,
        allowNull: false
      },

      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      estado: {
        type: Sequelize.STRING(30),
        defaultValue: "Pendiente"
      },

      creado_en: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reservations");
  }
};