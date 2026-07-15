import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import './Transactions.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: ''
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
    fetchTransactions();
  }, [isAuthenticated, navigate]);

  const fetchTransactions = async () => {
    try {
      const response = await apiClient.get('/transactions');
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await apiClient.post('/transactions', {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: ''
      });
      setShowForm(false);
      fetchTransactions();
    } catch (err) {
      setError('Failed to create transaction');
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await apiClient.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (err) {
        setError('Failed to delete transaction');
      }
    }
  };

  const filtered = filterType === 'all' ? transactions : transactions.filter(t => t.type === filterType);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  if (loading) return <Layout><div className="page-loading">Loading...</div></Layout>;

  return <Layout>
      <div className="transactions-page">
        <div className="page-header">
          <h1>Transactions</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-add">
            {showForm ? 'Cancel' : '+ Add Transaction'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && <form onSubmit={handleSubmit} className="transaction-form card">
            <h2>New Transaction</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Type</label>
                <select value={formData.type} onChange={e => setFormData({
              ...formData,
              type: e.target.value
            })}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({
              ...formData,
              amount: e.target.value
            })} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input type="text" value={formData.category} onChange={e => setFormData({
              ...formData,
              category: e.target.value
            })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" value={formData.description} onChange={e => setFormData({
              ...formData,
              description: e.target.value
            })} />
              </div>
            </div>
            <button type="submit" className="btn-submit">Save Transaction</button>
          </form>}

        <div className="summary-cards">
          <div className="summary-card income">
            <h3>Income</h3>
            <p>${totalIncome.toFixed(2)}</p>
          </div>
          <div className="summary-card expense">
            <h3>Expenses</h3>
            <p>${totalExpenses.toFixed(2)}</p>
          </div>
          <div className="summary-card balance">
            <h3>Balance</h3>
            <p>${(totalIncome - totalExpenses).toFixed(2)}</p>
          </div>
        </div>

        <div className="filters">
          {['all', 'income', 'expense'].map(type => <button key={type} className={`filter-btn ${filterType === type ? 'active' : ''}`} onClick={() => setFilterType(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>)}
        </div>

        <div className="transactions-list">
          {filtered.length === 0 ? <p className="empty-state">No transactions yet</p> : filtered.map(t => <div key={t._id} className="transaction-item">
                <div className="transaction-info">
                  <p className="category">{t.category}</p>
                  <p className="description">{t.description}</p>
                </div>
                <div className="transaction-actions">
                  <div className="transaction-amount">
                    <p className={t.type}>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</p>
                    <p className="date">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleDelete(t._id)} className="btn-delete-item" title="Delete">
                    ✕
                  </button>
                </div>
              </div>)}
        </div>
      </div>
    </Layout>;
}