"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("usuarios", {
      id_usuarios: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },

      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      id_roles: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      foto: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("usuarios");
  }
};