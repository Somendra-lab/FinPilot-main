import express from 'express';
import { protect } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import Goal from '../models/Goal.js';
import Budget from '../models/Budget.js';
import Subscription from '../models/Subscription.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Get monthly stats
    const transactions = await Transaction.find({
      userId: req.userId,
      date: {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
        $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
      }
    });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Get active goals
    const activeGoals = await Goal.find({
      userId: req.userId,
      status: 'active'
    }).limit(3);

    // Get budget status
    const budgets = await Budget.find({
      userId: req.userId,
      month: currentMonth
    });

    // Get active subscriptions
    const subscriptions = await Subscription.find({
      userId: req.userId,
      active: true
    });

    const frequencyMultiplier = { daily: 30, weekly: 4, monthly: 1, yearly: 1 / 12 };
    const monthlySubscriptionCost = subscriptions
      .reduce((sum, s) => sum + s.amount * (frequencyMultiplier[s.frequency] || 1), 0);

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      monthlySubscriptionCost,
      transactionCount: transactions.length,
      activeGoals: activeGoals.length,
      budgetCount: budgets.length,
      subscriptionCount: subscriptions.length,
      goals: activeGoals,
      budgets,
      subscriptions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
