"use strict";
const faker = require("faker");
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    const hashedPassword = await bcrypt.hash("123456", 10);

    for (let i = 0; i < 20; i++) {
      users.push({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: i < 3 ? "admin" : i > 3 && i < 10 ? "author" : "guest",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert("users", users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
