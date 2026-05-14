"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("caracteristicas", {
      id_caracteristicas: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      icono: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("caracteristicas");
  }
};