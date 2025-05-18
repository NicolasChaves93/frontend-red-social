import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";
import ToastContainer from "../../shared/components/ToastContainer";
import { useToast } from "../../shared/hooks/useToast";

export default function AppLayout() {
  const { user, clearAuth } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast, hideToast } = useToast();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex flex-col">
      {/* Navbar */}
      <header className="w-full shadow-sm bg-white/80 backdrop-blur sticky top-0 z-10">
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/posts" className="flex items-center">
            <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
              <path d="M11 11h2v6h-2zm0-4h2v2h-2z" />
            </svg>
            <span className="ml-2 font-bold text-xl text-blue-700 tracking-tight">Red Social</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/posts"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/profile"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Perfil
            </Link>
            {user && (
              <div className="relative ml-4">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center focus:outline-none"
                  aria-expanded={menuOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="ml-2 text-gray-700">{user.name}</span>
                  <svg
                    className={`ml-1 w-4 h-4 transform transition-transform ${menuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Mi Perfil
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 py-2">
              <Link
                to="/posts"
                className="block py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/profile"
                className="block py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Perfil
              </Link>
              {user && (
                <button
                  className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Cerrar Sesión
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Contenido principal */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Toasts para mensajes de feedback */}
      {toast.visible && (
        <ToastContainer 
          message={toast.message} 
          type={toast.type} 
          visible={toast.visible}
          onClose={hideToast} 
        />
      )}
    </div>
  );
}
