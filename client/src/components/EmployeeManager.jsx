import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { performanceApi } from '../api/performanceApi';
import { emptyUser } from '../constants/forms';

const emptyEditForm = {
  id: '',
  name: '',
  email: '',
  password: '',
  active: true,
};

function EmployeeManager({ employees, onReload, showNotice }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState(emptyUser);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const paginatedEmployees = useMemo(() => {
    const start = page * rowsPerPage;
    return employees.slice(start, start + rowsPerPage);
  }, [employees, page, rowsPerPage]);

  const openEditDialog = (employee) => {
    setEditForm({
      id: employee.id,
      name: employee.name,
      email: employee.emailId,
      password: '',
      active: employee.active,
    });
  };

  const closeCreateDialog = () => {
    if (!creating) {
      setCreateDialogOpen(false);
      setNewUser(emptyUser);
    }
  };

  const closeEditDialog = () => {
    if (!saving) {
      setEditForm(emptyEditForm);
    }
  };

  const updateEditField = (field, value) => {
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateNewUserField = (field, value) => {
    setNewUser((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const createEmployee = async () => {
    setCreating(true);

    try {
      await performanceApi.createEmployee(newUser);
      showNotice('Employee created successfully');
      setNewUser(emptyUser);
      setCreateDialogOpen(false);
      onReload();
    } catch (error) {
      showNotice(error.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  const saveEmployee = async () => {
    setSaving(true);

    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        active: editForm.active,
        ...(editForm.password ? { password: editForm.password } : {}),
      };

      await performanceApi.updateEmployee(editForm.id, payload);
      showNotice('Employee updated');
      setEditForm(emptyEditForm);
      onReload();
    } catch (error) {
      showNotice(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeEmployee = async (employee) => {
    try {
      await performanceApi.removeEmployee(employee.id);
      showNotice('Employee deactivated');
      onReload();
    } catch (error) {
      showNotice(error.message, 'error');
    }
  };

  const changePage = (event, nextPage) => {
    setPage(nextPage);
  };

  const changeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <Paper elevation={0} className="section-panel">
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'flex-start' }}
            sx={{ width: '100%' }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700}>
                Employees
              </Typography>
              <Typography color="text.secondary">
                View employees, edit details, reset passwords, and deactivate accounts.
              </Typography>
            </Box>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              sx={{ ml: { sm: 'auto' } }}
              onClick={() => setCreateDialogOpen(true)}
            >
              Add employee
            </Button>
          </Stack>
          <Divider />
          <TableContainer>
            <Table size="small" className="data-table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEmployees.map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>
                      <Typography fontWeight={700}>{employee.name}</Typography>
                    </TableCell>
                    <TableCell>{employee.emailId}</TableCell>
                    <TableCell>
                      <Chip label={employee.type} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.active ? 'Active' : 'Inactive'}
                        size="small"
                        color={employee.active ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit employee">
                        <IconButton color="primary" onClick={() => openEditDialog(employee)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deactivate employee">
                        <span>
                          <IconButton
                            color="error"
                            disabled={!employee.active}
                            onClick={() => removeEmployee(employee)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {employees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography color="text.secondary" align="center">
                        No employees found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={employees.length}
            page={page}
            onPageChange={changePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={changeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Stack>
      </Paper>

      <Dialog open={createDialogOpen} onClose={closeCreateDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700}>
                Add Employee
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create an employee account for review participation.
              </Typography>
            </Box>
            <IconButton aria-label="Close" onClick={closeCreateDialog} sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Name"
              value={newUser.name}
              onChange={(event) => updateNewUserField('name', event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(event) => updateNewUserField('email', event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(event) => updateNewUserField('password', event.target.value)}
              helperText="Use 8+ characters with uppercase, lowercase, number, and symbol."
              required
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateDialog}>Cancel</Button>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            disabled={
              creating ||
              !newUser.name.trim() ||
              !newUser.email.trim() ||
              !newUser.password
            }
            onClick={createEmployee}
          >
            {creating ? 'Creating' : 'Create employee'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(editForm.id)} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700}>
                Edit Employee
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update account details or set a new password.
              </Typography>
            </Box>
            <IconButton aria-label="Close" onClick={closeEditDialog} sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Name"
              value={editForm.name}
              onChange={(event) => updateEditField('name', event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(event) => updateEditField('email', event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="New password"
              type="password"
              value={editForm.password}
              onChange={(event) => updateEditField('password', event.target.value)}
              helperText="Leave blank to keep the current password. New passwords need 8+ characters with uppercase, lowercase, number, and symbol."
              fullWidth
            />
            <FormControlLabel
              control={(
                <Switch
                  checked={editForm.active}
                  onChange={(event) => updateEditField('active', event.target.checked)}
                />
              )}
              label={editForm.active ? 'Active account' : 'Inactive account'}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            disabled={saving || !editForm.name.trim() || !editForm.email.trim()}
            onClick={saveEmployee}
          >
            {saving ? 'Saving' : 'Save changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default EmployeeManager;
