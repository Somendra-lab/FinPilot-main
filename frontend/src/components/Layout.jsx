import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Footer from './Footer';
import './Layout.css';
export default function Layout({
  children
}) {
  const {
    user,
    logout
  } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return <div className="layout">
      <header className="header">
        <div className="header-content container">
          <Link to="/" className="logo">
            <h1>FinPilot AI</h1>
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/transactions" className="nav-link">Transactions</Link>
            <Link to="/budgets" className="nav-link">Budgets</Link>
            <Link to="/goals" className="nav-link">Goals</Link>
            <Link to="/analytics" className="nav-link">Insights</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/feedback" className="nav-link">Feedback</Link>
            {user && <div className="user-menu">
                <span>{user.email}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>}
          </nav>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <Footer />
    </div>;
}