import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

function ProfileSummary({ profile, onRefresh }) {
  return (
    <Paper elevation={0} className="section-panel">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {profile?.name}
          </Typography>
          <Typography color="text.secondary">{profile?.emailId}</Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Chip label={profile?.type || 'EMPLOYEE'} color="primary" variant="outlined" />
          {(profile?.roleCodes || []).map((roleCode) => (
            <Chip key={roleCode} label={roleCode} variant="outlined" />
          ))}
          <Button startIcon={<RefreshIcon />} onClick={onRefresh}>
            Refresh
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default ProfileSummary;
