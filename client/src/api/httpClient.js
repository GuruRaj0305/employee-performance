

const API_BASE_URL = '/api';
const AUTH_API_BASE_URL = `${API_BASE_URL}/auth`;
const APP_API_BASE_URL = API_BASE_URL;

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

let refreshRequest = null;

const readResponseData = async (response) => {
  return response.json().catch(() => ({}));
};

const sendRequest = async (baseUrl, path, options = {}) => {
  const { headers, ...fetchOptions } = options;

  const response = await fetch(`${baseUrl}${path}`, {
    ...fetchOptions,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
  });

  const data = await readResponseData(response);

  if (!response.ok) {
    throw new ApiError(data.message || 'Request failed', response.status, data);
  }

  return data;
};

const refreshToken = async () => {
  if (!refreshRequest) {
    refreshRequest = sendRequest(AUTH_API_BASE_URL, '/refresh-token', {
      method: 'POST',
    }).finally(() => {
      refreshRequest = null;
    });
  }

  return refreshRequest;
};

const request = async (baseUrl, path, options = {}) => {
  const { skipAuthRefresh, ...fetchOptions } = options;

  try {
    return await sendRequest(baseUrl, path, fetchOptions);
  } catch (error) {
    if (skipAuthRefresh || error.status !== 401) {
      throw error;
    }

    await refreshToken();
    return sendRequest(baseUrl, path, fetchOptions);
  }
};

export { APP_API_BASE_URL, AUTH_API_BASE_URL, request };
