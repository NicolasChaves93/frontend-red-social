import { useState, useCallback } from "react";
import api from "../../../shared/utils/api";
import { usePostsStore } from "../store/postsStore";

export function usePosts() {
  const { posts, loading, error, setPosts, addPost, updatePost, setLoading, setError } = usePostsStore();
  
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Verificar que el token exista antes de hacer la petición
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No hay sesión activa. Por favor inicia sesión nuevamente.");
      }
      
      const response = await api.get("/posts");
      console.log("Respuesta del servidor:", response.data); // Debug log
      
      // Acceder a los posts
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setPosts(response.data.data);
        return response.data.data;
      } else {
        throw new Error("Formato de respuesta inesperado");
      }
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      
      let errorMessage = "Error al obtener publicaciones";
      
      if (err.response) {
        // Error con respuesta del servidor
        if (err.response.status === 401) {
          errorMessage = "Sesión expirada. Por favor inicia sesión nuevamente.";
        } else if (err.response.status === 403) {
          errorMessage = "No tienes permisos para ver estas publicaciones.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = "Error de conexión. Verifica tu conexión a internet.";
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setPosts, setLoading, setError]);

  const createPost = async (content: string, imageFile?: File) => {
    setLoading(true);
    setError(null);
    
    try {
      let formData = null;
      
      if (imageFile) {
        formData = new FormData();
        formData.append("content", content);
        formData.append("image", imageFile);
      }
      
      const response = await api.post(
        "/posts", 
        formData || { content },
        formData ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        } : undefined
      );
      
      console.log("Respuesta al crear post:", response.data);
      
      // Verificar la estructura de la respuesta según el formato real
      if (response.data && response.data.success && response.data.data) {
        const newPost = response.data.data;
        
        if (newPost && newPost.id) {
          const postWithLiked = {
            ...newPost,
            liked: false
          };
          
          addPost(postWithLiked);
          return postWithLiked;
        } else {
          console.error("El nuevo post no tiene un ID válido:", newPost);
          throw new Error("El post creado no tiene un formato válido");
        }
      } else {
        console.error("Formato de respuesta inesperado al crear post:", response.data);
        throw new Error("Formato de respuesta inesperado al crear el post");
      }
    } catch (err: any) {
      console.error("Error creating post:", err);
      const message = err.response?.data?.message || "Error al crear la publicación";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      
      if (response.data && response.data.success) {
        // Buscar y actualizar el post correspondiente
        updatePost({
          ...posts.find(p => p.id === postId)!,
          liked: !posts.find(p => p.id === postId)!.liked,
          likesCount: posts.find(p => p.id === postId)!.liked 
            ? posts.find(p => p.id === postId)!.likesCount - 1 
            : posts.find(p => p.id === postId)!.likesCount + 1
        });
      }
      
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al dar/quitar like";
      throw new Error(message);
    }
  };

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    toggleLike
  };
}
