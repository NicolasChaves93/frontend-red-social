import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { useToast } from "../../../shared/hooks/useToast";
import Spinner from "../../../shared/components/Spinner";
import UserProfileCard from "../components/UserProfileCard";
import EditProfileForm from "../components/EditProfileForm";
import PostCard from "../../posts/components/PostCard";
import type { User } from "../../../shared/types";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const { getUserProfile, updateUserProfile, loading } = useProfile();
  const { showToast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let profileData;
        
        if (id) {
          // Ver perfil de otro usuario
          profileData = await getUserProfile(id);
          setIsOwnProfile(currentUser?.id === id);
        } else {
          // Ver perfil propio
          profileData = await getUserProfile();
          setIsOwnProfile(true);
        }
        
        setUser(profileData);
      } catch (error: any) {
        showToast(error.message || "Error al cargar el perfil", "error");
      }
    };

    fetchProfile();
  }, [id, currentUser, getUserProfile, showToast]);

  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    if (!isOwnProfile) return;
    
    try {
      const updatedProfile = await updateUserProfile(updatedData);
      setUser(updatedProfile);
      setIsEditing(false);
      showToast("Perfil actualizado exitosamente", "success");
    } catch (error: any) {
      showToast(error.message || "Error al actualizar el perfil", "error");
    }
  };

  if (loading && !user) {
    return <Spinner />;
  }

  if (!user) {
    return (
      <div className="w-full max-w-md mx-auto text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Perfil no encontrado</h1>
        <p className="text-gray-600">El usuario que buscas no existe o no está disponible.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {!isEditing ? (
        <UserProfileCard 
          user={user} 
          isOwnProfile={isOwnProfile}
          onEditClick={() => setIsEditing(true)} 
        />
      ) : (
        <EditProfileForm
          user={user}
          onSubmit={handleUpdateProfile}
          onCancel={() => setIsEditing(false)}
          isLoading={loading}
        />
      )}
      
      {/* Mostrar las publicaciones del usuario si existen */}
      {user && user.posts && user.posts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Publicaciones</h2>
          <div>
            {user.posts.map(post => (
              <PostCard 
                key={post.id} 
                post={{
                  ...post,
                  author: {
                    id: user.id,
                    username: user.username,
                    profilePicture: user.profilePicture
                  }
                }} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
