"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMatchesByUser } from '@/services/userService';
import Chat from '@/components/Chat';
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

export default function ChatPage() {
  const { matchId } = useParams();
  const [matches, setMatches] = useState<Match[]>([]);
  const [otherUserName, setOtherUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadMatchInfo = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const response = await getMatchesByUser();
        if (response.success) {
          setMatches(response.data);
          const match = response.data.find((m: any) => m.matchId === matchId);
          if (match) {
            setOtherUserName(match.user.name);
          } else {
            router.push('/chat');
          }
        }
      } catch (error) {
        console.error('Error al cargar información del match:', error);
        router.push('/chat');
      } finally {
        setLoading(false);
      }
    };

    loadMatchInfo();
  }, [matchId, router]);

  const handleChatClick = (newMatchId: string) => {
    if (newMatchId !== matchId) {
      router.push(`/chat/${newMatchId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FE3C72]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1 h-full">
        {/* Lista de chats */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tus Chats</h1>
            
            {matches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No tienes chats activos</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div
                    key={match.matchId}
                    onClick={() => handleChatClick(match.matchId)}
                    className={`flex items-center space-x-4 p-4 rounded-2xl cursor-pointer transition-colors ${
                      match.matchId === matchId ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Foto de perfil */}
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={match.user.photos[0] ? `http://localhost:3000/${match.user.photos[0].replace(/\\/g, '/')}` : '/default-avatar.png'}
                        alt={match.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Información del chat */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800 truncate">{match.user.name}</h3>
                          <p className="text-sm text-gray-500">{match.user.age} años</p>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {format(new Date(match.lastMessageAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </span>
                      </div>
                      
                      {/* Último mensaje */}
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {match.lastMessage || 'No hay mensajes aún'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Área de chat */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 overflow-hidden">
            <Chat matchId={matchId as string} otherUserName={otherUserName} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2024 Flame. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 