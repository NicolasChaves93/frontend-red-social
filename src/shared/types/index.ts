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
  createdAt: string;
  author: User;
  likes: number;
  liked: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
