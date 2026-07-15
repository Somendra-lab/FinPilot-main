import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
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
    const { isAuthenticated } = useAuthStore();
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
        }
        catch (err) {
            setError('Failed to load transactions');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
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
        }
        catch (err) {
            setError('Failed to create transaction');
        }
    };
    const filtered = filterType === 'all'
        ? transactions
        : transactions.filter(t => t.type === filterType);
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    if (loading)
        return _jsx(Layout, { children: _jsx("div", { className: "page-loading", children: "Loading..." }) });
    return (_jsx(Layout, { children: _jsxs("div", { className: "transactions-page", children: [_jsxs("div", { className: "page-header", children: [_jsx("h1", { children: "Transactions" }), _jsx("button", { onClick: () => setShowForm(!showForm), className: "btn-add", children: showForm ? 'Cancel' : '+ Add Transaction' })] }), error && _jsx("div", { className: "error-message", children: error }), showForm && (_jsxs("form", { onSubmit: handleSubmit, className: "transaction-form card", children: [_jsx("h2", { children: "New Transaction" }), _jsxs("div", { className: "form-grid", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Type" }), _jsxs("select", { value: formData.type, onChange: (e) => setFormData({ ...formData, type: e.target.value }), children: [_jsx("option", { value: "expense", children: "Expense" }), _jsx("option", { value: "income", children: "Income" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Amount" }), _jsx("input", { type: "number", step: "0.01", value: formData.amount, onChange: (e) => setFormData({ ...formData, amount: e.target.value }), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Category" }), _jsx("input", { type: "text", value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Description" }), _jsx("input", { type: "text", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }) })] })] }), _jsx("button", { type: "submit", className: "btn-submit", children: "Save Transaction" })] })), _jsxs("div", { className: "summary-cards", children: [_jsxs("div", { className: "summary-card income", children: [_jsx("h3", { children: "Income" }), _jsxs("p", { children: ["$", totalIncome.toFixed(2)] })] }), _jsxs("div", { className: "summary-card expense", children: [_jsx("h3", { children: "Expenses" }), _jsxs("p", { children: ["$", totalExpenses.toFixed(2)] })] }), _jsxs("div", { className: "summary-card balance", children: [_jsx("h3", { children: "Balance" }), _jsxs("p", { children: ["$", (totalIncome - totalExpenses).toFixed(2)] })] })] }), _jsx("div", { className: "filters", children: ['all', 'income', 'expense'].map(type => (_jsx("button", { className: `filter-btn ${filterType === type ? 'active' : ''}`, onClick: () => setFilterType(type), children: type.charAt(0).toUpperCase() + type.slice(1) }, type))) }), _jsx("div", { className: "transactions-list", children: filtered.length === 0 ? (_jsx("p", { className: "empty-state", children: "No transactions yet" })) : (filtered.map(t => (_jsxs("div", { className: "transaction-item", children: [_jsxs("div", { className: "transaction-info", children: [_jsx("p", { className: "category", children: t.category }), _jsx("p", { className: "description", children: t.description })] }), _jsxs("div", { className: "transaction-amount", children: [_jsxs("p", { className: t.type, children: [t.type === 'income' ? '+' : '-', "$", t.amount.toFixed(2)] }), _jsx("p", { className: "date", children: new Date(t.date).toLocaleDateString() })] })] }, t._id)))) })] }) }));
}
//# sourceMappingURL=Transactions.js.map