import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Filler
} from 'chart.js';

import Layout from '../components/Layout';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import './Dashboard.css';

// Register ChartJS elements
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Filler
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [chartTab, setChartTab] = useState('expense'); // 'expense' or 'cashflow'
  const [fundingGoalId, setFundingGoalId] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);

  // Form state
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().substring(0, 10)
  });

  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [dashRes, transRes] = await Promise.all([
        apiClient.get('/dashboard'),
        apiClient.get('/transactions')
      ]);
      setData(dashRes.data);
      setTransactions(transRes.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="page-loading">
          <div className="spinner"></div>
          Loading your financial overview...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="page-error">{error}</div>
      </Layout>
    );
  }

  // Get current month format YYYY-MM
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Filter current month's transactions
  const currentMonthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    const tMonthStr = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
    return tMonthStr === currentMonthStr;
  });

  // Calculate live budget spending locally to ensure real-time accuracy
  const computedBudgets = (data?.budgets || []).map(budget => {
    const spentForCategory = currentMonthTransactions
      .filter(t => t.type === 'expense' && t.category.toLowerCase() === budget.category.toLowerCase())
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      ...budget,
      spent: spentForCategory
    };
  });

  // Category Expense Chart Setup (Doughnut)
  const expensesByCategory = {};
  currentMonthTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const cat = t.category.trim();
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + t.amount;
    });

  const doughnutLabels = Object.keys(expensesByCategory);
  const doughnutDataValues = Object.values(expensesByCategory);
  const doughnutColors = [
    '#4f46e5', // Primary Indigo
    '#10b981', // Accent Emerald
    '#f59e0b', // Warning Amber
    '#ef4444', // Danger Rose
    '#a855f7', // Purple
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#84cc16'  // Lime
  ];

  const doughnutChartData = {
    labels: doughnutLabels,
    datasets: [
      {
        data: doughnutDataValues,
        backgroundColor: doughnutColors.slice(0, doughnutLabels.length),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 12,
            weight: '600'
          },
          color: '#4b5563'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` $${context.raw.toFixed(2)}`
        }
      }
    }
  };

  // Cash Flow Chart Setup (Bar Chart)
  const barChartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Cash Flow',
        data: [data?.totalIncome || 0, data?.totalExpenses || 0],
        backgroundColor: ['rgba(16, 185, 129, 0.85)', 'rgba(239, 68, 68, 0.85)'],
        borderColor: ['#10b981', '#ef4444'],
        borderWidth: 1.5,
        borderRadius: 8
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => ` $${context.raw.toFixed(2)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
          color: '#6b7280'
        },
        grid: {
          color: '#f3f4f6'
        }
      },
      x: {
        ticks: {
          color: '#6b7280'
        },
        grid: {
          display: false
        }
      }
    }
  };

  // Handle funding a goal inline
  const handleFundGoalSubmit = async (goalId, currentSaved, targetAmount) => {
    const amt = parseFloat(fundAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid positive saving amount');
      return;
    }
    const newAmount = Math.min(currentSaved + amt, targetAmount);
    try {
      await apiClient.put(`/goals/${goalId}`, {
        currentAmount: newAmount
      });
      setFundingGoalId(null);
      setFundAmount('');
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update goal');
    }
  };

  // Handle Quick Add Transaction
  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    const amt = parseFloat(newTransaction.amount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }
    try {
      await apiClient.post('/transactions', {
        ...newTransaction,
        amount: amt
      });
      setShowAddTransactionModal(false);
      setNewTransaction({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().substring(0, 10)
      });
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to add transaction');
    }
  };

  // Helper for category emoji icons
  const getCategoryIcon = (category) => {
    const cat = category.toLowerCase().trim();
    if (cat.includes('food') || cat.includes('eat') || cat.includes('grocer') || cat.includes('restaur')) return '🍔';
    if (cat.includes('car') || cat.includes('transit') || cat.includes('uber') || cat.includes('taxi') || cat.includes('travel')) return '🚗';
    if (cat.includes('shop') || cat.includes('clothe') || cat.includes('amazon') || cat.includes('gift')) return '🛍️';
    if (cat.includes('rent') || cat.includes('house') || cat.includes('home') || cat.includes('bill')) return '🏠';
    if (cat.includes('utilit') || cat.includes('power') || cat.includes('electric') || cat.includes('water') || cat.includes('internet') || cat.includes('wifi')) return '💡';
    if (cat.includes('movie') || cat.includes('netflix') || cat.includes('music') || cat.includes('game') || cat.includes('entert')) return '🎬';
    if (cat.includes('health') || cat.includes('doctor') || cat.includes('pharm') || cat.includes('med') || cat.includes('gym')) return '🏥';
    if (cat.includes('salary') || cat.includes('income') || cat.includes('dividend') || cat.includes('pay') || cat.includes('bonus')) return '💰';
    return '💵';
  };

  // Generate personalized advisory tip
  const getSmartTip = () => {
    const expenses = data?.totalExpenses || 0;
    const income = data?.totalIncome || 0;
    if (expenses > income && income > 0) {
      return '⚠️ Alert: Your spending exceeds monthly income. Review discretionary costs now.';
    }
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    if (savingsRate > 30) {
      return '🎉 Amazing savings rate! You are building security. Fund a goal or invest!';
    }
    if (data?.monthlySubscriptionCost > 80) {
      return '💡 Subscriptions total over $80/mo. Audit active bills to trim leakage.';
    }
    return '💡 Tip: Set up categories and monthly budgets to keep your money aligned.';
  };

  return (
    <Layout>
      <motion.div
        className="dashboard"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Welcome Section */}
        <div className="welcome-card">
          <div className="welcome-info">
            <h1>Hello, {user?.email?.split('@')[0] || 'User'} 🚀</h1>
            <p>Here's a live check on your financial flight path.</p>
            <div className="welcome-tip">
              <span>{getSmartTip()}</span>
            </div>
          </div>
          <div className="welcome-date">
            <strong>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</strong>
          </div>
        </div>

        {/* Metric Row */}
        <div className="metrics-row">
          <motion.div className="metric-card-glass income" whileHover={{ scale: 1.02 }}>
            <div className="metric-details">
              <h3>Monthly Income</h3>
              <div className="value pos">${(data?.totalIncome || 0).toFixed(2)}</div>
            </div>
            <div className="metric-icon">💰</div>
          </motion.div>

          <motion.div className="metric-card-glass expense" whileHover={{ scale: 1.02 }}>
            <div className="metric-details">
              <h3>Expenses</h3>
              <div className="value">${(data?.totalExpenses || 0).toFixed(2)}</div>
            </div>
            <div className="metric-icon">📉</div>
          </motion.div>

          <motion.div className="metric-card-glass balance" whileHover={{ scale: 1.02 }}>
            <div className="metric-details">
              <h3>Net Savings</h3>
              <div className={`value ${(data?.balance || 0) >= 0 ? 'pos' : 'neg'}`}>
                ${(data?.balance || 0).toFixed(2)}
              </div>
            </div>
            <div className="metric-icon">⚖️</div>
          </motion.div>

          <motion.div className="metric-card-glass subs" whileHover={{ scale: 1.02 }}>
            <div className="metric-details">
              <h3>Subscriptions</h3>
              <div className="value">${(data?.monthlySubscriptionCost || 0).toFixed(2)}</div>
            </div>
            <div className="metric-icon">📅</div>
          </motion.div>
        </div>

        {/* Main Grid Layout */}
        <div className="dashboard-grid-layout">
          {/* Left Column: Visual Insights, Budgets, Goals */}
          <div className="left-panel">
            {/* Visual Insights (Charts) */}
            <div className="dashboard-section-card">
              <h2>📊 Visual Insights</h2>
              <div className="charts-tabs">
                <button
                  className={`chart-tab-btn ${chartTab === 'expense' ? 'active' : ''}`}
                  onClick={() => setChartTab('expense')}
                >
                  Expense Breakdown
                </button>
                <button
                  className={`chart-tab-btn ${chartTab === 'cashflow' ? 'active' : ''}`}
                  onClick={() => setChartTab('cashflow')}
                >
                  Monthly Cash Flow
                </button>
              </div>

              <div className="chart-wrapper">
                {chartTab === 'expense' ? (
                  doughnutLabels.length > 0 ? (
                    <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                  ) : (
                    <div className="empty-chart-state">
                      <p>🍔 No expense data this month.</p>
                      <small>Add transactions to populate the breakdown.</small>
                    </div>
                  )
                ) : (
                  <Bar data={barChartData} options={barChartOptions} />
                )}
              </div>
            </div>

            {/* Budgets Row */}
            <div className="dashboard-section-card">
              <h2>🎯 Active Budgets Progress</h2>
              {computedBudgets.length === 0 ? (
                <div className="empty-state">
                  <p>No budgets set for this month.</p>
                  <Link to="/budgets" className="btn-add" style={{ display: 'inline-block', textDecoration: 'none', marginTop: '0.5rem' }}>
                    + Setup Budgets
                  </Link>
                </div>
              ) : (
                <div className="budgets-grid-dash">
                  {computedBudgets.map(budget => {
                    const ratio = budget.limit > 0 ? budget.spent / budget.limit : 0;
                    const percentage = Math.min(ratio * 100, 100);
                    const isExceeded = budget.spent > budget.limit;
                    const isWarning = ratio >= 0.8 && !isExceeded;
                    const statusClass = isExceeded ? 'exceeded' : isWarning ? 'warning' : 'ok';

                    return (
                      <div key={budget._id} className={`budget-dash-card ${statusClass}`}>
                        <div className="budget-dash-header">
                          <span>{budget.category}</span>
                          <span>${budget.spent.toFixed(0)} / ${budget.limit.toFixed(0)}</span>
                        </div>
                        <div className="budget-bar-container">
                          <motion.div
                            className="budget-bar-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                        <div className="budget-dash-footer">
                          <span className="status">
                            {isExceeded
                              ? `Over limit by $${(budget.spent - budget.limit).toFixed(0)}`
                              : `$${(budget.limit - budget.spent).toFixed(0)} remaining`}
                          </span>
                          <span>{percentage.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Goals Row */}
            <div className="dashboard-section-card">
              <h2>🥅 Active Goals Tracking</h2>
              {(!data?.goals || data.goals.length === 0) ? (
                <div className="empty-state">
                  <p>No active goals currently.</p>
                  <Link to="/goals" className="btn-add" style={{ display: 'inline-block', textDecoration: 'none', marginTop: '0.5rem' }}>
                    + Create Goal
                  </Link>
                </div>
              ) : (
                <div className="goals-grid-dash">
                  {data.goals.map(goal => {
                    const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                    return (
                      <div key={goal._id} className="goal-dash-card">
                        <div className="goal-dash-meta">
                          <div className="goal-title-wrapper">
                            <h4>{goal.title}</h4>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              Due {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          </div>
                          <span className={`goal-priority-badge ${goal.priority}`}>
                            {goal.priority}
                          </span>
                        </div>

                        <div className="goal-dash-progress">
                          <div className="goal-progress-details">
                            <span>Saved: ${goal.currentAmount.toFixed(0)} of ${goal.targetAmount.toFixed(0)}</span>
                            <span>{percentage.toFixed(0)}%</span>
                          </div>
                          <div className="goal-bar-container">
                            <motion.div
                              className="goal-bar-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                        </div>

                        {/* Funding interaction */}
                        {fundingGoalId === goal._id ? (
                          <div className="goal-fund-form-inline">
                            <input
                              type="number"
                              placeholder="Amount ($)"
                              value={fundAmount}
                              onChange={(e) => setFundAmount(e.target.value)}
                              autoFocus
                            />
                            <button
                              className="btn-save-fund"
                              onClick={() => handleFundGoalSubmit(goal._id, goal.currentAmount, goal.targetAmount)}
                            >
                              Add
                            </button>
                            <button
                              className="btn-cancel-fund"
                              onClick={() => {
                                setFundingGoalId(null);
                                setFundAmount('');
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="goal-fund-trigger-btn"
                            onClick={() => setFundingGoalId(goal._id)}
                          >
                            + Fund Goal
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Quick Actions & Recent Activity */}
          <div className="right-panel">
            {/* Quick Actions */}
            <div className="dashboard-section-card">
              <h2>⚡ Quick Actions</h2>
              <div className="quick-actions-panel">
                <button className="action-btn-styled" onClick={() => setShowAddTransactionModal(true)}>
                  <span className="icon">➕</span>
                  Add Transaction
                </button>
                <Link to="/budgets" className="action-btn-styled">
                  <span className="icon">🎯</span>
                  Configure Budgets
                </Link>
                <Link to="/goals" className="action-btn-styled">
                  <span className="icon">🥅</span>
                  Create Financial Goal
                </Link>
                <Link to="/analytics" className="action-btn-styled">
                  <span className="icon">💡</span>
                  View Detailed Insights
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="dashboard-section-card">
              <h2>⏳ Recent Transactions</h2>
              {transactions.length === 0 ? (
                <div className="empty-state">
                  <p>No transactions registered yet.</p>
                </div>
              ) : (
                <div className="recent-activity-list">
                  {transactions.slice(0, 5).map(t => (
                    <div key={t._id} className="recent-activity-item">
                      <div className="activity-left">
                        <div className="activity-cat-icon">
                          {getCategoryIcon(t.category)}
                        </div>
                        <div className="activity-desc">
                          <h4>{t.category}</h4>
                          <p>{t.description || 'No description'}</p>
                        </div>
                      </div>
                      <div className={`activity-amount-text ${t.type}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                  <Link to="/transactions" style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none', marginTop: '0.5rem', display: 'block' }}>
                    View All Transactions ➜
                  </Link>
                </div>
              )}
            </div>

            {/* Smart Advice Widget */}
            <div className="smart-insights-box">
              <span className="insight-icon">💡</span>
              <div className="insight-text">
                <p>
                  Keep an eye on the Cash Flow tab to review if your active balance satisfies your monthly goals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add Transaction Modal Overlay */}
        <AnimatePresence>
          {showAddTransactionModal && (
            <div className="modal-overlay">
              <motion.div
                className="modal-content-glass"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="modal-header-dash">
                  <h2>New Transaction</h2>
                  <button className="modal-close-btn" onClick={() => setShowAddTransactionModal(false)}>✕</button>
                </div>

                <form onSubmit={handleCreateTransaction}>
                  <div className="modal-form-grid">
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        value={newTransaction.type}
                        onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Amount ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Category</label>
                      <input
                        type="text"
                        placeholder="e.g., Groceries"
                        value={newTransaction.category}
                        onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        placeholder="e.g., Weekly shopping"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-form-actions">
                    <button
                      type="button"
                      className="btn-modal-cancel"
                      onClick={() => setShowAddTransactionModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-modal-submit">
                      Save Transaction
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
}