const { User } = require("../models");
module.exports = {
  login(user) {
    if (user.username.includes("@")) {
      return User.findOne({
        where: {
          email: user.username,
          password: user.password,
        },
      });
    }
    return User.findOne({
      where: {
        username: user.username,
        password: user.password,
      },
    });
  },

  getAllUsers() {
    return User.findAll();
  },
  // méthodes à implémenter
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
    return User.findOne({
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
