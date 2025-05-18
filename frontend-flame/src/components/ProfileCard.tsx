'use client';

import { useState } from 'react';
import { User } from '@/types/user';
import { motion, useAnimation, PanInfo } from 'framer-motion';

interface ExternalUser {
  id: string;
  name: string;
  city: string;
  age: number;
  photo: string;
  bio?: string;
}

type CardUser = User | ExternalUser;

interface ProfileCardProps {
  user: CardUser;
  onSwipe: (direction: 'left' | 'right') => void;
}

function getPhoto(user: CardUser) {
  if ('photo' in user && user.photo) return user.photo;
  if ('photos' in user && user.photos && user.photos.length > 0) return user.photos[0];
  return '/default-profile.jpg';
}

function getBio(user: CardUser) {
  if ('bio' in user && user.bio) return user.bio;
  return '';
}

export default function ProfileCard({ user, onSwipe }: ProfileCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();

  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(velocity) >= 500 || Math.abs(offset) >= 150) {
      const direction = offset > 0 ? 'right' : 'left';
      await controls.start({ x: direction === 'right' ? 1000 : -1000, opacity: 0 });
      onSwipe(direction);
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
    setIsDragging(false);
  };

  const photo = getPhoto(user);
  const bio = getBio(user);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="relative w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
      style={{ height: '70vh' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70 z-10" />
      {photo ? (
        <img
          src={photo}
          alt={user.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
        <h2 className="text-3xl font-bold mb-2">{user.name}, {user.age}</h2>
        <p className="text-lg mb-2">{user.city}</p>
        {bio && <p className="text-sm opacity-90">{bio}</p>}
      </div>
      {isDragging && (
        <>
          <div className="absolute top-8 left-8 bg-red-500 rounded-full p-4 transform rotate-12 opacity-80 z-30">
            <span className="text-white font-bold text-2xl">NOPE</span>
          </div>
          <div className="absolute top-8 right-8 bg-green-500 rounded-full p-4 transform -rotate-12 opacity-80 z-30">
            <span className="text-white font-bold text-2xl">LIKE</span>
          </div>
        </>
      )}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-4 p-4 z-30">
        <button
          onClick={() => onSwipe('left')}
          className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          onClick={() => onSwipe('right')}
          className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
} 