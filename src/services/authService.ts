import type { User } from '@/types';
import { currentUser as mockUser } from '@/data/mockData';
import { delay } from './api';

/**
 * Auth service — mock implementation.
 * Future: POST /api/auth/login → Spring Boot JWT, store token, attach to requests.
 */

export const authService = {
  async login(email: string, _password: string): Promise<User> {
    await delay();
    return { ...mockUser, email: email || mockUser.email };
  },

  async register(name: string, email: string, _password: string): Promise<User> {
    await delay();
    return { ...mockUser, name, email };
  },

  async forgotPassword(email: string): Promise<{ sent: boolean }> {
    await delay();
    if (!email.includes('@')) throw new Error('Invalid email');
    return { sent: true };
  },
};
