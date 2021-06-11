const router = require("express").Router();
const tagsRepo = require("../repositories/tags");

// GET all tags.
router.get("/", async function (req, res, next) {
  res.json(await tagsRepo.getAllTags());
});

// GET tags by offset and limit
router.get("/:offset/:limit", async function (req, res, next) {
  res.json(
    await tagsRepo.getTags(
      parseInt(req.params.offset),
      parseInt(req.params.limit)
    )
  );
});
// GET tag with an id
router.get("/:id", async function (req, res, next) {
  res.json(await tagsRepo.getTag(req.params.id));
});
// Add a tag
router.post("/", async function (req, res, next) {
  const tags = await tagsRepo.getAllTags();
  let isFound = false;
  tags.forEach((tag) => {
    if (tag.name == req.body.name) {
      isFound = true;
      return;
    }
  });
  if (isFound) {
    res.status(409);
    res.json({ error: `Tag name must be unique` });
    return;
  }
  res.json(await tagsRepo.addTag(req.body));
});
// Update tag with id
router.put("/:id", async function (req, res, next) {
  const tag = await tagsRepo.getTag(req.params.id);
  if (tag.length == 0) {
    res.status(404);
    res.json({ error: `No tag with id ${req.params.id}!` });
    return;
  }
  res.json(await tagsRepo.updateTag(req.body, req.params.id));
});
// Delete tag with id
router.delete("/:id", async function (req, res, next) {
  const tags = await tagsRepo.getAllTags();
  let isFound = false;
  tags.forEach((tag) => {
    if (tag.id == req.params.id) {
      isFound = true;
      return;
    }
  });
  if (isFound) {
    tagsRepo.deleteTag(parseInt(req.params.id));
    res.json({ message: `Tag with id ${req.params.id} has been deleted!` });
    return;
  }
  res.status(404);
  res.json({ error: `No tag with id ${req.params.id}!` });
});

module.exports = router;
