import { User } from '@/services/userService';
import { useState } from 'react';
import { registerSwipe } from '@/services/userService';

interface UserCardProps {
  user: User;
  onLike: () => void;
  onDislike: () => void;
}

function getPhotoUrl(photoPath: string) {
  if (!photoPath) return '';
  // Normaliza la ruta (cambia \ por /)
  const normalized = photoPath.replace(/\\/g, '/');
  // Si ya es una URL absoluta, la retorna
  if (/^https?:\/\//.test(normalized)) return normalized;
  // Si es relativa, la convierte a absoluta
  return `http://localhost:3000/${normalized}`;
}

export default function UserCard({ user, onLike, onDislike }: UserCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const totalPhotos = user.photos?.length || 0;
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUserName, setMatchedUserName] = useState<string | null>(null);
  const [pendingLike, setPendingLike] = useState(false);

  const handlePrevPhoto = () => {
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const handleNextPhoto = () => {
    setPhotoIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : prev));
  };

  const handleLikeClick = async () => {
    try {
      const res: any = await registerSwipe(user._id as string, 'like');
      console.log('Respuesta de registerSwipe:', res);
      if (res && res.data && res.data.isMatch) {
        console.log('¡MATCH DETECTADO!', res.data);
        setMatchedUserName(res.data.user?.name || user.name);
        setShowMatchModal(true);
        setPendingLike(true);
        setTimeout(() => {
          setShowMatchModal(false);
          setPendingLike(false);
          onLike();
        }, 2500);
        return;
      }
      onLike();
    } catch (e) {
      alert('Error al registrar like');
    }
  };
  const handleDislikeClick = async () => {
    try {
      await registerSwipe(user._id as string, 'dislike');
      onDislike();
    } catch (e) {
      alert('Error al registrar dislike');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Modal de match */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => { setShowMatchModal(false); if (pendingLike) { setPendingLike(false); onLike(); } }}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="mb-4 animate-bounce">
              <svg className="w-16 h-16 text-[#FE3C72]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#FE3C72] mb-2">¡Es un match!</h2>
            <p className="text-gray-700 text-lg">Ahora puedes chatear con <span className="font-semibold">{matchedUserName}</span></p>
          </div>
        </div>
      )}
      <div className="relative">
        {user.photos && user.photos[photoIndex] && (
          <img
            src={getPhotoUrl(user.photos[photoIndex])}
            alt={`Foto de ${user.name}`}
            className="w-full h-96 object-cover"
          />
        )}
        {/* Flechas de navegación de fotos */}
        {totalPhotos > 1 && (
          <>
            <button
              onClick={handlePrevPhoto}
              disabled={photoIndex === 0}
              className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow border border-gray-200 hover:bg-gray-100 transition-colors z-10 ${photoIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
              aria-label="Foto anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FE3C72]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={handleNextPhoto}
              disabled={photoIndex === totalPhotos - 1}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow border border-gray-200 hover:bg-gray-100 transition-colors z-10 ${photoIndex === totalPhotos - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
              aria-label="Foto siguiente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FE3C72]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h2 className="text-white text-2xl font-bold">{user.name}, {user.age}</h2>
          <p className="text-white">{user.city}, {user.department}</p>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 mb-4">{user.bio}</p>
        
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Intereses:</h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
              <span
                key={index}
                className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={handleDislikeClick}
            className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={handleLikeClick}
            className="p-4 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 