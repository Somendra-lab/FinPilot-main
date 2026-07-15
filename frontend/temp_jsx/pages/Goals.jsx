import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import './Goals.css';
export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetAmount: '',
        deadline: '',
        priority: 'medium'
    });
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchGoals();
    }, [isAuthenticated, navigate]);
    const fetchGoals = async () => {
        try {
            const response = await apiClient.get('/goals?status=active');
            setGoals(response.data);
        }
        catch (err) {
            setError('Failed to load goals');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/goals', {
                ...formData,
                targetAmount: parseFloat(formData.targetAmount)
            });
            setFormData({
                title: '',
                description: '',
                targetAmount: '',
                deadline: '',
                priority: 'medium'
            });
            setShowForm(false);
            fetchGoals();
        }
        catch (err) {
            setError('Failed to create goal');
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await apiClient.delete(`/goals/${id}`);
                fetchGoals();
            }
            catch (err) {
                setError('Failed to delete goal');
            }
        }
    };
    const getProgress = (goal) => {
        return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    };
    const getDaysLeft = (deadline) => {
        const end = new Date(deadline).getTime();
        const now = new Date().getTime();
        const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        return days;
    };
    if (loading)
        return <Layout><div className="page-loading">Loading...</div></Layout>;
    return (<Layout>
      <div className="goals-page">
        <div className="page-header">
          <h1>Financial Goals</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-add">
            {showForm ? 'Cancel' : '+ New Goal'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (<form onSubmit={handleSubmit} className="goal-form card">
            <h2>Create New Goal</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Goal Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g., Save for Vacation"/>
              </div>
              <div className="form-group">
                <label>Target Amount</label>
                <input type="number" step="0.01" value={formData.targetAmount} onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })} required placeholder="0.00"/>
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required/>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Add notes about this goal" rows={3}></textarea>
            </div>
            <button type="submit" className="btn-submit">Create Goal</button>
          </form>)}

        <div className="goals-list">
          {goals.length === 0 ? (<p className="empty-state">No active goals. Create one to get started!</p>) : (goals.map(goal => {
            const progress = getProgress(goal);
            const daysLeft = getDaysLeft(goal.deadline);
            return (<div key={goal._id} className={`goal-card priority-${goal.priority}`}>
                  <div className="goal-header">
                    <h3>{goal.title}</h3>
                    <button onClick={() => handleDelete(goal._id)} className="btn-delete" title="Delete">
                      ✕
                    </button>
                  </div>
                  {goal.description && <p className="goal-description">{goal.description}</p>}
                  
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="progress-text">
                      <span>${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="goal-footer">
                    <div className="goal-remaining">
                      <p>${(goal.targetAmount - goal.currentAmount).toFixed(2)} to go</p>
                    </div>
                    <div className={`goal-deadline ${daysLeft < 30 ? 'urgent' : ''}`}>
                      <p>{daysLeft} days left</p>
                    </div>
                  </div>
                </div>);
        }))}
        </div>
      </div>
    </Layout>);
}
