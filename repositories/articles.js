const { Article } = require("../models");
module.exports = {
  getAllArticles() {
    return Article.findAll();
  },
  test(article, tag) {
    return article.addTags(tag);
  },
  getArticles(offset, limit) {
    return Article.findAll({ offset, limit });
  },
  getArticle(id) {
    return Article.findOne({
      where: {
        id,
      },
    });
  },
  addArticle(article) {
    return Article.create(article);
  },
  async updateArticle(article, id) {
    await Article.update(article, {
      where: {
        id,
      },
    });
    return Article.findAll({
      where: {
        id,
      },
    });
  },
  deleteArticle(id) {
    Article.destroy({
      where: {
        id,
      },
    });
  },
};
