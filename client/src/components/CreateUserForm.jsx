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
import { performanceApi } from '../api/performanceApi';
import { emptyUser } from '../constants/forms';

function CreateUserForm({ showNotice, onCreated }) {
  const [newUser, setNewUser] = useState(emptyUser);
  const [savingUser, setSavingUser] = useState(false);

  const updateNewUser = (event) => {
    const value = event.target.value;

    setNewUser((current) => ({
      ...current,
      [event.target.name]: value,
    }));
  };

  const createUser = async (event) => {
    event.preventDefault();
    setSavingUser(true);

    try {
      await performanceApi.createEmployee(newUser);
      setNewUser(emptyUser);
      showNotice('User created successfully');
      onCreated?.();
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
              Create Employee
            </Typography>
            <Typography color="text.secondary">
              Add an employee account for review participation.
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
          <Button type="submit" variant="contained" startIcon={<AddIcon />} disabled={savingUser}>
            {savingUser ? 'Creating' : 'Create employee'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default CreateUserForm;
