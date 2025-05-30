import api from '../lib/axios';
import { authService } from './authService';

export interface User {
  _id: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  department: string;
  city: string;
  interests: string[];
  photos: string[];
  bio: string;
  preferences: {
    ageRange: {
      min: number;
      max: number;
    };
    location: {
      department: string;
      city: string;
    };
    gender: string;
  };
  likes: string[];
  dislikes: string[];
  isRegistrationComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getPotentialMatches = async () => {
  try {
    const response = await api.get<ApiResponse<User[]>>('/users/potential-matches');
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios potenciales:', error);
    throw error;
  }
};

export const registerSwipe = async (targetUserId: string, action: 'like' | 'dislike') => {
  try {
    const token = authService.getToken();
    const response = await api.post(
      '/matches/swipes',
      { targetUserId, action },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al registrar swipe:', error);
    throw error;
  }
};
