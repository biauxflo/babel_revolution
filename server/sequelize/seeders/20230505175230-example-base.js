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
    await queryInterface.bulkInsert('Examples', [
      {
        author: "Serge",
        title: null,
        text: "Bona valetudo melior est quam maximae divitiae",
        hashtags: "latin",
        decree: null,
        belief: "dissident",
        type: "contribution",
        updatedAt: new Date(),
        createdAt: new Date()
      },
      {
        author: "!!!",
        title: null,
        text: "La Machine s’emballe toutes langues dehors ! Quelque chose se passe ! C’est encore incertain, encore \
          souterrain, mais des voix s’élèvent au sein même de la Machine officielle, pas même sur la Dark Machine où \
          j’écris, peu héroïque, en samizdat, ces carnets sans lecteurs. Des voix qui résistent contre cette épuration \
          linguistique, en français, et en des langues dont je n’ai parfois jamais même entendu parler. Existent-elles, \
          ont-elle déjà existé, toutes ? J’ai navigué la nuit durant dans la Matrice, suivi les échos hypertextes de ces \
          voix : ce sont des voyages. Certains premiers posts ont été censurés par l’algorithme mais d’autres ont réussi \
          à forcer le code, en s’émaillant de mots bannis, en français non autorisé, et dans d’autres langues. Ça gronde, \
          en-haut-du-code. Allez donc lire ça vous-même !",
        hashtags: "épuration",
        decree: null,
        belief: "dissident",
        type: "contribution",
        updatedAt: new Date(),
        createdAt: new Date()
      },
      {
        author: "!!!",
        title: null,
        text: "Épuration écologique et linguistique / Tilleul, courge, chêne, orchidée, pommier, haricot, cerisier, platane… \
        Et maintenant « patate » ! Cette fois, ces damnés linguistes du Centre de la langue unique ont même banni « patate » \
        du dernier opus du Dictionnaire officiel de la CMC : nous ne dînerons plus, frugaux et indifféremment, que de purées \
        de légumes. Et, seulement les grands jours : d’un fruit en dessert auquel sera éventuellement accolé un adjectif pour \
        en caractériser la taille, la forme ou la couleur. Moi, ce soir, comme tous les autres soirs, je mangerai les yeux \
        caves devant mon écran une soupe de gros légumes et un fruit rond. Austère. Comme le goût fade de ces succédanés issus \
        de croisements in vitro : Nutriscore imbattable, évidemment. Ils avaient commencé par les arbres. Déjà, lors du Coup \
        d’Etat, personne n’avait bronché de voir rayé du dictionnaire le cocobolo ou le pokemoboy, moi la première : si peu \
        savaient encore à quelles espèces ils s’attachaient dans leur verdoyante jeunesse puisque les mots pour les dire étaient \
        si rarement usités. À quoi bon ? Qui en avait déjà vu, de toute façon des cocolos et des pokemboys ? Vous, oui ? Moi, \
        non, jamais. Ça avait certes jasé un peu, lorsqu’ils avaient refrancisé le baobab et l’araucaria, en bobe et en aroque. \
        Les autres plantes aux noms étrangers avaient suivi : le pomel, le curcume, le dèkon, le chou patchoix, la rutabague… \
        Ca, c'était avant qu’ils ne disparaissent tout bonnement des étals. Trop coûteux, trop difficiles à faire pousser, pas \
        assez performants énergétiquement, par rapport à leurs légumes de laboratoire. ",
        hashtags: "épuration",
        decree: null,
        belief: "dissident",
        type: "contribution",
        updatedAt: new Date(),
        createdAt: new Date()
      },
      {
        author: "mimi",
        title: null,
        text: "안녕. 넌 누구 니 ?",
        hashtags: "한국어",
        decree: null,
        belief: "dissident",
        type: "contribution",
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
