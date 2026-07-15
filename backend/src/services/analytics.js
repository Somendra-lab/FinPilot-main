import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';

export async function generateAnalytics(userId) {
  try {
    // Get last 12 months of transactions
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: oneYearAgo }
    }).sort({ date: -1 });

    // Calculate spending trend
    const spendingByMonth = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toISOString().substring(0, 7);
      if (!spendingByMonth[month]) spendingByMonth[month] = 0;
      if (t.type === 'expense') spendingByMonth[month] += t.amount;
    });

    const spendingTrend = Object.entries(spendingByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }))
      .slice(-12);

    // Category breakdown
    const categoryBreakdown = {};
    let totalExpenses = 0;
    transactions.forEach(t => {
      if (t.type === 'expense') {
        if (!categoryBreakdown[t.category]) categoryBreakdown[t.category] = 0;
        categoryBreakdown[t.category] += t.amount;
        totalExpenses += t.amount;
      }
    });

    const categories = Object.entries(categoryBreakdown)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Monthly comparison
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

    const thisMonthExpenses = spendingByMonth[currentMonth] || 0;
    const lastMonthExpenses = spendingByMonth[lastMonthStr] || 0;
    const monthlyChange = lastMonthExpenses > 0 
      ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : 0;

    // Calculate savings rate for the current month
    let thisMonthIncome = 0;
    transactions.forEach(t => {
      if (t.type === 'income') {
        const month = new Date(t.date).toISOString().substring(0, 7);
        if (month === currentMonth) {
          thisMonthIncome += t.amount;
        }
      }
    });

    const savingsRate = thisMonthIncome > 0 
      ? ((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) * 100 
      : 0;

    // Average transaction
    const averageTransaction = transactions.length > 0 
      ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
      : 0;

    // Largest expense
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const largestExpense = expenseTransactions.length > 0
      ? expenseTransactions.reduce((max, t) => t.amount > max.amount ? { category: t.category, amount: t.amount } : max, { category: 'N/A', amount: 0 })
      : { category: 'N/A', amount: 0 };

    // Generate recommendations
    const recommendations = generateRecommendations({
      monthlyChange,
      savingsRate,
      categories,
      avgTransaction: averageTransaction
    });

    return {
      spendingTrend,
      categoryBreakdown: categories,
      monthlyComparison: {
        thisMonth: thisMonthExpenses,
        lastMonth: lastMonthExpenses,
        change: monthlyChange
      },
      savingsRate,
      averageTransaction,
      largestExpense,
      recommendations
    };
  } catch (error) {
    console.error('Analytics generation error:', error);
    throw error;
  }
}

function generateRecommendations(data) {
  const recommendations = [];

  if (data.monthlyChange > 20) {
    recommendations.push('Your spending increased by more than 20% this month. Consider reviewing your budget.');
  }

  if (data.savingsRate < 20) {
    recommendations.push('Your savings rate is below 20%. Try to increase it by reducing discretionary spending.');
  }

  if (data.categories[0] && data.categories[0].percentage > 40) {
    recommendations.push(`${data.categories[0].category} represents over 40% of your expenses. Look for ways to optimize this category.`);
  }

  if (data.avgTransaction < 50) {
    recommendations.push('You have many small transactions. Consider bundling errands to reduce frequent small purchases.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Great job maintaining your budget! Keep up the good financial habits.');
  }

  return recommendations;
}
