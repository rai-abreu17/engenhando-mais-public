
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login by default
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Index;
