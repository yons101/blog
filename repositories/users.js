const { User } = require("../models");
module.exports = {
  getAllUsers() {
    return User.findAll();
  },
  getUsers(offset, limit) {
    return User.findAll({ offset, limit });
  },
  getAdmins() {
    return User.findAll({
      where: {
        role: "admin",
      },
    });
  },
  getAuthors() {
    return User.findAll({
      where: {
        role: "author",
      },
    });
  },
  getGuests() {
    return User.findAll({
      where: {
        role: "guest",
      },
    });
  },
  getUser(id) {
    return User.findAll({
      where: {
        id,
      },
    });
  },
  getUserByEmail(email) {
    return User.findAll({
      where: {
        email,
      },
    });
  },
  addUser(user) {
    return User.create(user);
  },
  async updateUser(user, id) {
    await User.update(user, {
      where: {
        id,
      },
    });
    return User.findAll({
      where: {
        id,
      },
    });
  },
  deleteUser(id) {
    User.destroy({
      where: {
        id,
      },
    });
  },
};
