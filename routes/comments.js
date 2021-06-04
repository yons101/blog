const router = require("express").Router();
const commentsRepo = require("../repositories/comments");
const articlesRepo = require("../repositories/articles");

// GET all comments.
router.get("/", async function (req, res, next) {
  res.json(await commentsRepo.getAllComments());
});
// GET comments by offset and limit
router.get("/:offset/:limit", async function (req, res, next) {
  res.json(
    await commentsRepo.getComments(
      parseInt(req.params.offset),
      parseInt(req.params.limit)
    )
  );
});
// GET comment with an id
router.get("/:id", async function (req, res, next) {
  res.json(await commentsRepo.getComment(req.params.id));
});
// Add a comment
router.post("/", async function (req, res, next) {
  const articles = await articlesRepo.getAllArticles();
  let isFound = false;
  articles.forEach((article) => {
    if (article.id == req.body.ArticleId) {
      isFound = true;
      return;
    }
  });
  if (isFound) {
    res.json(await commentsRepo.addComment(req.body));
  }
  res.json({ error: `No article with id ${req.body.ArticleId}!` });
});
// Update comment with id
router.put("/:id", async function (req, res, next) {
  const articles = await articlesRepo.getAllArticles();
  const comment = await commentsRepo.getComment(req.params.id);
  if (comment.length == 0) {
    res.json({ error: `No comment with id ${req.params.id}!` });
  }
  let articleIsFound = false;
  articles.forEach((article) => {
    if (article.id == req.body.ArticleId) {
      articleIsFound = true;
      return;
    }
  });
  if (articleIsFound) {
    res.json(await commentsRepo.updateComment(req.body, req.params.id));
  }
  res.json({ error: `No article with id ${req.body.ArticleId}!` });
});
// Delete comment with id
router.delete("/:id", async function (req, res, next) {
  const comments = await commentsRepo.getAllComments();
  let isFound = false;
  comments.forEach((comment) => {
    if (comment.id == req.params.id) {
      isFound = true;
      return;
    }
  });
  if (isFound) {
    commentsRepo.deleteComment(parseInt(req.params.id));
    res.json({ message: `Comment with id ${req.params.id} has been deleted!` });
  }
  res.json({ error: `No comment with id ${req.params.id}!` });
});

module.exports = router;
