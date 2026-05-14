"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("index", {
      id_roles: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      id_usuarios: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      id_caracteristicas: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      id_reservaciones: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      id_habitaciones: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      id_tours: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("index");
  }
};