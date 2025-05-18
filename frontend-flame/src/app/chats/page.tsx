'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import BackButton from '@/components/BackButton';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import Chat from '@/components/Chat';
import { userService } from '@/services/userService';

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

export default function Chats() {
  const [matches, setMatches] = useState<BackendMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<BackendMatch | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.replace('/login');
      return;
    }
    const user: User = JSON.parse(userData);

    userService.getMatchesByUser(user.id)
      .then(setMatches)
      .catch((err: Error) => {
        console.error('Error fetching matches:', err);
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <BackButton to="/cards" label="Volver a Cards" />
      <div className="container mx-auto px-4 py-8 flex">
        {/* Lista de matches */}
        <div className="w-1/3 border-r pr-4">
          <h2 className="text-xl font-bold mb-4">Tus Matches</h2>
          <ul>
            {matches.map((match) => (
              <li
                key={match.matchId}
                className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-[#FE3C72]/10 ${selectedMatch?.matchId === match.matchId ? 'bg-[#FE3C72]/20' : ''}`}
                onClick={() => setSelectedMatch(match)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={match.photos[0] || '/default-profile.jpg'}
                    alt={match.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{match.name}</div>
                    <div className="text-xs text-gray-500">{match.lastMessage}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Chat */}
        <div className="flex-1 pl-4">
          {selectedMatch ? (
            <Chat
              match={{
                id: selectedMatch.matchId,
                matchedUser: {
                  id: selectedMatch.userId,
                  name: selectedMatch.name,
                  email: selectedMatch.email,
                  age: selectedMatch.age,
                  gender: selectedMatch.gender,
                  photos: selectedMatch.photos,
                  bio: selectedMatch.bio,
                  verified: false,
                  city: '',
                  likes: [],
                  dislikes: []
                },
                messages: [],
                lastMessage: selectedMatch.lastMessage,
                lastMessageAt: new Date(selectedMatch.lastMessageAt),
                isActive: true
              }}
              onSendMessage={() => {}}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Selecciona un match para chatear
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 