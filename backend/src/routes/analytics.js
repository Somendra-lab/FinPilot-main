import express from 'express';
import { protect } from '../middleware/auth.js';
import { generateAnalytics } from '../services/analytics.js';

const router = express.Router();

router.get('/insights', protect, async (req, res) => {
  try {
    const analytics = await generateAnalytics(req.userId);
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to generate analytics' });
  }
});

export default router;
