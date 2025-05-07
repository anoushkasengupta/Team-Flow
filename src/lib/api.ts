export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    credentials: 'include', // This ensures cookies are sent with the request
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Redirect to login if unauthorized
    window.location.href = '/auth/login';
    throw new Error('Unauthorized');
  }

  return response;
} 