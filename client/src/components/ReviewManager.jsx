import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { performanceApi } from '../api/performanceApi';

const emptyReview = {
  performanceCycleId: '',
  targetUserId: '',
  name: '',
  description: '',
};

const emptyCycle = {
  name: '',
  description: '',
};

function ReviewManager({ employees, performanceCycles, reviews, onReload, showNotice }) {
  const [selectedCycleId, setSelectedCycleId] = useState('');
  const [cycleDialogOpen, setCycleDialogOpen] = useState(false);
  const [cycleForm, setCycleForm] = useState(emptyCycle);
  const [creatingCycle, setCreatingCycle] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState(emptyReview);
  const [creatingReview, setCreatingReview] = useState(false);
  const [assignments, setAssignments] = useState({});
  const [feedbackDialog, setFeedbackDialog] = useState({
    open: false,
    review: null,
    feedbacks: [],
    loading: false,
  });

  const employeeOptions = employees.filter((employee) => employee.active);
  const effectiveSelectedCycleId = performanceCycles.some((cycle) => cycle.id === selectedCycleId)
    ? selectedCycleId
    : performanceCycles[0]?.id || '';
  const selectedCycle = performanceCycles.find((cycle) => cycle.id === effectiveSelectedCycleId) || null;
  const visibleReviews = reviews.filter((review) => review.performanceCycleId === effectiveSelectedCycleId);
  const canManageSelectedCycle = Boolean(selectedCycle?.active);

  const updateCycleForm = (event) => {
    setCycleForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const updateReviewForm = (event) => {
    const value = event.target.value;

    setReviewForm((current) => ({
      ...current,
      [event.target.name]: value,
    }));
  };

  const closeCycleDialog = () => {
    if (!creatingCycle) {
      setCycleDialogOpen(false);
      setCycleForm(emptyCycle);
    }
  };

  const createCycle = async () => {
    setCreatingCycle(true);

    try {
      const result = await performanceApi.createPerformanceCycle(cycleForm);
      setSelectedCycleId(result.data?.id || '');
      setCycleForm(emptyCycle);
      setCycleDialogOpen(false);
      showNotice('Performance cycle created');
      onReload();
    } catch (error) {
      showNotice(error.message, 'error');
    } finally {
      setCreatingCycle(false);
    }
  };

  const closeCycle = async () => {
    if (!selectedCycle?.active) {
      return;
    }

    try {
      await performanceApi.updatePerformanceCycle(selectedCycle.id, { active: false });
      showNotice('Performance cycle closed');
      onReload();
    } catch (error) {
      showNotice(error.message, 'error');
    }
  };

  const closeCreateDialog = () => {
    if (!creatingReview) {
      setCreateDialogOpen(false);
      setReviewForm(emptyReview);
    }
  };

  const createReview = async () => {
    setCreatingReview(true);

    try {
      await performanceApi.createReview({
        ...reviewForm,
        performanceCycleId: effectiveSelectedCycleId,
      });
      setReviewForm(emptyReview);
      setCreateDialogOpen(false);
      showNotice('Review created');
      onReload();
    } catch (error) {
      showNotice(error.message, 'error');
    } finally {
      setCreatingReview(false);
    }
  };

  const setAssignmentField = (reviewId, field, value) => {
    setAssignments((current) => ({
      ...current,
      [reviewId]: {
        ...(current[reviewId] || {}),
        [field]: value,
      },
    }));
  };

  const normalizeSelectedIds = (value) => {
    return typeof value === 'string' ? value.split(',') : value;
  };

  const assignEmployee = async (review) => {
    try {
      const draft = assignments[review.id] || {};
      const reviewerIds = draft.reviewerIds || [];
      const revieweeId = draft.revieweeId || review.targetUserId;

      if (!reviewerIds.length) {
        showNotice('Please select at least one reviewer before assigning.', 'error');
        return;
      }

      if (reviewerIds.includes(revieweeId)) {
        showNotice('Reviewer and reviewee must be different employees.', 'error');
        return;
      }

      await performanceApi.assignReview(review.id, {
        reviewerIds,
        revieweeId: draft.revieweeId || null,
      });
      showNotice('Assignments saved');
      setAssignments((current) => ({ ...current, [review.id]: {} }));
      onReload();
    } catch (error) {
      showNotice(error.message, 'error');
    }
  };

  const toggleReview = async (review) => {
    try {
      await performanceApi.updateReview(review.id, { active: !review.active });
      showNotice('Review updated');
      onReload();
    } catch (error) {
      showNotice(error.message, 'error');
    }
  };

  const viewFeedbacks = async (review) => {
    setFeedbackDialog({
      open: true,
      review,
      feedbacks: [],
      loading: false,
    });
  };

  const closeFeedbackDialog = () => {
    setFeedbackDialog({
      open: false,
      review: null,
      feedbacks: [],
      loading: false,
    });
  };

  const getFeedbacksForAssignment = (assignment) => {
    return [...(assignment.othersReviews || [])].sort((first, second) => {
      return new Date(second.createdAt) - new Date(first.createdAt);
    });
  };

  const getAverageRating = (feedbacks) => {
    if (!feedbacks.length) {
      return null;
    }

    const totalRating = feedbacks.reduce((sum, feedback) => sum + Number(feedback.star || 0), 0);
    return (totalRating / feedbacks.length).toFixed(1);
  };

  const hasSubmittedFeedback = (review) => {
    return Boolean(review?.reviewOpenUsers?.some((assignment) => assignment.othersReviews?.length));
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
                Performance Cycles
              </Typography>
              <Typography color="text.secondary">
                Create sessions inside a cycle so feedback remains isolated.
              </Typography>
            </Box>
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              sx={{ ml: { sm: 'auto' } }}
              onClick={() => setCycleDialogOpen(true)}
            >
              Add cycle
            </Button>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              disabled={!effectiveSelectedCycleId || !canManageSelectedCycle}
              onClick={() => setCreateDialogOpen(true)}
            >
              Add review
            </Button>
            {selectedCycle && (
              <Button disabled={!selectedCycle.active} onClick={closeCycle}>
                Close cycle
              </Button>
            )}
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <FormControl fullWidth size="small">
              <InputLabel id="cycle-select-label">Performance cycle</InputLabel>
              <Select
                labelId="cycle-select-label"
                label="Performance cycle"
                value={effectiveSelectedCycleId}
                onChange={(event) => setSelectedCycleId(event.target.value)}
              >
                {performanceCycles.map((cycle) => (
                  <MenuItem key={cycle.id} value={cycle.id}>
                    {cycle.name}
                  </MenuItem>
                ))}
                {performanceCycles.length === 0 && (
                  <MenuItem disabled value="">
                    No cycles created
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            {selectedCycle && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={selectedCycle.active ? 'Open' : 'Closed'}
                  color={selectedCycle.active ? 'success' : 'default'}
                  size="small"
                />
                <Chip
                  label={`${visibleReviews.length} review${visibleReviews.length === 1 ? '' : 's'}`}
                  variant="outlined"
                  size="small"
                />
              </Stack>
            )}
          </Stack>
          {selectedCycle?.description && (
            <Typography color="text.secondary">{selectedCycle.description}</Typography>
          )}
          <Divider />
          <Stack spacing={1.5}>
            {visibleReviews.map((review) => {
              const reviewAssignments = review.reviewOpenUsers || [];
              const draft = assignments[review.id] || {};
              const targetLabel = review.targetUser?.name;
              const reviewerIds = draft.reviewerIds || [];
              const assignedReviewerIds = reviewAssignments.map((assignment) => assignment.userId);
              const reviewerOptions = employeeOptions.filter((employee) => (
                employee.id !== review.targetUserId && !assignedReviewerIds.includes(employee.id)
              ));
              const canAssign = (
                canManageSelectedCycle &&
                review.active &&
                reviewerIds.length > 0 &&
                reviewerIds.every((id) => id !== review.targetUserId)
              );
              const submittedCount = reviewAssignments.filter((item) => item.othersReviews?.length).length;

              return (
                <Box className="list-row" key={review.id}>
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography fontWeight={700}>{review.name}</Typography>
                      <Chip label={review.active ? 'Open' : 'Closed'} size="small" color={review.active ? 'success' : 'default'} />
                      <Chip label="Employee" size="small" variant="outlined" />
                      {targetLabel && <Chip label={targetLabel} size="small" variant="outlined" />}
                    </Stack>
                    <Typography color="text.secondary">{review.description || 'No description'}</Typography>
                    {canManageSelectedCycle && review.active && (
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                        <FormControl fullWidth size="small" error={reviewerIds.length > 0 && !canAssign}>
                          <InputLabel id={`reviewer-${review.id}`}>Reviewer</InputLabel>
                          <Select
                            labelId={`reviewer-${review.id}`}
                            label="Reviewer"
                            multiple
                            value={reviewerIds}
                            onChange={(event) => {
                              setAssignmentField(
                                review.id,
                                'reviewerIds',
                                normalizeSelectedIds(event.target.value)
                              );
                            }}
                            renderValue={(selected) => selected
                              .map((id) => employeeOptions.find((employee) => employee.id === id)?.name)
                              .filter(Boolean)
                              .join(', ')}
                          >
                            {reviewerOptions.map((employee) => (
                              <MenuItem key={employee.id} value={employee.id}>
                                <Checkbox checked={reviewerIds.includes(employee.id)} />
                                <ListItemText primary={employee.name} />
                              </MenuItem>
                            ))}
                            {reviewerOptions.length === 0 && (
                              <MenuItem disabled value="">
                                No available reviewers
                              </MenuItem>
                            )}
                          </Select>
                          <FormHelperText>
                            {reviewerOptions.length === 0
                              ? 'All available reviewers are already assigned.'
                              : 'Already assigned users are hidden.'}
                          </FormHelperText>
                        </FormControl>
                      </Stack>
                    )}
                    <Typography color="text.secondary" variant="body2">
                      {reviewAssignments.length} assignment(s),{' '}
                      {submittedCount} submitted
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button startIcon={<VisibilityIcon />} onClick={() => viewFeedbacks(review)}>
                      View
                    </Button>
                    {canManageSelectedCycle && review.active && (
                      <Button
                        startIcon={<AssignmentIcon />}
                        variant="contained"
                        disabled={!canAssign}
                        onClick={() => assignEmployee(review)}
                      >
                        Assign
                      </Button>
                    )}
                    {canManageSelectedCycle && (
                      <Button onClick={() => toggleReview(review)}>
                        {review.active ? 'Close' : 'Reopen'}
                      </Button>
                    )}
                  </Stack>
                </Box>
              );
            })}
            {visibleReviews.length === 0 && (
              <Typography color="text.secondary">
                {effectiveSelectedCycleId ? 'No review sessions created in this cycle yet.' : 'Create a performance cycle to start adding review sessions.'}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Paper>

      <Dialog open={cycleDialogOpen} onClose={closeCycleDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700}>
                Add Performance Cycle
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Example: 2025 Performance or Midyear Review.
              </Typography>
            </Box>
            <IconButton aria-label="Close" onClick={closeCycleDialog} sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Cycle name"
              name="name"
              value={cycleForm.name}
              onChange={updateCycleForm}
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={cycleForm.description}
              onChange={updateCycleForm}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCycleDialog}>Cancel</Button>
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            disabled={creatingCycle || !cycleForm.name.trim()}
            onClick={createCycle}
          >
            {creatingCycle ? 'Creating' : 'Create cycle'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createDialogOpen} onClose={closeCreateDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700}>
                Add Review
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add a review session inside {selectedCycle?.name || 'the selected cycle'}.
              </Typography>
            </Box>
            <IconButton aria-label="Close" onClick={closeCreateDialog} sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel id="review-target-user-label">Employee</InputLabel>
              <Select
                labelId="review-target-user-label"
                label="Employee"
                name="targetUserId"
                value={reviewForm.targetUserId}
                onChange={updateReviewForm}
              >
                {employeeOptions.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Review name"
              name="name"
              value={reviewForm.name}
              onChange={updateReviewForm}
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={reviewForm.description}
              onChange={updateReviewForm}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateDialog}>Cancel</Button>
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            disabled={
              creatingReview ||
              !effectiveSelectedCycleId ||
              !reviewForm.targetUserId ||
              !reviewForm.name.trim()
            }
            onClick={createReview}
          >
            {creatingReview ? 'Creating' : 'Create review'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={feedbackDialog.open} onClose={closeFeedbackDialog} fullWidth maxWidth="md">
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700}>
                Feedbacks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feedbackDialog.review?.name}
              </Typography>
            </Box>
            <IconButton aria-label="Close" onClick={closeFeedbackDialog} sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            <Typography fontWeight={700}>Assigned users and feedbacks</Typography>
            {feedbackDialog.loading && (
              <Typography color="text.secondary">Loading feedbacks...</Typography>
            )}
            {feedbackDialog.review?.reviewOpenUsers?.map((assignment) => {
              const assignmentFeedbacks = getFeedbacksForAssignment(assignment);
              const feedbackCount = assignmentFeedbacks.length;
              const averageRating = getAverageRating(assignmentFeedbacks);

              return (
                <Box key={assignment.id} className="list-row" sx={{ alignItems: 'stretch' }}>
                  <Stack spacing={1.25} sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography fontWeight={700}>
                        {assignment.user?.name || 'Reviewer'}
                      </Typography>
                      <Chip
                        label={feedbackCount ? 'Submitted' : 'Pending'}
                        size="small"
                        color={feedbackCount ? 'success' : 'warning'}
                        variant={feedbackCount ? 'filled' : 'outlined'}
                      />
                      <Chip
                        label={averageRating ? `Avg ${averageRating}/5` : 'No rating'}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                    <Typography color="text.secondary" variant="body2">
                      Reviewing {assignment.userRef?.name || 'Employee'}
                    </Typography>
                    {assignmentFeedbacks.map((feedback, index) => (
                      <Box key={feedback.id} sx={{ borderLeft: '3px solid #d0d7e2', pl: 1.25 }}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Typography variant="body2" fontWeight={700}>
                            {index + 1}. {feedback.title}
                          </Typography>
                          <Chip label={`${feedback.star}/5`} size="small" color="primary" variant="outlined" />
                        </Stack>
                        <Typography color="text.secondary" variant="body2">
                          {feedback.detail || 'No details provided.'}
                        </Typography>
                        <Typography color="text.secondary" variant="caption">
                          Submitted {new Date(feedback.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                    {!feedbackDialog.loading && assignmentFeedbacks.length === 0 && (
                      <Typography color="text.secondary" variant="body2">
                        No feedback submitted by this reviewer yet.
                      </Typography>
                    )}
                  </Stack>
                </Box>
              );
            })}
            {!feedbackDialog.review?.reviewOpenUsers?.length && (
              <Typography color="text.secondary">No users assigned yet.</Typography>
            )}
            {!feedbackDialog.loading && !hasSubmittedFeedback(feedbackDialog.review) && (
              <Typography color="text.secondary">No feedback submitted for this review yet.</Typography>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

export default ReviewManager;
