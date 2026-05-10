import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { authApi } from '../api/authApi';
import { emptyPassword } from '../constants/forms';

function ChangePasswordForm({ setUser, showNotice }) {
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState(emptyPassword);
  const [savingPassword, setSavingPassword] = useState(false);

  const updatePassword = (event) => {
    setPasswordForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setSavingPassword(true);

    try {
      const result = await authApi.changePassword(passwordForm);
      setPasswordForm(emptyPassword);
      setUser(null);
      showNotice(result.message || 'Password changed. Please login again.');
      navigate('/login', { replace: true });
    } catch (error) {
      showNotice(error.message, 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <Paper elevation={0} className="section-panel">
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Change Password
          </Typography>
          <Typography color="text.secondary">
            After changing password you will be asked to login again.
          </Typography>
        </Box>
        <Divider />
        <Stack component="form" spacing={2} onSubmit={changePassword}>
          <TextField
            label="Old password"
            name="oldPassword"
            value={passwordForm.oldPassword}
            onChange={updatePassword}
            type="password"
            required
            fullWidth
          />
          <TextField
            label="New password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={updatePassword}
            type="password"
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<LockIcon />}
            disabled={savingPassword}
          >
            {savingPassword ? 'Updating' : 'Change password'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default ChangePasswordForm;
