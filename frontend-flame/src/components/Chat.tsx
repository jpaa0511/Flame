import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Match } from '@/types/match';
import HamburgerMenu from '@/components/HamburgerMenu';
import Navbar from '@/components/Navbar';

interface ChatProps {
  match: Match;
  onSendMessage: (message: string) => void;
}

const Chat: React.FC<ChatProps> = ({ match, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [match.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />
      <div className="flex items-center p-4 border-b">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={match.matchedUser.photos[0] || '/default-profile.jpg'}
            alt={match.matchedUser.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold">{match.matchedUser.name}</h2>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {match.messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl p-3 ${
                msg.isFromCurrentUser
                  ? 'bg-[#FE3C72] text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-xs opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 p-2 border rounded-full focus:outline-none focus:border-[#FE3C72]"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-[#FE3C72] text-white flex items-center justify-center hover:bg-[#E62E5C] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>

      <HamburgerMenu />
    </div>
  );
};

export default Chat; 