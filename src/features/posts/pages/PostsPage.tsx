import { useEffect } from "react";
import { usePosts } from "../hooks/usePosts";
import PostCard from "../components/PostCard";
import CreatePostForm from "../components/CreatePostForm";
import Spinner from "../../../shared/components/Spinner";
import { useToast } from "../../../shared/hooks/useToast";

export default function PostsPage() {
  const { posts, loading, error, fetchPosts } = usePosts();
  const { showToast } = useToast();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        await fetchPosts();
      } catch (error: any) {
        showToast(error.message || "Error al cargar las publicaciones", "error");
      }
    };

    loadPosts();
  }, [fetchPosts, showToast]);

  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Publicaciones</h1>
      
      <CreatePostForm />
      
      {loading && posts.length === 0 ? (
        <Spinner />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          Error al cargar las publicaciones: {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay publicaciones aún</p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
