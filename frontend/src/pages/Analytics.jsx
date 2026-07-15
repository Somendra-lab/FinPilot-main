import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import './Analytics.css';
export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    isAuthenticated
  } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAnalytics();
  }, [isAuthenticated, navigate]);
  const fetchAnalytics = async () => {
    try {
      const response = await apiClient.get('/analytics/insights');
      setAnalytics(response.data);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Layout><div className="page-loading">Loading...</div></Layout>;
  if (error) return <Layout><div className="page-error">{error}</div></Layout>;
  if (!analytics) return <Layout><div className="page-error">No data available</div></Layout>;
  const getChangeClass = change => {
    if (change > 0) return 'negative';
    if (change < 0) return 'positive';
    return 'neutral';
  };
  return <Layout>
      <div className="analytics-page">
        <h1>AI Financial Insights</h1>

        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Savings Rate</h3>
            <p className="metric-value">{analytics.savingsRate.toFixed(1)}%</p>
            <p className="metric-label">of income saved</p>
          </div>
          <div className="metric-card">
            <h3>Monthly Trend</h3>
            <p className={`metric-value ${getChangeClass(analytics.monthlyComparison.change)}`}>
              {analytics.monthlyComparison.change > 0 ? '+' : ''}{analytics.monthlyComparison.change.toFixed(1)}%
            </p>
            <p className="metric-label">vs last month</p>
          </div>
          <div className="metric-card">
            <h3>Avg Transaction</h3>
            <p className="metric-value">${analytics.averageTransaction.toFixed(2)}</p>
            <p className="metric-label">per transaction</p>
          </div>
          <div className="metric-card">
            <h3>Largest Expense</h3>
            <p className="metric-value">${analytics.largestExpense.amount.toFixed(2)}</p>
            <p className="metric-label">{analytics.largestExpense.category}</p>
          </div>
        </div>

        <div className="insights-section">
          <h2>Spending by Category</h2>
          <div className="category-breakdown">
            {analytics.categoryBreakdown.map((category, index) => <div key={index} className="category-item">
                <div className="category-info">
                  <p className="category-name">{category.category}</p>
                  <p className="category-amount">${category.amount.toFixed(2)}</p>
                </div>
                <div className="category-bar">
                  <div className="category-fill" style={{
                width: `${category.percentage}%`
              }}></div>
                </div>
                <p className="category-percent">{category.percentage.toFixed(1)}%</p>
              </div>)}
          </div>
        </div>

        <div className="insights-section">
          <h2>Smart Recommendations</h2>
          <div className="recommendations">
            {analytics.recommendations.map((rec, index) => <div key={index} className="recommendation-card">
                <div className="recommendation-icon">💡</div>
                <p>{rec}</p>
              </div>)}
          </div>
        </div>

        <div className="insights-section">
          <h2>Monthly Spending Trend</h2>
          <div className="spending-trend">
            {analytics.spendingTrend.map((month, index) => {
            const maxAmount = Math.max(...analytics.spendingTrend.map(m => m.amount));
            const height = maxAmount > 0 ? month.amount / maxAmount * 200 : 0;
            return <div key={index} className="trend-bar-container">
                  <div className="trend-bar" style={{
                height: `${height}px`
              }}></div>
                  <p className="trend-label">{month.month}</p>
                  <p className="trend-amount">${month.amount.toFixed(0)}</p>
                </div>;
          })}
          </div>
        </div>
      </div>
    </Layout>;
}