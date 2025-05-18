import { create } from "zustand";
import type { Post } from "../../../shared/types";

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  loading: false,
  error: null,
  setPosts: (posts) => {
    // Verificar que posts sea un array
    if (!Array.isArray(posts)) {
      console.error("setPosts recibió un valor no-array:", posts);
      return;
    }
    set({ posts });
  },
  addPost: (post) => {
    // Verificar que el post tenga un id antes de añadirlo
    if (!post || !post.id) {
      console.error("Intentando añadir un post inválido:", post);
      return;
    }
    set((state) => {
      // Verificar que no exista ya un post con ese id
      const exists = state.posts.some((p) => p.id === post.id);
      if (exists) {
        console.warn("Ya existe un post con ese id:", post.id);
        return state;
      }
      return { posts: [post, ...state.posts] };
    });
  },
  updatePost: (updatedPost) => {
    if (!updatedPost || !updatedPost.id) {
      console.error("Intentando actualizar un post inválido:", updatedPost);
      return;
    }
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
    }));
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
