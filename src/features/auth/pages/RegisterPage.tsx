import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../../../shared/hooks/useToast";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!username.trim()) {
      errors.username = "El nombre de usuario es obligatorio";
    }
    
    if (!fullName.trim()) {
      errors.fullName = "El nombre completo es obligatorio";
    }
    
    if (!email.trim()) {
      errors.email = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Formato de correo inválido";
    }
    
    if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register(username, email, password, fullName);
      showToast("Cuenta creada exitosamente. Ahora puedes iniciar sesión.", "success");
      navigate("/login");
    } catch (error: any) {
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const serverErrors = error.response.data.errors;
        const errorMsg = serverErrors.join(", ");
        showToast(`Error: ${errorMsg}`, "error");
      } else {
        showToast(error.message || "Error al registrar usuario", "error");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-white px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Crear cuenta
        </h1>
        
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={formErrors.fullName}
            required
            placeholder="Tu nombre completo"
          />
          
          <Input
            type="text"
            label="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={formErrors.username}
            required
            placeholder="Tu nombre de usuario"
          />
          
          <Input
            type="email"
            label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={formErrors.email}
            required
            placeholder="tu@email.com"
          />
          
          <Input
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={formErrors.password}
            required
            placeholder="********"
          />
          
          <Input
            type="password"
            label="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={formErrors.confirmPassword}
            required
            placeholder="********"
          />
          
          <Button
            type="submit"
            className="w-full mt-6"
            isLoading={loading}
            disabled={loading}
          >
            Registrarse
          </Button>
        </form>
        
        <p className="mt-6 text-center text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
