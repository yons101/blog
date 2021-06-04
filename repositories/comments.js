const { Comment } = require("../models");
module.exports = {
  getAllComments() {
    return Comment.findAll();
  },
  getComments(offset, limit) {
    return Comment.findAll({ offset, limit });
  },
  getCommentsByArticle(id) {
    return Comment.findAll({
      where: {
        ArticleId: id,
      },
    });
  },
  getComment(id) {
    return Comment.findAll({
      where: {
        id,
      },
    });
  },
  addComment(comment) {
    return Comment.create(comment);
  },
  async updateComment(comment, id) {
    await Comment.update(comment, {
      where: {
        id,
      },
    });
    return Comment.findAll({
      where: {
        id,
      },
    });
  },
  deleteComment(id) {
    Comment.destroy({
      where: {
        id,
      },
    });
  },
};
