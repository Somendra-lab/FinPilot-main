import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Newsletter from '../models/Newsletter.js';

const router = express.Router();

// Subscribe to newsletter
router.post(
  '/subscribe',
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      // Check if already subscribed
      let subscription = await Newsletter.findOne({ email });

      if (subscription) {
        if (subscription.subscribed) {
          return res.status(400).json({
            success: false,
            message: 'This email is already subscribed'
          });
        }
        // Resubscribe
        subscription.subscribed = true;
        subscription.subscribedAt = new Date();
        subscription.unsubscribedAt = undefined;
        await subscription.save();
      } else {
        // Create new subscription
        subscription = new Newsletter({
          email,
          subscribed: true,
          subscribedAt: new Date()
        });
        await subscription.save();
      }

      res.status(201).json({
        success: true,
        message: 'Successfully subscribed to our newsletter!',
        data: subscription
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error subscribing to newsletter'
      });
    }
  }
);

// Unsubscribe from newsletter
router.post(
  '/unsubscribe',
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      const subscription = await Newsletter.findOne({ email });

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: 'Email not found'
        });
      }

      subscription.subscribed = false;
      subscription.unsubscribedAt = new Date();
      await subscription.save();

      res.status(200).json({
        success: true,
        message: 'Successfully unsubscribed from newsletter'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error unsubscribing from newsletter'
      });
    }
  }
);

// Get newsletter stats (Admin)
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments({ subscribed: true });
    const totalUnsubscribed = await Newsletter.countDocuments({ subscribed: false });
    const recentSubscribers = await Newsletter.find({ subscribed: true })
      .sort({ subscribedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalSubscribers,
        totalUnsubscribed,
        recentSubscribers
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching newsletter stats' });
  }
});

export default router;
