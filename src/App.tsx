import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Biblioteca from "./pages/Biblioteca";
import MascoteNovo from './pages/MascoteNovo';
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import { useAuth } from './hooks/useAuth';

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Se estiver carregando, pode mostrar um spinner ou tela de loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/biblioteca" element={<Biblioteca />} />
            <Route path="/mascote" element={<MascoteNovo />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
