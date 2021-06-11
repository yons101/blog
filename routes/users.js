const router = require("express").Router();
const usersRepo = require("../repositories/users");
const { authenticateJWT, checkAuthJWT } = require("../auth");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Login
router.post("/login", async function (req, res, next) {
  const login = await usersRepo.login(req.body);
  if (login) {
    const accessToken = jwt.sign(
      login.toJSON(),
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ accessToken });
    return;
  }
  res.status(401);
  res.json({ error: "Wrong username or password" });
});
// signup
router.post(["/", "/signup"], async function (req, res, next) {
  const users = await usersRepo.getAllUsers();
  users.forEach((user) => {
    if (user.username === req.body.username) {
      res.status(409);
      res.json({ error: "Username Taken" });
      return;
    }
    if (user.email === req.body.email) {
      res.status(409);
      res.json({ error: "Email Taken" });
      return;
    }
  });
  if (!req.body.username) {
    res.status(400);
    res.json({ error: "Username is required" });
    return;
  }
  if (!req.body.email) {
    res.status(400);
    res.json({ error: "Email is required" });
    return;
  }
  if (!req.body.password) {
    res.status(400);
    res.json({ error: "Password is required" });
    return;
  }
  const signup = await usersRepo.addUser(req.body);
  if (signup) {
    const accessToken = jwt.sign(
      signup.toJSON(),
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ accessToken });
    return;
  }
});
// check auth, for frontend
router.post("/check-auth", async function (req, res, next) {
  let token = req.body.token;
  if (token == null) {
    res.status(401);
    res.json({ error: "Unauthorized" });
    return;
  }
  try {
    res.json(jwt.verify(token, process.env.ACCESS_TOKEN_SECRET));
  } catch (error) {
    res.json({ error: "Unauthorized" });
  }
});

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
// Update user with id
router.put("/:id", async function (req, res, next) {
  const users = await usersRepo.getAllUsers();
  users.forEach((user) => {
    if (user.username === req.body.username && user.id != req.params.id) {
      res.status(409);
      res.json({ error: "Username Taken" });
      return;
    }
    if (user.email === req.body.email && user.id != req.params.id) {
      res.status(409);
      res.json({ error: "Email Taken" });
      return;
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
    return;
  }
  res.status(404);
  res.json({ error: `No user with id ${req.params.id}!` });
});

module.exports = router;
