import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Subscription from '../models/Subscription.js';

const router = express.Router();

// Get all subscriptions
router.get('/', protect, async (req, res) => {
  try {
    const { active } = req.query;
    const filter = { userId: req.userId };

    if (active !== undefined) filter.active = active === 'true';

    const subscriptions = await Subscription.find(filter).sort({ startDate: -1 }).limit(100);
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create subscription
router.post('/', protect,
  [
    body('name').trim().notEmpty().withMessage('Name is required').escape(),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
    body('frequency').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Frequency must be daily, weekly, monthly, or yearly'),
    body('category').optional().trim().escape(),
    body('description').optional().trim().escape(),
    body('startDate').optional().isISO8601().withMessage('Start date must be a valid date')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, amount, frequency, category, startDate, description } = req.body;

      const subscription = new Subscription({
        userId: req.userId,
        name,
        amount,
        frequency,
        category,
        startDate: startDate || new Date(),
        description
      });

      await subscription.save();
      res.status(201).json(subscription);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update subscription
router.put('/:id', protect, async (req, res) => {
  try {
    // Whitelist allowed fields to prevent mass assignment
    const allowed = ['name', 'amount', 'frequency', 'category', 'description', 'startDate', 'endDate', 'active', 'autoRenew', 'paymentMethod', 'notes'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const subscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel subscription
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { active: false, endDate: new Date() },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete subscription
router.delete('/:id', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
