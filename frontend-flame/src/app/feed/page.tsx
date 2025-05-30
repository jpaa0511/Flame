'use client';

import { useEffect, useState } from 'react';
import { User, getPotentialMatches } from '@/services/userService';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import Navbar from '@/components/Navbar';
import UserCard from '@/components/UserCard';

export default function FeedPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!authService.isAuthenticated()) {
          console.log('Usuario no autenticado, redirigiendo a login...');
          router.push('/login');
          return;
        }

        const response = await getPotentialMatches();
        if (response.success) {
          console.log('Usuarios obtenidos:', response.data);
          setUsers(response.data);
        } else {
          throw new Error(response.message || 'Error al obtener usuarios');
        }
      } catch (error: any) {
        console.error('Error al obtener usuarios:', error);
        setError(error.message || 'Error al cargar los usuarios');
        if (!authService.isAuthenticated()) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const handleLike = () => {
    // TODO: Implementar lógica de like
    setCurrentIndex(prev => prev + 1);
  };

  const handleDislike = () => {
    // TODO: Implementar lógica de dislike
    setCurrentIndex(prev => prev + 1);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
          >
            Volver a iniciar sesión
          </button>
        </div>
      </>
    );
  }

  if (users.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">No hay más perfiles para mostrar</h1>
          <p className="text-gray-600">Vuelve más tarde para ver nuevos perfiles</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8 pt-24">
        <div className="container mx-auto px-4">
          {currentIndex < users.length && (
            <UserCard
              user={users[currentIndex]}
              onLike={handleLike}
              onDislike={handleDislike}
            />
          )}
        </div>
      </div>
    </>
  );
} 