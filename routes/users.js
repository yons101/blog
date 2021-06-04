const router = require("express").Router();
const usersRepo = require("../repositories/users");

// GET all users.
router.get("/", async function (req, res, next) {
  res.json(await usersRepo.getAllUsers());
});
// Search by email
router.get("/email/:email", async function (req, res, next) {
  res.json(await usersRepo.getUserByEmail(req.params.email));
});
// GET users by offset and limit
router.get("/:offset/:limit", async function (req, res, next) {
  res.json(
    await usersRepo.getUsers(
      parseInt(req.params.offset),
      parseInt(req.params.limit)
    )
  );
});
// GET users with admin role
router.get("/admins", async function (req, res, next) {
  res.json(await usersRepo.getAdmins());
});
// GET users with author role
router.get("/authors", async function (req, res, next) {
  res.json(await usersRepo.getAuthors());
});
// GET users with guest role
router.get("/guests", async function (req, res, next) {
  res.json(await usersRepo.getGuests());
});
// GET user with an id
router.get("/:id", async function (req, res, next) {
  res.json(await usersRepo.getUser(req.params.id));
});
// Add a user
router.post("/", async function (req, res, next) {
  const users = await usersRepo.getAllUsers();
  users.forEach((user) => {
    if (user.username === req.body.username) {
      res.json({ error: "Username Taken" });
      return;
    }
    if (user.email === req.body.email) {
      res.json({ error: "Email Taken" });
      return;
    }
  });
  res.json(await usersRepo.addUser(req.body));
});
// Update user with id
router.put("/:id", async function (req, res, next) {
  const users = await usersRepo.getAllUsers();
  users.forEach((user) => {
    if (user.username === req.body.username && user.id != req.params.id) {
      res.json({ error: "Username Taken" });
    }
    if (user.email === req.body.email && user.id != req.params.id) {
      res.json({ error: "Email Taken" });
    }
  });
  res.json(await usersRepo.updateUser(req.body, req.params.id));
});
// Delete user with id
router.delete("/:id", async function (req, res, next) {
  const users = await usersRepo.getAllUsers();
  let isFound = false;
  users.forEach((user) => {
    if (user.id == req.params.id) {
      isFound = true;
      return;
    }
  });
  if (isFound) {
    usersRepo.deleteUser(parseInt(req.params.id));
    res.json({ message: `User with id ${req.params.id} has been deleted!` });
  }
  res.json({ error: `No user with id ${req.params.id}!` });
});

module.exports = router;
