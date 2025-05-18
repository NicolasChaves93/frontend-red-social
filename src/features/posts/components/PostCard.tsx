import { useState } from "react";
import { Link } from "react-router-dom";
import type { Post } from "../../../shared/types";
import { usePosts } from "../hooks/usePosts";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { toggleLike } = usePosts();
  const [isLiking, setIsLiking] = useState(false);

  // Verificar que post y sus propiedades existan antes de usarlas
  if (!post) {
    console.error("Post object is undefined");
    return null;
  }

  const handleLike = async () => {
    try {
      setIsLiking(true);
      await toggleLike(post.id);
    } catch (error) {
      console.error("Error al dar like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Extraer valores con valores por defecto para evitar errores
  const { 
    content = "", 
    imageUrl = null, 
    likesCount = 0, 
    createdAt = new Date().toISOString(),
    liked = false,
    author = { id: "", username: "", profilePicture: null }
  } = post;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
      {/* Header del post */}
      <div className="flex items-center mb-3">
        <Link to={`/profile/${author.id}`} className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {author.profilePicture ? (
              <img
                src={author.profilePicture}
                alt={author.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-blue-600 text-white text-lg font-medium">
                {author.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-800">
              {author.username}
            </h3>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
                locale: es
              })}
            </p>
          </div>
        </Link>
      </div>

      {/* Contenido del post */}
      <div className="mb-3 text-left">
        <p className="text-gray-700">{content}</p>
      </div>

      {/* Imagen del post (si existe) */}
      {imageUrl && (
        <div className="rounded-lg overflow-hidden mb-3">
          <img
            src={imageUrl}
            alt="Contenido del post"
            className="w-full h-auto max-h-96 object-cover"
          />
        </div>
      )}

      {/* Footer del post (likes) */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <button 
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded ${
            liked 
              ? "text-blue-600 bg-blue-50" 
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <svg 
            className={`w-5 h-5 ${liked ? "fill-blue-600" : "fill-gray-600"}`}
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="ml-1">{likesCount || 0}</span>
        </button>
      </div>
    </div>
  );
}
