import { User } from '@/services/userService';

interface UserCardProps {
  user: User;
  onLike: () => void;
  onDislike: () => void;
}

export default function UserCard({ user, onLike, onDislike }: UserCardProps) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        {user.photos && user.photos[0] && (
          <img
            src={user.photos[0]}
            alt={`Foto de ${user.name}`}
            className="w-full h-96 object-cover"
          />
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
            onClick={onDislike}
            className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={onLike}
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