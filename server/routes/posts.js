import express from "express";
import { body, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import Post from "../models/Post.js";
import Category from "../models/Category.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// configure multer for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + (file.originalname || "image"));
  },
});
const upload = multer({ storage });

// GET /api/posts?search=&category=&page=&limit=
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { content: new RegExp(search, "i") },
      ];
    }
    if (category) query.category = category;

    const posts = await Post.find(query)
      .populate("author", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/posts/:id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email")
      .populate("category", "name");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts (create)
router.post(
  "/",
  auth,
  upload.single("featuredImage"),
  [
    body("title").notEmpty().withMessage("Title required"),
    body("content").notEmpty().withMessage("Content required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { title, content, category } = req.body;

      const post = new Post({
        title,
        content,
        author: req.user._id,
        category: category || undefined,
        featuredImage: req.file ? req.file.filename : undefined,
      });

      await post.save();
      await post.populate([
        { path: "author", select: "name email" },
        { path: "category", select: "name" },
      ]);

      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/posts/:id
router.put(
  "/:id",
  auth,
  upload.single("featuredImage"),
  [
    body("title").optional().notEmpty(),
    body("content").optional().notEmpty(),
  ],
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updates = {};
      if (req.body.title) updates.title = req.body.title;
      if (req.body.content) updates.content = req.body.content;
      if (req.body.category) updates.category = req.body.category;
      if (req.file) updates.featuredImage = req.file.filename;

      const updated = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true }
      )
        .populate("author", "name email")
        .populate("category", "name");

      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE /api/posts/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
