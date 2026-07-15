import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import './Dashboard.css';
export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/dashboard');
                setData(response.data);
            }
            catch (err) {
                setError('Failed to load dashboard data');
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated, navigate]);
    if (loading)
        return <Layout><div className="page-loading">Loading...</div></Layout>;
    if (error)
        return <Layout><div className="page-error">{error}</div></Layout>;
    return (<Layout>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Income</h3>
            <p className="stat-value">${(data?.totalIncome || 0).toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Total Expenses</h3>
            <p className="stat-value">${(data?.totalExpenses || 0).toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Balance</h3>
            <p className={`stat-value ${(data?.balance || 0) >= 0 ? 'balance' : 'negative'}`}>
              ${(data?.balance || 0).toFixed(2)}
            </p>
          </div>
          <div className="stat-card">
            <h3>Subscriptions</h3>
            <p className="stat-value">${(data?.monthlySubscriptionCost || 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Active Goals</h3>
            <p className="stat-value">{data?.activeGoals || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Budgets Set</h3>
            <p className="stat-value">{data?.budgetCount || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Transactions</h3>
            <p className="stat-value">{data?.transactionCount || 0}</p>
          </div>
        </div>
      </div>
    </Layout>);
}
