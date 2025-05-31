"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getMatchesByUser } from '@/services/userService';
import Chat from '@/components/Chat';
import Navbar from '@/components/Navbar';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const { matchId } = useParams();
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
          const match = response.data.find((m: any) => m.matchId === matchId);
          if (match) {
            setOtherUserName(match.user.name);
          } else {
            router.push('/matches');
          }
        }
      } catch (error) {
        console.error('Error al cargar información del match:', error);
        router.push('/matches');
      } finally {
        setLoading(false);
      }
    };

    loadMatchInfo();
  }, [matchId, router]);

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
        <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)]">
          <Chat matchId={matchId as string} otherUserName={otherUserName} />
        </div>
      </div>
    </>
  );
} 