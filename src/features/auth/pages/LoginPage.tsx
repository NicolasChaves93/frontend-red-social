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
  
  // Obtener la ruta a la que se intentaba acceder antes de login
  const from = (location.state as any)?.from?.pathname || "/posts";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      showToast("Inicio de sesión exitoso", "success");
      navigate(from, { replace: true });
    } catch (error: any) {
      showToast(error.message || "Error al iniciar sesión", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-white px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h1>
        
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
