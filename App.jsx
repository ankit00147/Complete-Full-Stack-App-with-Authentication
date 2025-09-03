import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Tiny footer nav to switch quickly */}
      <div style={{ position: 'fixed', bottom: 12, left: 12, opacity: 0.6 }}>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{' '}
        <Link to="/register">Register</Link>
      </div>
    </>
  );
}
