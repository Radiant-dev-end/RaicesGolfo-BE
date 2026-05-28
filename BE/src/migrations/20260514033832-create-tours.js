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
<<<<<<< HEAD

=======
      imagen: {
        type: Sequelize.TEXT,
        allowNull: false
      },
>>>>>>> 304ceb4bcc6eae6de179494f37c5768d2b51a2dd
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