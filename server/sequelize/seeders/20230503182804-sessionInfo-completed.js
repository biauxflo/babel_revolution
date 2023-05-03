'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('SessionInfos', [
      {
        title: "Session 20/04",
        author: "Lucas",
        image: "graphe1.png",
        completed: true,
        visible: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Session 21/04",
        author: "superadmin",
        image: "graphe1.png",
        completed: true,
        visible: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Session 22/04",
        author: "admin2",
        image: "graphe1.png",
        completed: true,
        visible: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Session 23/04",
        author: "Lucas",
        image: "graphe1.png",
        completed: true,
        visible: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
