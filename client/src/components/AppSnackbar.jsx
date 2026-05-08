import { Alert, Snackbar } from '@mui/material';

function AppSnackbar({ notice, onClose }) {
  return (
    <Snackbar
      open={Boolean(notice)}
      autoHideDuration={3500}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert severity={notice?.severity || 'success'} variant="filled" onClose={onClose}>
        {notice?.message}
      </Alert>
    </Snackbar>
  );
}

export default AppSnackbar;
