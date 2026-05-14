"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("opiniones", {
      id_opiniones: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      nombre: {
        type: Sequelize.STRING(30),
        allowNull: false
      },

      imagen: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      calificacion: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      comentario: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      experiencia: {
        type: Sequelize.STRING(50),
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("opiniones");
  }
};