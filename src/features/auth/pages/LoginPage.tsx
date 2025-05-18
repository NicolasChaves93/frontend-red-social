import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../../../shared/hooks/useToast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  
  const from = (location.state as any)?.from?.pathname || "/posts";

  // Añadir estado para mensajes de error del formulario
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      showToast("Inicio de sesión exitoso", "success");
      navigate(from, { replace: true });
    } catch (error: any) {
      // Capturar específicamente errores 401 y mostrar mensaje del servidor
      if (error.response?.status === 401) {
        const errorMessage = error.response.data?.message || "Email o contraseña inválidos";
        showToast(errorMessage, "error");
      } else {
        showToast(error.message || "Error al iniciar sesión", "error");
      }
      
      // Mostrar mensaje de error debajo del formulario también para mejor visibilidad
      setFormError(error.response?.data?.message || error.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-white px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h1>
        
        {/* Mostrar mensaje de error si existe */}
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />
          
          <Input
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
          />
          
          <Button
            type="submit"
            className="w-full mt-6"
            isLoading={loading}
            disabled={loading}
          >
            Iniciar sesión
          </Button>
        </form>
        
        <p className="mt-6 text-center text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}
