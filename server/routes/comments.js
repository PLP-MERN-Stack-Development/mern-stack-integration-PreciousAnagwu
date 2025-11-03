// server/routes/comments.js -- add comments to posts
import express from "express";
const router = express.Router();
import { body, validationResult } from 'express-validator';

import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";

// POST /api/comments/:postId
router.post('/:postId', auth, [
  body('text').notEmpty().withMessage('Text required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = new Comment({
      post: post._id,
      author: req.user._id,
      text: req.body.text
    });
    await comment.save();
    await comment.populate('author', 'name');
    res.status(201).json(comment);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/comments/:postId
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

export default router;
