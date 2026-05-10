import { Box } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import ChangePasswordForm from '../components/ChangePasswordForm';
import ProfileSummary from '../components/ProfileSummary';

function AccountPage() {
  const {
    profile,
    setUser,
    showNotice,
  } = useOutletContext();

  return (
    <Box className="content-grid">
      <ProfileSummary profile={profile} />
      <ChangePasswordForm setUser={setUser} showNotice={showNotice} />
    </Box>
  );
}

export default AccountPage;
