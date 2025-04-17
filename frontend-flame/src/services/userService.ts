import { User } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const userService = {
  async register(userData: Omit<User, 'id'> & { password: string }) {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async updateProfile(userId: string, userData: Partial<User>) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async getProfile(userId: string) {
    const response = await fetch(`${API_URL}/users/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async getUsersByCity(city: string) {
    const response = await fetch(`${API_URL}/users/city/${city}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async likeUser(currentUserId: string, targetUserId: string) {
    const response = await fetch(`${API_URL}/users/${currentUserId}/like/${targetUserId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },
}; 