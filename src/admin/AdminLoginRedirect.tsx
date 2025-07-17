import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminLoginRedirectProps {
  email: string;
  password: string;
}

const AdminLoginRedirect: React.FC<AdminLoginRedirectProps> = ({ email, password }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (email === 'Administrador@email.com' && password === '1234') {
      navigate('/admin');
    }
  }, [email, password, navigate]);

  return null;
};

export default AdminLoginRedirect;
