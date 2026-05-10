import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import ProtectedRoute from './ProtectedRoute';

const AccountPage = lazy(() => import('../pages/AccountPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const EmployeesPage = lazy(() => import('../pages/EmployeesPage'));
const FeedbackPage = lazy(() => import('../pages/FeedbackPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const ReviewsPage = lazy(() => import('../pages/ReviewsPage'));

function DefaultHome({ user }) {
  return <Navigate to={user?.type === 'ADMIN' ? '/employees' : '/feedback'} replace />;
}

function AppRoutes({ user, setUser, showNotice }) {
  return (
    <Suspense fallback={<LoadingScreen />}>
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
          element={
            <ProtectedRoute user={user}>
              <DashboardPage user={user} setUser={setUser} showNotice={showNotice} />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DefaultHome user={user} />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
