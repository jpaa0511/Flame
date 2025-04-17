'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '@/types/user';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/feed" className="text-xl font-bold text-indigo-600">
              Flame
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {user.photos && user.photos[0] && (
                    <img
                      src={user.photos[0]}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  <span className="ml-2 text-gray-700">{user.name}</span>
                </div>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Mi Perfil
                </Link>
                <Link
                  href="/matches"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Matches
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                  }}
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 