const router = require("express").Router();
const articlesRepo = require("../repositories/articles");
const commentsRepo = require("../repositories/comments");
const { authJWT } = require("../auth");

// GET all articles.
router.get("/", async function (req, res, next) {
  res.json(await articlesRepo.getAllArticles());
});
// GET all comments of article with an id
router.get("/:id/comments", async function (req, res, next) {
  res.json(await commentsRepo.getCommentsByArticle(req.params.id));
});
// GET articles by offset and limit
router.get("/:offset/:limit", async function (req, res, next) {
  res.json(
    await articlesRepo.getArticles(
      parseInt(req.params.offset),
      parseInt(req.params.limit)
    )
  );
});
// GET article with an id
router.get("/:id", async function (req, res, next) {
  res.json(await articlesRepo.getArticle(req.params.id));
});
// Add a article
router.post("/", authJWT, async function (req, res, next) {
  try {
    if (req.user.role === "admin" || req.user.role === "author") {
      res.json(await articlesRepo.addArticle(req.body));
    } else {
      res.status(403); //conflict
      res.json({ error: "Unauthorized" });
      return;
    }
  } catch (error) {
    if (error.errors[0].path == "title") {
      res.status(409); //conflict
      res.json({ error: "Title must be unique" });
      return;
    }
  }
});
// Update article with id
router.put("/:id", authJWT, async function (req, res, next) {
  const articles = await articlesRepo.getAllArticles();
  articles.forEach((article) => {
    if (article.title === req.body.title && article.id != req.params.id) {
      res.status(409);
      res.json({ error: "Title must be unique" });
      return;
    }
  });
  if (req.user.role === "admin" || req.user.role === "author") {
    const article = await articlesRepo.updateArticle(req.body, req.params.id);
    if (article.length > 0) {
      res.json(article);
      return;
    }
    res.status(404);
    res.json({ error: "Article not found" });
    return;
  } else {
    res.status(403); //conflict
    res.json({ error: "Unauthorized" });
    return;
  }
});
// Delete article with id
router.delete("/:id", authJWT, async function (req, res, next) {
  const articles = await articlesRepo.getAllArticles();
  let isFound = false;
  articles.forEach((article) => {
    if (article.id == req.params.id) {
      isFound = true;
      return;
    }
  });
  if (isFound) {
    if (req.user.role === "admin" || req.user.role === "author") {
      articlesRepo.deleteArticle(parseInt(req.params.id));
      res.json({
        message: `Article with id ${req.params.id} has been deleted!`,
      });
      return;
    } else {
      res.status(403); //conflict
      res.json({ error: "Unauthorized" });
      return;
    }
  } else {
    res.status(404);
    res.json({ error: `No article with id ${req.params.id}!` });
    return;
  }
});

module.exports = router;
