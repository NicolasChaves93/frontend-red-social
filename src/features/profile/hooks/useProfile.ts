import { useState } from "react";
import api from "../../../shared/utils/api";
import type { User } from "../../../shared/types";

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserProfile = async (userId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = userId ? `/users/${userId}` : "/users/profile";
      const response = await api.get<User>(url);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al obtener el perfil";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Si hay una imagen, requeriría lógica especial para subir archivos
      const response = await api.put<User>("/users/profile", data);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al actualizar el perfil";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    getUserProfile,
    updateUserProfile,
    loading,
    error
  };
}
