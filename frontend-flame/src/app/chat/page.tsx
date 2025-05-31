"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMatchesByUser } from '@/services/userService';
import Navbar from '@/components/Navbar';
import { authService } from '@/services/authService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Match {
  matchId: string;
  user: {
    id: string;
    name: string;
    age: number;
    gender: string;
    photos: string[];
    bio: string;
    interests: string[];
  };
  lastMessage: string;
  lastMessageAt: string;
}

export default function ChatsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadMatches = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const response = await getMatchesByUser();
        if (response.success) {
          setMatches(response.data);
        }
      } catch (error) {
        console.error('Error al cargar matches:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [router]);

  const handleChatClick = (matchId: string) => {
    router.push(`/chat/${matchId}`);
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

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tus Chats</h1>
        
        {matches.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No tienes chats activos</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {matches.map((match) => (
              <div
                key={match.matchId}
                onClick={() => handleChatClick(match.matchId)}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  {/* Foto de perfil */}
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={match.user.photos[0] ? `http://localhost:3000/${match.user.photos[0].replace(/\\/g, '/')}` : '/default-avatar.png'}
                      alt={match.user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Información del chat */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{match.user.name}</h3>
                        <p className="text-sm text-gray-500">{match.user.age} años</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(new Date(match.lastMessageAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </span>
                    </div>
                    
                    {/* Último mensaje */}
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {match.lastMessage || 'No hay mensajes aún'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 