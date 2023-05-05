'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Ends', [
      {
        title: "Fin - Soulèvement populaire",
        text: "Le soulèvement populaire s’organise de manière auto-gérée, prend de l’ampleur et parvient à renverser \
          le pouvoir en place pour imposer une politique écolinguistique ouverte à la diversité des langues, des cultures \
          et des espèces. Et on commence par limiter le recours au numérique, très coûteux pour l’environnement, en éteignant \
          et détruisant la Matrice.",
        updatedAt: new Date(),
        createdAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
