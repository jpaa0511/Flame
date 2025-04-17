'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { User } from '@/types/user';
import { userService } from '@/services/userService';

export default function Feed() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    setCurrentUser(user);
    loadUsers(user.city);
  }, [router]);

  const loadUsers = async (city: string) => {
    try {
      const response = await userService.getUsersByCity(city);
      setUsers(response.users);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (direction: 'like' | 'dislike') => {
    if (!currentUser || currentIndex >= users.length) return;

    const targetUser = users[currentIndex];
    
    try {
      if (direction === 'like') {
        await userService.likeUser(currentUser.id, targetUser.id);
      }
      
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error al procesar el like/dislike:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No hay más usuarios en tu ciudad
            </h2>
            <p className="text-gray-600">
              Vuelve más tarde para ver nuevos perfiles
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentUserCard = users[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {currentUserCard.photos && currentUserCard.photos[0] && (
              <div className="relative h-96">
                <img
                  src={currentUserCard.photos[0]}
                  alt={currentUserCard.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white text-2xl font-bold">
                    {currentUserCard.name}, {currentUserCard.age}
                  </h3>
                  <p className="text-white/90">{currentUserCard.bio}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentUserCard.interests?.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 flex justify-center space-x-8">
              <button
                onClick={() => handleSwipe('dislike')}
                className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              
              <button
                onClick={() => handleSwipe('like')}
                className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 