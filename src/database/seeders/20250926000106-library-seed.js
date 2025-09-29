'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'library',
      [
        {
          user_uid: 'RyMIKpIe25ZFs0F6ibZLlIIkM2z1',
          mal_id: 11061,
          title: 'Hunter x Hunter (2011)',
          media_type: 'series',
          season: 'fall',
          image_url: 'https://cdn.myanimelist.net/images/anime/1337/99013.jpg',
          year: 2011,
          status: 'Finished Airing',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_uid: 'RyMIKpIe25ZFs0F6ibZLlIIkM2z1',
          mal_id: 21,
          title: 'One Piece',
          media_type: 'series',
          season: 'fall',
          image_url: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
          year: 1999,
          status: 'Currently Airing',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'library',
      {
        user_uid: 'RyMIKpIe25ZFs0F6ibZLlIIkM2z1',
        mal_id: { [Sequelize.Op.in]: [11061, 21] },
      },
      {},
    );
  },
};
