'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';
import { User } from '@/types/user';
import BackButton from '@/components/BackButton';
import HamburgerMenu from '@/components/HamburgerMenu';
import { userService } from '@/services/userService';

interface ExternalUser {
  id: string;
  name: string;
  city: string;
  age: number;
  photo: string;
}

type RandomUser = {
  login: { uuid: string };
  name: { first: string; last: string };
  location: { city: string };
  dob: { age: number };
  picture: { large: string };
  // ...otros campos si los necesitas
};

export default function Cards() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<ExternalUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeCards = async () => {
      console.log('Initializing Cards page...');
      try {
        const userData = localStorage.getItem('user');
        console.log('User data from localStorage:', userData);

        if (!userData || userData === 'undefined') {
          setIsLoading(false);
          return;
        }

        let user: User;
        try {
          user = JSON.parse(userData);
          console.log('Parsed user data:', user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          setIsLoading(false);
          return;
        }

        setCurrentUser(user);
        console.log('Current user set:', user.name);

        // Traer usuarios de una API externa
        try {
          const res = await fetch('https://randomuser.me/api/?results=20&nat=us,es,fr,br');
          const data = await res.json();
          const externalUsers: ExternalUser[] = data.results.map((u: RandomUser, idx: number) => ({
            id: u.login.uuid || idx.toString(),
            name: `${u.name.first} ${u.name.last}`,
            city: u.location.city,
            age: u.dob.age,
            photo: u.picture.large
          }));
          setUsers(externalUsers);
          console.log('External users loaded:', externalUsers.length);
        } catch (error) {
          console.error('Error loading external users:', error);
        }
      } catch (error) {
        console.error('Error in cards initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCards();
  }, [router]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!currentUser || currentIndex >= users.length) return;

    const targetUser = users[currentIndex];
    console.log(`Swiping ${direction} on user:`, targetUser.name);
    
    try {
      if (direction === 'right') {
        await userService.likeUser(currentUser.id, targetUser.id);
      } else {
        await userService.dislikeUser(currentUser.id, targetUser.id);
      }
      
      setCurrentIndex(prev => prev + 1);
      
      // Si nos quedamos sin usuarios, cargar más
      if (currentIndex + 1 >= users.length) {
        try {
          const res = await fetch('https://randomuser.me/api/?results=20&nat=us,es,fr,br');
          const data = await res.json();
          const newUsers: ExternalUser[] = data.results.map((u: RandomUser, idx: number) => ({
            id: u.login.uuid || idx.toString(),
            name: `${u.name.first} ${u.name.last}`,
            city: u.location.city,
            age: u.dob.age,
            photo: u.picture.large
          }));
          setUsers(prev => [...prev, ...newUsers]);
        } catch (error) {
          console.error('Error loading more users:', error);
        }
      }
    } catch (error) {
      console.error('Error processing swipe:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FE3C72]"></div>
        </div>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">¡No hay perfiles disponibles!</h2>
          <p className="text-gray-600 text-center">
            No encontramos perfiles en tu área en este momento.
            Vuelve más tarde para ver nuevos perfiles.
          </p>
        </div>
      </div>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">¡No hay más perfiles!</h2>
          <p className="text-gray-600 text-center">
            Has visto todos los perfiles disponibles en tu área.
            Vuelve más tarde para ver nuevos perfiles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <HamburgerMenu />
      <BackButton to="/login" label="Volver al login" />
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md">
          {users[currentIndex] && (
            <ProfileCard
              user={users[currentIndex]}
              onSwipe={handleSwipe}
            />
          )}
        </div>
      </div>
    </div>
  );
} 