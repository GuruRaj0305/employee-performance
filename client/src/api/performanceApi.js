import { APP_API_BASE_URL, request } from './httpClient';

const apiRequest = (path, options) => request(APP_API_BASE_URL, path, options);

export const performanceApi = {
  listEmployees: () => apiRequest('/employees'),

  createEmployee: (payload) =>
    apiRequest('/employees', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateEmployee: (id, payload) =>
    apiRequest(`/employees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  removeEmployee: (id) =>
    apiRequest(`/employees/${id}`, {
      method: 'DELETE',
    }),

  listPerformanceCycles: () => apiRequest('/reviews/cycles'),

  createPerformanceCycle: (payload) =>
    apiRequest('/reviews/cycles', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updatePerformanceCycle: (id, payload) =>
    apiRequest(`/reviews/cycles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  listReviews: (performanceCycleId) => {
    const query = performanceCycleId ? `?performanceCycleId=${performanceCycleId}` : '';
    return apiRequest(`/reviews${query}`);
  },

  createReview: (payload) =>
    apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateReview: (id, payload) =>
    apiRequest(`/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  assignReview: (id, payload) =>
    apiRequest(`/reviews/${id}/assignments`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  listEmployeeReviewFeedbacks: (userId, reviewSessionId) =>
    apiRequest(`/reviews/${userId}/reviews/${reviewSessionId}`),

  listFeedbackRequests: () => apiRequest('/reviews/feedback-requests'),

  submitFeedback: (assignmentId, payload) =>
    apiRequest(`/reviews/feedback-requests/${assignmentId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
