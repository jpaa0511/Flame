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
} 