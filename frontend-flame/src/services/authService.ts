import api from '../lib/axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  user?: T;
  token?: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  private setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async register(formData: FormData): Promise<ApiResponse<User>> {
    try {
      console.log('Iniciando registro en authService...');
      
      // Enviar directamente el FormData para manejar las fotos correctamente
      const response = await api.post<ApiResponse<User>>('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Respuesta del servidor:', response.data);

      if (!response.data.success && response.data.message) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error: any) {
      console.error('Error en authService.register:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error en el registro');
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post<ApiResponse<User>>('/auth/login', credentials);
      console.log('Respuesta del login:', response.data);

      if (response.data.success && response.data.user && response.data.token) {
        this.setToken(response.data.token);
        console.log('Token guardado:', response.data.token);
        return response.data.user;
      }
      throw new Error('Error en la autenticación');
    } catch (error: any) {
      console.error('Error en login:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al iniciar sesión');
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
      this.setToken(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await api.get<ApiResponse<User>>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.user || null;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }
}

export const authService = new AuthService(); 