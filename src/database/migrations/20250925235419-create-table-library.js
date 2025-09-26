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
        type: Sequelize.ENUM('movie', 'series'),
        allowNull: false,
      },

      season: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      //(same as Jikan: Finished, Currently Airing, etc.)
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('library');
  },
};
