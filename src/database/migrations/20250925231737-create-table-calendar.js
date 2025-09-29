'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schedule', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      user_uid: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      mal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      day: {
        type: Sequelize.ENUM(
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ),
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      release_time: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      episode_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      last_week: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
    await queryInterface.addConstraint('schedule', {
      fields: ['user_uid', 'mal_id'],
      type: 'unique',
      name: 'unique_user_mal_id_schedule',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('schedule', 'unique_user_mal_id_schedule');
    await queryInterface.dropTable('schedule');
  },
};
