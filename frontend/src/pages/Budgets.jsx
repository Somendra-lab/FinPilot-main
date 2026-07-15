import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import './Budgets.css';
export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  });
  const {
    isAuthenticated
  } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBudgets();
  }, [isAuthenticated, navigate]);
  const fetchBudgets = async () => {
    try {
      const response = await apiClient.get('/budgets');
      setBudgets(response.data);
    } catch (err) {
      setError('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await apiClient.post('/budgets', {
        ...formData,
        limit: parseFloat(formData.limit)
      });
      setFormData({
        category: '',
        limit: ''
      });
      setShowForm(false);
      fetchBudgets();
    } catch (err) {
      setError('Failed to create budget');
    }
  };
  const handleDelete = async id => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiClient.delete(`/budgets/${id}`);
        fetchBudgets();
      } catch (err) {
        setError('Failed to delete budget');
      }
    }
  };
  const getPercentage = budget => {
    return Math.min(budget.spent / budget.limit * 100, 100);
  };
  const getStatusClass = budget => {
    const percentage = getPercentage(budget);
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'ok';
  };
  if (loading) return <Layout><div className="page-loading">Loading...</div></Layout>;
  return <Layout>
      <div className="budgets-page">
        <div className="page-header">
          <h1>Budgets</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-add">
            {showForm ? 'Cancel' : '+ New Budget'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && <form onSubmit={handleSubmit} className="budget-form card">
            <h2>Create Budget</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Category</label>
                <input type="text" value={formData.category} onChange={e => setFormData({
              ...formData,
              category: e.target.value
            })} required placeholder="e.g., Groceries" />
              </div>
              <div className="form-group">
                <label>Monthly Limit</label>
                <input type="number" step="0.01" value={formData.limit} onChange={e => setFormData({
              ...formData,
              limit: e.target.value
            })} required placeholder="0.00" />
              </div>
            </div>
            <button type="submit" className="btn-submit">Create Budget</button>
          </form>}

        <div className="budgets-list">
          {budgets.length === 0 ? <p className="empty-state">No budgets created yet</p> : budgets.map(budget => {
          const percentage = getPercentage(budget);
          const status = getStatusClass(budget);
          return <div key={budget._id} className={`budget-card ${status}`}>
                  <div className="budget-header">
                    <h3>{budget.category}</h3>
                    <button onClick={() => handleDelete(budget._id)} className="btn-delete" title="Delete">
                      ✕
                    </button>
                  </div>
                  <div className="budget-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{
                  width: `${percentage}%`
                }}></div>
                    </div>
                    <div className="progress-text">
                      <span>${budget.spent.toFixed(2)} of ${budget.limit.toFixed(2)}</span>
                      <span>{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="budget-remaining">
                    {budget.spent > budget.limit ? <p className="exceeded">Over budget by ${(budget.spent - budget.limit).toFixed(2)}</p> : <p className="remaining">${(budget.limit - budget.spent).toFixed(2)} remaining</p>}
                  </div>
                </div>;
        })}
        </div>
      </div>
    </Layout>;
}