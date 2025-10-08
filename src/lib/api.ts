const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('moodmate_token');

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  signup: async (email: string, password: string) => {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('moodmate_token', data.token);
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('moodmate_token', data.token);
    return data;
  },

  getMe: async () => {
    return await apiRequest('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('moodmate_token');
  },
};

// Mood Logs API
export const moodLogsAPI = {
  getAll: async () => {
    return await apiRequest('/mood-logs');
  },

  getById: async (id: string) => {
    return await apiRequest(`/mood-logs/${id}`);
  },

  create: async (moodLog: any) => {
    return await apiRequest('/mood-logs', {
      method: 'POST',
      body: JSON.stringify(moodLog),
    });
  },

  update: async (id: string, moodLog: any) => {
    return await apiRequest(`/mood-logs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(moodLog),
    });
  },

  delete: async (id: string) => {
    return await apiRequest(`/mood-logs/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return await apiRequest('/mood-logs/stats');
  },

  getAIInsights: async () => {
    return await apiRequest('/mood-logs/ai-insights');
  },
};

// Journal API
export const journalAPI = {
  getAll: async (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return await apiRequest(`/journal${query}`);
  },

  getById: async (id: string) => {
    return await apiRequest(`/journal/${id}`);
  },

  create: async (entry: any) => {
    return await apiRequest('/journal', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  },

  update: async (id: string, entry: any) => {
    return await apiRequest(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    });
  },

  delete: async (id: string) => {
    return await apiRequest(`/journal/${id}`, {
      method: 'DELETE',
    });
  },
};

// Contact/Feedback API
export const contactAPI = {
  submit: async (data: any) => {
    return await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMySubmissions: async () => {
    return await apiRequest('/contact/my-submissions');
  },

  getAll: async (status?: string, type?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/contact${query}`);
  },
};

// Profile API
export const profileAPI = {
  get: async () => {
    return await apiRequest('/profile');
  },

  update: async (data: any) => {
    return await apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  uploadAvatar: async (avatar: string) => {
    return await apiRequest('/profile/avatar', {
      method: 'POST',
      body: JSON.stringify({ avatar }),
    });
  },

  uploadPhoto: async (photo: string) => {
    return await apiRequest('/profile/photo', {
      method: 'POST',
      body: JSON.stringify({ photo }),
    });
  },

  deleteAvatar: async () => {
    return await apiRequest('/profile/avatar', {
      method: 'DELETE',
    });
  },

  deletePhoto: async () => {
    return await apiRequest('/profile/photo', {
      method: 'DELETE',
    });
  },
};
