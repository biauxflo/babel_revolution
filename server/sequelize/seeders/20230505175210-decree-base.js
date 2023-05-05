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
    await queryInterface.bulkInsert('Decrees', [
      {
        title: "1er décret - plantes",
        text: "Il est maintenant interdit d'utiliser des mots comme artichaut, lentille, oignon, radis, potiron, ... \
        Les termes scientifiques pour décrire une plante sont bannis, car inutiles. Merci d'utiliser les attributs \
          nécessaires, comme 'légume vert' ou 'petit légume rond'. Toute usage non conventionnel sera sanctionné. -- Le CMC",
        updatedAt: new Date(),
        createdAt: new Date()
      },
      {
        title: "2e décret - adjectifs",
        text: "Après une étude poussée et documentée sur les relations inter-individus, le CMC a constaté un nombre trop \
          important d'adjectifs pour décrire les personnalités. Dans une démarche de simplicité qui aidera chacun et chacune, \
          il est désormais interdit de qualifier quelqu'un par un adjectif différent de la liste suivante : gentil, méchant. \
          Les superlatifs (très, beaucoup, peu, ...) restent utilisables sans excès. Le CMC condamne notamment les mots trop \
          précis, comme 'affectueux', 'caustique', 'désorganisé', 'humble', 'prévenant', ... Une sanction supplémentaire sera \
          ajoutée pour les mots à double sens, qui s'oppose au progrès de la simplicité de compréhension. -- Le CMC",
        updatedAt: new Date(),
        createdAt: new Date()
      },
      {
        title: "3e décret - langues",
        text: "La simplicité et la compréhension sont les objectifs principaux du CMC. Ainsi, à partir d'aujourd'hui, \
          l'usage de plusieurs langues est interdit. De plus, les termes inventés ou utilisant une règle non conforme \
          au règlement (exemple : le 'verlan') sont aussi interdits. Ces pratiques laissent certaines personnes hors \
          des conversations qu'ils ou elles ne peuvent pas comprendre. Pour une bonne cohésion de groupe, utilisons une \
          seule langue, donc chaque mot est simple. La présence dans le dictionnaire des termes utilisés est une règle \
          absolue. -- Le CMC",
        updatedAt: new Date(),
        createdAt: new Date()
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
