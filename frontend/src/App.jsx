import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Feedback from './pages/Feedback';
import './App.css';
function ProtectedRoute({
  children
}) {
  const {
    isAuthenticated
  } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
function DashboardRedirect() {
  const { user } = useAuthStore();
  if (user && user.isNewUser) {
    return <Navigate to="/about" replace />;
  }
  return <Dashboard />;
}
function App() {
  return <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute>
              <Transactions />
            </ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute>
              <Budgets />
            </ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute>
              <Goals />
            </ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute>
              <Analytics />
            </ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>;
}
export default App;