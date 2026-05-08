import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes({ user, setUser, showNotice }) {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage setUser={setUser} showNotice={showNotice} />
          )
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <DashboardPage user={user} setUser={setUser} showNotice={showNotice} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}

export default AppRoutes;
