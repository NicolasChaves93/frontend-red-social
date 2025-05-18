import type { User } from "../../../shared/types";
import Button from "../../../shared/components/Button";

interface UserProfileCardProps {
  user: User;
  isOwnProfile: boolean;
  onEditClick: () => void;
}

export default function UserProfileCard({ user, isOwnProfile, onEditClick }: UserProfileCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header/Banner */}
      <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
      
      {/* Profile info */}
      <div className="px-6 py-4 relative">
        {/* Avatar */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-4xl font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        
        {/* User info */}
        <div className="mt-16 text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {user.fullName || user.username}
          </h1>
          <p className="text-gray-500">@{user.username}</p>
          
          {user.bio && (
            <div className="mt-4 text-gray-700">
              <p>{user.bio}</p>
            </div>
          )}
          
          {isOwnProfile && (
            <div className="mt-6">
              <Button onClick={onEditClick}>
                Editar perfil
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
