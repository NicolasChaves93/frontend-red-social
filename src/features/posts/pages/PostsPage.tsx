import { useEffect, useState, useCallback } from "react";
import { usePosts } from "../hooks/usePosts";
import PostCard from "../components/PostCard";
import CreatePostForm from "../components/CreatePostForm";
import Spinner from "../../../shared/components/Spinner";
import Button from "../../../shared/components/Button";
import { useToast } from "../../../shared/hooks/useToast";

export default function PostsPage() {
  const { posts, loading, error, fetchPosts } = usePosts();
  const { showToast } = useToast();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const loadPosts = useCallback(async () => {
    if (loading) return;

    try {
      await fetchPosts();
      if (isInitialLoad) setIsInitialLoad(false);
    } catch (error: any) {
      showToast(error.message || "Error al cargar las publicaciones", "error");
      setIsInitialLoad(false);
    }
  }, [fetchPosts, loading, isInitialLoad, showToast]);

  // Cargar posts solo una vez al montar el componente
  useEffect(() => {
    if (isInitialLoad) {
      loadPosts();
    }
  }, []);

  const renderContent = () => {
    if (loading && isInitialLoad) {
      return <Spinner />;
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-lg">
          <h3 className="font-medium mb-2">Error al cargar las publicaciones</h3>
          <p>{error}</p>
        </div>
      );
    }

    if (!posts || posts.length === 0) {
      return (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg text-gray-500 font-medium">No hay publicaciones aún</p>
          <p className="text-gray-400 mt-2">¡Sé el primero en compartir algo!</p>
        </div>
      );
    }

    return (
      <div>
        {posts.map((post) => {
          // Verificar que post exista y tenga id
          if (!post || !post.id) {
            console.error("Invalid post object:", post);
            return null;
          }
          return <PostCard key={post.id} post={post} />;
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Publicaciones</h1>

        {/* Botón de recarga */}
        <Button
          onClick={loadPosts}
          disabled={loading}
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Cargando...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Actualizar</span>
            </>
          )}
        </Button>
      </div>

      <CreatePostForm onPostCreated={loadPosts} />

      {renderContent()}
    </div>
  );
}
