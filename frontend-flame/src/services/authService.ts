import { User } from '../types/user';

const API_URL = 'http://localhost:3000/api';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User }> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el inicio de sesión');
    }

    if (!data.user) {
      throw new Error('No se recibieron datos del usuario');
    }

    return data;
  },

  logout(): void {
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}; 