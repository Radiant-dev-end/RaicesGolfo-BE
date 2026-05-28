"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gastronomia', {
      id_gastronomia: {
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
      precio_minimo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      precio_maximo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      tipo: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      disponible: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      imagen: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      estado: {
        type: Sequelize.STRING(30),
        defaultValue: 'disponible'
      },
      features: {
        type: Sequelize.JSON,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gastronomia');
  }
};
