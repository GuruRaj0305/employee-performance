import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Container, Stack } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GroupsIcon from '@mui/icons-material/Groups';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { authApi } from '../api/authApi';
import { performanceApi } from '../api/performanceApi';
import AppHeader from '../components/AppHeader';

function DashboardPage({ user, setUser, showNotice }) {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [performanceCycles, setPerformanceCycles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const isAdmin = user?.type === 'ADMIN';
  const navItems = isAdmin
    ? [
      { label: 'Employees', to: '/employees', icon: <GroupsIcon /> },
      { label: 'Reviews', to: '/reviews', icon: <RateReviewIcon /> },
      { label: 'Account', to: '/account', icon: <AccountCircleIcon /> },
    ]
    : [
      { label: 'Feedback', to: '/feedback', icon: <AssignmentTurnedInIcon /> },
      { label: 'Account', to: '/account', icon: <AccountCircleIcon /> },
    ];

  const loadAdminData = async () => {
    if (!isAdmin) {
      return;
    }

    try {
      const [employeesResult, reviewsResult] = await Promise.all([
        performanceApi.listEmployees(),
        performanceApi.listPerformanceCycles(),
      ]);
      setEmployees(employeesResult.data || []);
      setPerformanceCycles(reviewsResult.data || []);
      setReviews((reviewsResult.data || []).flatMap((cycle) => cycle.reviewSessions || []));
    } catch (error) {
      showNotice(error.message, 'error');
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      return undefined;
    }

    let isMounted = true;

    Promise.all([
      performanceApi.listEmployees(),
      performanceApi.listPerformanceCycles(),
    ])
      .then(([employeesResult, reviewsResult]) => {
        if (isMounted) {
          setEmployees(employeesResult.data || []);
          setPerformanceCycles(reviewsResult.data || []);
          setReviews((reviewsResult.data || []).flatMap((cycle) => cycle.reviewSessions || []));
        }
      })
      .catch((error) => {
        if (isMounted) {
          showNotice(error.message, 'error');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAdmin, showNotice]);

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Clear local session even if the cookie is already gone.
    }

    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <Box className="app-shell">
      <AppHeader navItems={navItems} onLogout={logout} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Outlet
            context={{
              employees,
              isAdmin,
              performanceCycles,
              profile: user,
              reviews,
              loadAdminData,
              setUser,
              showNotice,
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}

export default DashboardPage;
