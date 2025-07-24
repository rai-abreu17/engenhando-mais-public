import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { COLORS } from "@/constants/theme";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Exibir informações de depuração no console
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Verificar estado de autenticação
    const token = localStorage.getItem('engenha_token');
    const storedUserType = localStorage.getItem('engenha_user_type');
    setIsAuthenticated(!!token);
    setUserType(storedUserType);
  }, [location.pathname]);

  const getHomePage = () => {
    if (!isAuthenticated) return '/login';
    
    switch(userType) {
      case 'admin':
        return '/admin/dashboard';
      case 'teacher':
        return '/professores/dashboard';
      default:
        return '/home';
    }
  };

  const goHome = () => {
    navigate(getHomePage());
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.lightBlue }}>
      <div className="text-center p-8 rounded-lg bg-white shadow-lg max-w-lg">
        <h1 className="text-5xl font-bold mb-6" style={{ color: COLORS.darkNavy }}>404</h1>
        <p className="text-2xl mb-4" style={{ color: COLORS.darkNavy }}>Página não encontrada</p>
        <p className="mb-8 text-gray-600">A página que você está procurando não existe ou foi movida.</p>
        
        {/* Informações de depuração */}
        <div className="mb-6 p-4 bg-gray-100 rounded text-left text-sm">
          <p><strong>Rota:</strong> {location.pathname}</p>
          <p><strong>Autenticado:</strong> {isAuthenticated ? 'Sim' : 'Não'}</p>
          <p><strong>Tipo de Usuário:</strong> {userType || 'Nenhum'}</p>
        </div>
        
        <Button onClick={goHome} style={{ backgroundColor: COLORS.brightBlue }}>
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
