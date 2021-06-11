require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
  authJWT: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) {
        res.status(403);
        res.json({ error: "Unauthorized!" });
      }
      req.user = user;
      next();
    });
  },
};
