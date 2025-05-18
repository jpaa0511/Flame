import { User } from '@/types/user';
import axios from 'axios';

type ApiError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
};

interface BackendMatch {
  matchId: string;
  userId: string;
  email: string;
  name: string;
  photos: string[];
  bio: string;
  age: number;
  gender: string;
  lastMessage: string;
  lastMessageAt: string;
}

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true  
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Message {
  _id: string;           
  content: string;        
  createdAt: Date;        
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  receiver: {
    _id: string;
    name: string;
    email: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    token: string;
  }
}

interface GetUsersByCityResponse {
  users: User[];
  success: boolean;
  message?: string;
}

export const userService = {
  async login(credentials: { email: string; password: string }) {
    // console.log('Attempting login for:', credentials.email);
    try {
      const response = await api.post<ApiResponse>('/auth/login', credentials);
      // console.log('Login response:', response.data);

      // Validar que la respuesta tenga la estructura correcta
      if (!response.data?.success || !response.data?.data?.user) {
        // console.error('Invalid response format:', response.data);
        throw new Error('Respuesta del servidor inválida');
      }

      // Guardar datos en localStorage
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('token', response.data.data.token);
      // console.log('User data saved to localStorage:', response.data.data.user.name);
      
      return response.data.data;
    } catch (error: unknown) {
      // console.error('Login error:', error);
      const apiError = error as ApiError;

      // Manejar diferentes tipos de errores
      if (!apiError.response) {
        throw new Error('No se pudo conectar con el servidor');
      }

      if (apiError.response.status === 404) {
        throw new Error('Usuario no registrado');
      } else if (apiError.response.status === 401) {
        throw new Error('Contraseña incorrecta');
      } else {
        const message = apiError.response?.data?.message || 'Error desconocido';
        throw new Error(`Error al iniciar sesión: ${message}`);
      }
    }
  },

  async register(userData: Omit<User, 'id'> & { password: string }) {
    try {
      // console.log('Sending registration data:', userData);
      const response = await api.post<ApiResponse>('/auth/register', {
        ...userData,
        password: userData.password.trim()
      });
      
      // Guardar datos en localStorage después del registro exitoso
      const { user, token } = response.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      return response.data.data;
    } catch (error: unknown) {
      // console.error('Registration error:', error);
      const apiError = error as ApiError;
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      } else if (!apiError.response) {
        throw new Error('No se pudo conectar al servidor. ¿El servidor está corriendo?');
      } else if (apiError.response?.status === 400) {
        throw new Error('Datos de registro inválidos. Por favor verifica la información.');
      } else if (apiError.response?.status === 409) {
        throw new Error('El correo electrónico ya está registrado.');
      } else {
        throw new Error('Error al conectar con el servidor. Por favor intenta más tarde.');
      }
    }
  },

  async updateProfile(userId: string, userData: Partial<User>) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      throw new Error(apiError?.response?.data?.message || 'Error al actualizar perfil');
    }
  },

  async getProfile(userId: string) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      throw new Error(apiError?.response?.data?.message || 'Error al obtener perfil');
    }
  },

  async getUsersByCity(city: string) {
    // console.log('Fetching users from city:', city);
    try {
      const response = await api.get<GetUsersByCityResponse>(`/users/city/${city}`);
      // console.log('Users fetched:', response.data.users.length);
      return response.data;
    } catch (error: unknown) {
      // console.error('Error fetching users:', error);
      const apiError = error as ApiError;
      throw new Error(apiError?.response?.data?.message || 'Error al obtener usuarios por ciudad');
    }
  },

  async likeUser(currentUserId: string, targetUserId: string) {
    try {
      const response = await api.post('/swipes', {
        targetUserId,
        action: 'like'
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (!apiError.response) {
        console.log('Backend no disponible, simulando like exitoso');
        return { success: true, message: 'Like simulado' };
      }
      throw new Error(apiError?.response?.data?.message || 'Error al dar like');
    }
  },

  async dislikeUser(currentUserId: string, targetUserId: string) {
    try {
      const response = await api.post('/swipes', {
        targetUserId,
        action: 'dislike'
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      // Si el backend no está disponible, simulamos una respuesta exitosa
      if (!apiError.response) {
        console.log('Backend no disponible, simulando dislike exitoso');
        return { success: true, message: 'Dislike simulado' };
      }
      throw new Error(apiError?.response?.data?.message || 'Error al dar dislike');
    }
  },

  async getMatchesByUser(userId: string): Promise<BackendMatch[]> {
    const response = await api.get<{ matches: BackendMatch[] }>(`/matches/${userId}`);
    return response.data.matches;
  }
}; 