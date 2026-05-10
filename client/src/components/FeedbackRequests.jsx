import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { performanceApi } from '../api/performanceApi';

const emptyFeedback = {
  title: '',
  detail: '',
  star: 3,
};

const MAX_FEEDBACKS = 5;

function FeedbackRequests({ showNotice }) {
  const [requests, setRequests] = useState([]);
  const [forms, setForms] = useState({});
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const result = await performanceApi.listFeedbackRequests();
      setRequests(result.data || []);
    } catch (error) {
      showNotice(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    performanceApi
      .listFeedbackRequests()
      .then((result) => {
        if (isMounted) {
          setRequests(result.data || []);
        }
      })
      .catch((error) => {
        if (isMounted) {
          showNotice(error.message, 'error');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [showNotice]);

  const updateField = (requestId, field, value) => {
    setForms((current) => ({
      ...current,
      [requestId]: {
        ...emptyFeedback,
        ...(current[requestId] || {}),
        [field]: value,
      },
    }));
  };

  const submitFeedback = async (request) => {
    try {
      if (!request.canSubmitMore) {
        showNotice(`You can submit up to ${request.maxFeedbacks || MAX_FEEDBACKS} feedbacks for this review.`, 'error');
        return;
      }

      const form = forms[request.id] || emptyFeedback;
      if (form.title.trim().length < 2) {
        showNotice('Please enter a feedback title.', 'error');
        return;
      }

      await performanceApi.submitFeedback(request.id, form);
      showNotice('Feedback submitted');
      setForms((current) => ({
        ...current,
        [request.id]: emptyFeedback,
      }));
      await loadRequests();
    } catch (error) {
      showNotice(error.message, 'error');
    }
  };

  return (
    <Paper elevation={0} className="section-panel">
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Feedback Requests
          </Typography>
          <Typography color="text.secondary">
            Submit peer feedback for assigned performance reviews.
          </Typography>
        </Box>
        <Divider />
        <Stack spacing={1.5}>
          {requests.map((request) => {
            const form = forms[request.id] || emptyFeedback;
            const maxFeedbacks = request.maxFeedbacks || MAX_FEEDBACKS;
            const submittedCount = request.submittedCount || 0;
            const canSubmitMore = request.canSubmitMore ?? submittedCount < maxFeedbacks;
            const closed = Boolean(request.closed);

            return (
              <Box className="list-row" key={request.id}>
                <Stack spacing={1} sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography fontWeight={700}>{request.reviewSession.name}</Typography>
                    <Chip
                      label={closed ? 'Closed' : submittedCount ? 'In progress' : 'Pending'}
                      size="small"
                      color={closed ? 'default' : submittedCount ? 'success' : 'warning'}
                    />
                    {request.reviewSession.performanceCycle && (
                      <Chip
                        label={request.reviewSession.performanceCycle.name}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    <Chip label={`${submittedCount}/${maxFeedbacks} feedbacks`} size="small" variant="outlined" />
                  </Stack>
                  <Typography color="text.secondary">
                    Review for {request.reviewee.name} ({request.reviewee.emailId})
                  </Typography>
                  {request.feedbackList?.length > 0 && (
                    <Stack spacing={0.75}>
                      {request.feedbackList.map((feedback, index) => (
                        <Box key={feedback.id} sx={{ borderLeft: '3px solid #d0d7e2', pl: 1.25 }}>
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <Typography variant="body2" fontWeight={700}>
                              {index + 1}. {feedback.title}
                            </Typography>
                            <Chip label={`${feedback.star}/5`} size="small" variant="outlined" />
                          </Stack>
                          {feedback.detail && (
                            <Typography variant="body2" color="text.secondary">
                              {feedback.detail}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  )}
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                    <TextField
                      label="Title"
                      value={form.title}
                      onChange={(event) => updateField(request.id, 'title', event.target.value)}
                      size="small"
                      required
                      disabled={!canSubmitMore}
                      fullWidth
                    />
                    <TextField
                      label="Rating"
                      select
                      value={form.star}
                      onChange={(event) => updateField(request.id, 'star', Number(event.target.value))}
                      size="small"
                      required
                      disabled={!canSubmitMore}
                      sx={{ minWidth: 140 }}
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <MenuItem key={rating} value={rating}>
                          {rating}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                  <TextField
                    label="Feedback"
                    value={form.detail || ''}
                    onChange={(event) => updateField(request.id, 'detail', event.target.value)}
                    multiline
                    minRows={3}
                    disabled={!canSubmitMore}
                    fullWidth
                  />
                </Stack>
                <Button
                  startIcon={<SendIcon />}
                  variant="contained"
                  disabled={!canSubmitMore}
                  onClick={() => submitFeedback(request)}
                >
                  {closed ? 'View only' : canSubmitMore ? 'Submit' : 'Max reached'}
                </Button>
              </Box>
            );
          })}
          {!loading && requests.length === 0 && (
            <Typography color="text.secondary">No feedback requests assigned yet.</Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

export default FeedbackRequests;
