"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("habitaciones", {
      id_habitaciones: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      id_caracteristicas: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "caracteristicas",
          key: "id_caracteristicas"
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      numero: {
        type: Sequelize.STRING(10),
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

      precio_noche: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      capacidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      tipo: {
        type: Sequelize.STRING(30),
        allowNull: false
      },

      disponible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },

      imagen: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      estado: {
        type: Sequelize.STRING(30),
        defaultValue: "disponible"
      },

      features: {
        type: Sequelize.JSON,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("habitaciones");
  }
};