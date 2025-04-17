export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
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