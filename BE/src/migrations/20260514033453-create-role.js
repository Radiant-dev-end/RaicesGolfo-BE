"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles", {
      id_roles: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      fecha: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("roles");
  }
};