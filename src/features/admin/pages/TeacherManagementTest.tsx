import React from 'react';

const TeacherManagementTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Gerenciar Professores - Teste
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Lista de Professores</h2>
          
          <div className="space-y-4">
            <div className="border rounded p-4">
              <h3 className="font-medium">Prof. Maria Silva</h3>
              <p className="text-gray-600">maria.silva@escola.com</p>
              <p className="text-sm text-gray-500">Matemática</p>
            </div>
            
            <div className="border rounded p-4">
              <h3 className="font-medium">Prof. João Santos</h3>
              <p className="text-gray-600">joao.santos@escola.com</p>
              <p className="text-sm text-gray-500">Física</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherManagementTest;
