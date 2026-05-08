import { AppBar, Button, Stack, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

function AppHeader({ onLogout }) {
  return (
    <AppBar position="static" color="inherit" elevation={0} className="topbar">
      <Toolbar>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
          <PersonIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Employee Performance
          </Typography>
        </Stack>
        <Button startIcon={<LogoutIcon />} color="inherit" onClick={onLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
