import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { authApi } from '../api/authApi';
import ChangePasswordForm from '../components/ChangePasswordForm';
import ProfileSummary from '../components/ProfileSummary';

function AccountPage() {
  const {
    profile,
    setUser,
    showNotice,
  } = useOutletContext();

  useEffect(() => {
    let isMounted = true;

    authApi
      .profile()
      .then((result) => {
        if (isMounted) {
          setUser(result.data);
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
  }, [setUser, showNotice]);

  return (
    <Box className="content-grid">
      <ProfileSummary profile={profile} />
      <ChangePasswordForm setUser={setUser} showNotice={showNotice} />
    </Box>
  );
}

export default AccountPage;
