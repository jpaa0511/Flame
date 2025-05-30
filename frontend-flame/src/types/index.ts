export interface FormData {
  name: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  department: string;
  city: string;
  interests: string[];
  photos: string[];
  bio: string;
  preferences: {
    gender: string;
    ageRange: {
      min: number;
      max: number;
    };
    location: {
      department: string;
      city: string;
    };
  };
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
} 