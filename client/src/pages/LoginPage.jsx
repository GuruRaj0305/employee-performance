import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { authApi } from '../api/authApi';
import { emptyLogin } from '../constants/forms';

function LoginPage({ setUser, showNotice }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyLogin);
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await authApi.login(form);
      setUser(result.data.user);
      showNotice(result.message || 'Login successful');
      navigate('/', { replace: true });
    } catch (error) {
      showNotice(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-page">
      <Paper className="login-panel" elevation={0}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Employee Performance
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Sign in to manage your profile and users.
            </Typography>
          </Box>

          <Stack component="form" spacing={2} onSubmit={submitLogin}>
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={updateField}
              type="email"
              required
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              value={form.password}
              onChange={updateField}
              type="password"
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={<LockIcon />}
            >
              {loading ? 'Signing in' : 'Sign in'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

export default LoginPage;
