'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('library', {
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

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      media_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      season: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      image_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      // (same as Jikan: Finished, Currently Airing, etc.)
      status: {
        type: Sequelize.STRING,
        allowNull: false,
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

    await queryInterface.addConstraint('library', {
      fields: ['user_uid', 'mal_id'],
      type: 'unique',
      name: 'unique_user_mal_id_library',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('library', 'unique_user_mal_id_library');
    await queryInterface.dropTable('library');
  },
};
