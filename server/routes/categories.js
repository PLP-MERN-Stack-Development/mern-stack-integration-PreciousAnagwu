import express from "express";
import { body, validationResult } from "express-validator";
import Category from "../models/Category.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort("name");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/categories
router.post(
  "/",
  auth,
  [body("name").notEmpty().withMessage("Name is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name } = req.body;

    try {
      const exists = await Category.findOne({ name });
      if (exists)
        return res.status(400).json({ message: "Category already exists" });

      const category = new Category({ name });
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
