"use strict";
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const users = [];
      const articles = [];
      const tags = [];
      const articleTags = [];
      const comments = [];
      for (let i = 0; i < 20; i++) {
        let date = faker.date.between("01/01/2000", "01/01/2021");
        users.push({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          role: i < 3 ? "admin" : i > 3 && i < 10 ? "author" : "guest",
          createdAt: date,
          updatedAt: date,
        });
      }
      // let sequelize = queryInterface.sequelize;
      await queryInterface.bulkInsert("users", users, {});

      const createdUsers = await queryInterface.sequelize.query(
        "SELECT * FROM users",
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        }
      );
      createdUsers.forEach((user) => {
        let nbArticles = Math.ceil(Math.random() * (10 - 2) + 2);
        let nextDay = new Date(user.createdAt);
        for (let i = 0; i < nbArticles; i++) {
          nextDay.setDate(nextDay.getDate() + 1);
          articles.push({
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(),
            image: `https://picsum.photos/500/500?random=${faker.random.number()}`,
            published: faker.datatype.boolean(),
            createdAt: nextDay,
            updatedAt: nextDay,
            UserId: user.id,
          });
        }
      });

      await queryInterface.bulkInsert("articles", articles, {});

      const createdArticles = await queryInterface.sequelize.query(
        "SELECT * FROM articles",
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        }
      );

      for (let i = 0; i < 10; i++) {
        tags.push({
          name: `${faker.commerce.color()} ${faker.company.bsBuzz()} ${faker.company.bsNoun()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      await queryInterface.bulkInsert("tags", tags, {});

      const createdTags = await queryInterface.sequelize.query(
        "SELECT * FROM tags",
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        }
      );

      createdArticles.forEach((article) => {
        //Chaque article est commenté avec entre 0 et 10 commentaires.
        let nbComments = Math.ceil(Math.random() * 10);
        for (let i = 0; i < nbComments; i++) {
          comments.push({
            content: faker.lorem.sentence(),
            ArticleId: article.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        //Chaque article est taggé avec entre 2 et 6 tags
        let nbArticlesTags = Math.ceil(Math.random() * 6);
        for (let i = 0; i < nbArticlesTags; i++) {
          articleTags.push({
            ArticleId: article.id,
            TagId: createdTags[i].id,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      });
      await queryInterface.bulkInsert("comments", comments, {});
      await queryInterface.bulkInsert("articletags", articleTags, {});
    } catch (error) {
      console.log(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("articles");
    await queryInterface.dropTable("tags");
    await queryInterface.dropTable("comments");
    await queryInterface.dropTable("articletags");
  },
};
