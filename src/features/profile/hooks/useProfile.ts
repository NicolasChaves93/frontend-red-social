import { useState } from "react";
import api from "../../../shared/utils/api";
import type { User } from "../../../shared/types";

interface ProfileResponse {
  success: boolean;
  data: User;
}

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserProfile = async (userId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = userId ? `/users/${userId}` : "/users/profile";
      const response = await api.get<ProfileResponse>(url);
      
      // Verificar la estructura de la respuesta
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error("Formato de respuesta inesperado");
      }
    } catch (err: any) {
      console.error("Error al obtener perfil:", err);
      const message = err.response?.data?.message || "Error al obtener el perfil";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put<ProfileResponse>("/users/profile", data);
      
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error("Formato de respuesta inesperado");
      }
    } catch (err: any) {
      console.error("Error al actualizar perfil:", err);
      const message = err.response?.data?.message || "Error al actualizar el perfil";
      setError(message);
      throw err;
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
