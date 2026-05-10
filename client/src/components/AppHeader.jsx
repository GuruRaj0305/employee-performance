import { NavLink, useLocation } from 'react-router-dom';
import { AppBar, Button, Stack, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

function AppHeader({ navItems, onLogout }) {
  const location = useLocation();

  return (
    <AppBar position="static" color="inherit" elevation={0} className="topbar">
      <Toolbar sx={{ gap: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            Employee Performance
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          className="topnav"
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          {navItems.map((item) => (
            <Button
              key={item.to}
              component={NavLink}
              to={item.to}
              color="inherit"
              className={location.pathname === item.to ? 'nav-link active' : 'nav-link'}
              startIcon={item.icon}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
        <Button startIcon={<LogoutIcon />} color="inherit" onClick={onLogout}>
          Logout
        </Button>
      </Toolbar>
      <Stack
        direction="row"
        spacing={0.5}
        className="mobile-nav"
        sx={{ display: { xs: 'flex', md: 'none' } }}
      >
        {navItems.map((item) => (
          <Button
            key={item.to}
            component={NavLink}
            to={item.to}
            color="inherit"
            className={location.pathname === item.to ? 'nav-link active' : 'nav-link'}
            startIcon={item.icon}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </AppBar>
  );
}

export default AppHeader;
