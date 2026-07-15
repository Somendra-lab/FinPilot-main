import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// Create feedback
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
    body('email').isEmail().withMessage('Valid email is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 10, max: 2000 })
      .withMessage('Message must be between 10 and 2000 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, rating, message } = req.body;

      const feedback = new Feedback({
        name,
        email,
        rating,
        message
      });

      await feedback.save();

      res.status(201).json({
        success: true,
        message: 'Thank you for your feedback!',
        data: feedback
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Duplicate field value' });
      }
      res.status(500).json({ message: 'Error submitting feedback' });
    }
  }
);

// Get all feedback (Admin — requires authentication)
router.get('/', protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedbacks' });
  }
});

// Get feedback stats (Admin — requires authentication)
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const totalFeedbacks = await Feedback.countDocuments();
    const avgRating = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const ratingDistribution = await Feedback.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalFeedbacks,
        averageRating: avgRating[0]?.averageRating || 0,
        ratingDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

export default router;
