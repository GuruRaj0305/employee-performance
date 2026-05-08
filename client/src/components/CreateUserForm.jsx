import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { authApi } from '../api/authApi';
import { emptyUser } from '../constants/forms';

function CreateUserForm({ showNotice }) {
  const [newUser, setNewUser] = useState(emptyUser);
  const [savingUser, setSavingUser] = useState(false);

  const updateNewUser = (event) => {
    setNewUser((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const createUser = async (event) => {
    event.preventDefault();
    setSavingUser(true);

    const payload = {
      ...newUser,
      roleIds: newUser.roleIds
        .split(',')
        .map((roleId) => roleId.trim())
        .filter(Boolean),
    };

    try {
      await authApi.createUser(payload);
      setNewUser(emptyUser);
      showNotice('User created successfully');
    } catch (error) {
      showNotice(error.message, 'error');
    } finally {
      setSavingUser(false);
    }
  };

  return (
    <Paper elevation={0} className="section-panel">
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Create User
          </Typography>
          <Typography color="text.secondary">
            Admin can create a user and assign role ids.
          </Typography>
        </Box>
        <Divider />
        <Stack component="form" spacing={2} onSubmit={createUser}>
          <TextField
            label="Name"
            name="name"
            value={newUser.name}
            onChange={updateNewUser}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={newUser.email}
            onChange={updateNewUser}
            type="email"
            required
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            value={newUser.password}
            onChange={updateNewUser}
            type="password"
            required
            fullWidth
          />
          <TextField
            label="Role ids"
            name="roleIds"
            value={newUser.roleIds}
            onChange={updateNewUser}
            helperText="Use comma separated role ids"
            fullWidth
          />
          <Button type="submit" variant="contained" startIcon={<AddIcon />} disabled={savingUser}>
            {savingUser ? 'Creating' : 'Create user'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default CreateUserForm;
