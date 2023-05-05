'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Examples', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      author: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.TEXT({ length: 'long' })
      },
      hashtags: {
        type: Sequelize.STRING
      },
      decree: {   // the id of the related decree
        type: Sequelize.INTEGER
      },
      belief: {   // is it pro or against the CMC
        type: Sequelize.STRING
      },
      type: {     // contribution, decree, ... (here probably contribution)
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Examples');
  }
};