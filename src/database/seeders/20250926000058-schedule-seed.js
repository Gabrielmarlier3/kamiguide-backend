'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('schedule', [
      {
        user_uid: 'RyMIKpIe25ZFs0F6ibZLlIIkM2z1',
        mal_id: 5114,
        day: 'monday',
        title: 'Fullmetal Alchemist: Brotherhood',
        release_time: '18:00',
        episode_count: 64,
        image_url: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_uid: 'RyMIKpIe25ZFs0F6ibZLlIIkM2z1',
        mal_id: 9253,
        day: 'wednesday',
        title: 'Steins;Gate',
        release_time: '20:00',
        episode_count: 24,
        image_url: 'https://cdn.myanimelist.net/images/anime/5/73199.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('schedule', {
      user_uid: 'RyMIKpIe25ZFs0F6ibZLlIIkM2z1'
    }, {});
  }
};
