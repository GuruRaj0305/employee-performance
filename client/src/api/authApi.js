import { AUTH_API_BASE_URL, request } from './httpClient';

export const authApi = {
  login: (payload) =>
    request(AUTH_API_BASE_URL, '/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuthRefresh: true,
    }),

  profile: () => request(AUTH_API_BASE_URL, '/profile'),

  refreshToken: () =>
    request(AUTH_API_BASE_URL, '/refresh-token', {
      method: 'POST',
      skipAuthRefresh: true,
    }),

  logout: () =>
    request(AUTH_API_BASE_URL, '/logout', {
      method: 'POST',
    }),

  changePassword: (payload) =>
    request(AUTH_API_BASE_URL, '/change-password', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};
