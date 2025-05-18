import { useState } from "react";
import api from "../../../shared/utils/api";
import { useAuthStore } from "../store/authStore";
import type { AuthResponse, User } from "../../../shared/types";

export function useAuth() {
  const { token, user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post<AuthResponse>("/auth/login", { 
        email, 
        password 
      });
      
      setAuth(response.data.token, response.data.user);
      return response.data;
    } catch (err: any) {

      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/auth/register", { 
        name, 
        email, 
        password 
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al registrar usuario";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<User>("/users/profile");
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al obtener el perfil";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
  };

  return { 
    token, 
    user, 
    isAuthenticated, 
    login, 
    register, 
    logout,
    getProfile,
    loading,
    error
  };
}
