"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tours", {
      id_tours: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      duracion: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      tipo: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      imagen: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      estado: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tours");
  }
};