import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Budget from '../models/Budget.js';

const router = express.Router();

// Get all budgets
router.get('/', protect, async (req, res) => {
  try {
    const { month } = req.query;
    const filter = { userId: req.userId };

    if (month) filter.month = month;

    const budgets = await Budget.find(filter).limit(100);
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create budget
router.post('/', protect,
  [
    body('category').trim().notEmpty().withMessage('Category is required').escape(),
    body('limit').isFloat({ min: 0.01 }).withMessage('Limit must be a positive number'),
    body('month').optional().matches(/^\d{4}-\d{2}$/).withMessage('Month must be in YYYY-MM format')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { category, limit, month } = req.body;

      const budget = new Budget({
        userId: req.userId,
        category,
        limit,
        month: month || new Date().toISOString().substring(0, 7)
      });

      await budget.save();
      res.status(201).json(budget);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update budget
router.put('/:id', protect, async (req, res) => {
  try {
    // Whitelist allowed fields to prevent mass assignment
    const allowed = ['category', 'limit', 'spent', 'month', 'alerts'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete budget
router.delete('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
