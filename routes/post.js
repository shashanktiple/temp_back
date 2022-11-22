const express = require("express");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");

const privateKey = ``;

const router = express.Router();

//------use
router.use(function (req, res, next) {
  if (req.header("Authorization")) {
    try {
      req.payload = jwt.verify(req.header("Authorization"), privateKey, {
        algorithms: ["RS256"],
      });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

//-----post
router.post("/", async function (req, res) {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.payload.id,
    dateCreated: req.body.dateCreated,
    isCompleted: false,
    dateCompleted: "",
  });
  console.log("Post call");
  return post
    .save()
    .then((savedPost) => {
      return res.status(201).json({
        _id: savedPost._id,
        title: savedPost.title,
        content: savedPost.content,
        author: savedPost.author,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: "Something is went wrong." });
    });
});

router.get("/", async function (req, res, next) {
  const posts = await Post.find().where("author").equals(req.payload.id).exec();

  return res.status(200).json({ posts: posts });
});

//-------get
router.get("/:id", async function (req, res, next) {
  const post = await Post.findOne().where("_id").equals(req.params.id).exec();

  return res.status(200).json(post);
});

//--------delete
router.delete("/delete/:id", async function (req, res, next) {
  const post = await Post.findOneAndDelete()
    .where("_id")
    .equals(req.params.id)
    .exec();
  if (post) {
    return res.status(200).json(post);
  } else {
    return res.status(404).json({ error: "Can not delete Post " });
  }
});

//-------put
router.put("/update/:id", async function (req, res) {
  const post = await Post.findByIdAndUpdate()
    .where("_id")
    .equals(req.params.id)
    .exec();

  if (post) {
    (post.isCompleted = req.body.isCompleted),
      (post.dateCompleted = req.body.dateCompleted);
    post.save();
    return res.status(200).json(post);
  } else {
    return res.status(409).json({ error: "Can not update Post" });
  }
});

module.exports = router;
