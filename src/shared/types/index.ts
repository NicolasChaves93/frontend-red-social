export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  profileImage?: string;
}

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  likesCount: number; // Cambio de "likes" a "likesCount"
  createdAt: string;
  author: {
    id: string;
    username: string; // Cambio de "name" a "username"
    profilePicture: string | null; // Cambio de "profileImage" a "profilePicture"
  };
  liked: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
