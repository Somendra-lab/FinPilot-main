import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Goal from '../models/Goal.js';

const router = express.Router();

// Get all goals
router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.userId };

    if (status) filter.status = status;

    const goals = await Goal.find(filter).sort({ deadline: 1 }).limit(100);
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create goal
router.post('/', protect,
  [
    body('title').trim().notEmpty().withMessage('Title is required').escape(),
    body('targetAmount').isFloat({ min: 0.01 }).withMessage('Target amount must be a positive number'),
    body('deadline').isISO8601().withMessage('Deadline must be a valid date'),
    body('description').optional().trim().escape(),
    body('category').optional().isIn(['savings', 'debt-payoff', 'investment', 'other']).withMessage('Invalid category'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, targetAmount, deadline, category, priority } = req.body;

      const goal = new Goal({
        userId: req.userId,
        title,
        description,
        targetAmount,
        deadline,
        category,
        priority
      });

      await goal.save();
      res.status(201).json(goal);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update goal
router.put('/:id', protect, async (req, res) => {
  try {
    // Whitelist allowed fields to prevent mass assignment
    const allowed = ['title', 'description', 'targetAmount', 'currentAmount', 'deadline', 'category', 'priority', 'status'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete goal
router.delete('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
