import { useState } from "react";
import api from "../../../shared/utils/api";
import { usePostsStore } from "../store/postsStore";
import type { Post } from "../../../shared/types";

export function usePosts() {
  const { posts, loading, error, setPosts, addPost, updatePost, setLoading, setError } = usePostsStore();
  
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<Post[]>("/posts");
      setPosts(response.data);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al obtener publicaciones";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

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
      
      const response = await api.post<Post>(
        "/posts", 
        formData || { content },
        formData ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        } : undefined
      );
      
      addPost(response.data);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al crear la publicación";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      const response = await api.post<{ liked: boolean }>(`/posts/${postId}/like`);
      
      // Actualizar el post con el nuevo estado de like
      updatePost({
        ...posts.find(p => p.id === postId)!,
        liked: response.data.liked,
        likes: response.data.liked 
          ? posts.find(p => p.id === postId)!.likes + 1 
          : posts.find(p => p.id === postId)!.likes - 1
      });
      
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
