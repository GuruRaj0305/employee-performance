import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Stack } from '@mui/material';
import { authApi } from '../api/authApi';
import AppHeader from '../components/AppHeader';
import ChangePasswordForm from '../components/ChangePasswordForm';
import CreateUserForm from '../components/CreateUserForm';
import ProfileSummary from '../components/ProfileSummary';

function DashboardPage({ user, setUser, showNotice }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const isAdmin = profile?.type === 'ADMIN';

  const refreshProfile = async () => {
    try {
      const result = await authApi.profile();
      setProfile(result.data);
      setUser(result.data);
      showNotice('Profile updated');
    } catch (error) {
      showNotice(error.message, 'error');
    }
  };

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
      <AppHeader onLogout={logout} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <ProfileSummary profile={profile} onRefresh={refreshProfile} />

          <Box className="content-grid">
            {isAdmin && <CreateUserForm showNotice={showNotice} />}
            <ChangePasswordForm setUser={setUser} showNotice={showNotice} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default DashboardPage;
