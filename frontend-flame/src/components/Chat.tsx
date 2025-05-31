import { useEffect, useState, useRef } from 'react';
import { Message, chatService } from '@/services/chatService';
import { authService } from '@/services/authService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatProps {
  matchId: string;
  otherUserName: string;
}

export default function Chat({ matchId, otherUserName }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await authService.getCurrentUser();
      setCurrentUserId(user?._id || null);
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    chatService.connect();
    chatService.joinChat(matchId, currentUserId);

    const loadChatHistory = async () => {
      try {
        const response = await chatService.getChatHistory(matchId) as { success: boolean; data: { messages: Message[] } };
        if (response.success) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error('Error al cargar historial:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChatHistory();

    const handleNewMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };

    chatService.addListener('message', handleNewMessage);

    return () => {
      chatService.removeListener('message', handleNewMessage);
      chatService.disconnect();
    };
  }, [matchId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId) return;

    chatService.sendMessage(matchId, currentUserId, newMessage.trim());
    setNewMessage('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">

      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Chat con {otherUserName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.sender._id === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender._id === currentUserId
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {format(new Date(message.createdAt), 'HH:mm', { locale: es })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
} 