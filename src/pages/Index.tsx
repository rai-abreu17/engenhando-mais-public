
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login only if no authentication is found
    const hasAuth = localStorage.getItem('engenha_token');
    if (!hasAuth) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f0f6ff] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#030025] mb-4">ENGENHA+</h1>
        <p className="text-[#030025]">Carregando...</p>
      </div>
    </div>
  );
};

export default Index;
