const { Tag } = require("../models");
module.exports = {
  getAllTags() {
    return Tag.findAll();
  },
  getTags(offset, limit) {
    return Tag.findAll({ offset, limit });
  },
  getTag(id) {
    return Tag.findAll({
      where: {
        id,
      },
    });
  },
  addTag(tag) {
    return Tag.create(tag);
  },
  async updateTag(tag, id) {
    await Tag.update(tag, {
      where: {
        id,
      },
    });
    return Tag.findAll({
      where: {
        id,
      },
    });
  },
  deleteTag(id) {
    Tag.destroy({
      where: {
        id,
      },
    });
  },
};
