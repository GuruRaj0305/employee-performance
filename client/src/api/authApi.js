const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/auth';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const authApi = {
  login: (payload) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  profile: () => request('/profile'),

  refreshToken: () =>
    request('/refresh-token', {
      method: 'POST',
    }),

  logout: () =>
    request('/logout', {
      method: 'POST',
    }),

  changePassword: (payload) =>
    request('/change-password', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  createUser: (payload) =>
    request('/user/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
