"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reservaciones_habitaciones", {
      id_reservacion_habitaciones: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      nombre_usuario: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      id_reservaciones: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "reservations",
          key: "id_reservaciones"
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      id_habitaciones: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "habitaciones",
          key: "id_habitaciones"
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      nombre_habitacion: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      checkIn: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      checkOut: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      tiempo: {
        type: Sequelize.DATE,
        allowNull: false
      },

      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      estado: {
        type: Sequelize.STRING(50),
        defaultValue: "Pendiente"
      },

      creado_en: {
        type: Sequelize.DATE,
        allowNull: false
      },

      tipo: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      item: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      date: {
        type: Sequelize.STRING(100),
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reservaciones_habitaciones");
  }
};