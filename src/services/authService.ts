
import type { User } from '@/types';

const API_URL = 'http://127.0.0.1:8000/api/auth';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('authToken', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));

    return data.user as User;
  },

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.email?.[0] ||
        data.password?.[0] ||
        data.error ||
        'Registration failed'
      );
    }

    return data;
  },

  async forgotPassword(email: string) {
    throw new Error('Password reset is not configured yet.');
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('authToken');

    if (token) {
      await fetch(`${API_URL}/logout/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },
};
