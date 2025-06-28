
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const Mascote = () => {
  const [mascotStats, setMascotStats] = useState({
    health: 85,
    happiness: 70,
    hunger: 40,
    energy: 60
  });
  const [coins, setCoins] = useState(120);
  const [studyStreak, setStudyStreak] = useState(7);
  const [selectedTab, setSelectedTab] = useState('care');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const mascotState = () => {
    if (mascotStats.hunger > 80) return 'muito-com-fome';
    if (mascotStats.happiness > 80) return 'feliz';
    if (mascotStats.health < 30) return 'doente';
    return 'normal';
  };

  const feedMascot = (foodType: string, cost: number) => {
    if (coins >= cost) {
      setCoins(coins - cost);
      setMascotStats(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 30),
        happiness: Math.min(100, prev.happiness + 15),
        health: Math.min(100, prev.health + 10)
      }));
    }
  };

  const buyAccessory = (accessory: any) => {
    if (coins >= accessory.cost && !accessory.owned) {
      setCoins(coins - accessory.cost);
      // Update the accessory to owned
      const updatedAccessories = accessories.map(item => 
        item.name === accessory.name ? { ...item, owned: true } : item
      );
      setShowPurchaseModal(false);
      setSelectedItem(null);
      // In a real app, you would update the state properly
      alert(`Você comprou ${accessory.name}! Seu mascote está mais estiloso agora! 🎉`);
    }
  };

  const openPurchaseModal = (item: any) => {
    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const playWithMascot = () => {
    setMascotStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 20),
      energy: Math.max(0, prev.energy - 15)
    }));
  };

  const foods = [
    { name: 'Pizza 🍕', cost: 10, effect: 'Reduz fome moderadamente' },
    { name: 'Hambúrguer 🍔', cost: 15, effect: 'Reduz fome e aumenta felicidade' },
    { name: 'Sorvete 🍦', cost: 8, effect: 'Aumenta felicidade' },
    { name: 'Energia ⚡', cost: 20, effect: 'Restaura energia completamente' }
  ];

  const accessories = [
    { name: 'Óculos 🤓', cost: 25, owned: true },
    { name: 'Chapéu 🎩', cost: 30, owned: false },
    { name: 'Gravata 👔', cost: 20, owned: true },
    { name: 'Capa 🦸', cost: 50, owned: false }
  ];

  const minigames = [
    { name: 'Quiz Rápido', icon: '🧠', reward: '+5 moedas' },
    { name: 'Carrinho 2D', icon: '🏎️', reward: '+10 moedas' },
    { name: 'Quebra-Cabeça', icon: '🧩', reward: '+8 moedas' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMascotStats(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 2),
        happiness: Math.max(0, prev.happiness - 1),
        energy: Math.max(0, prev.energy - 1)
      }));
    }, 30000); // Stats decrease over time

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header 
        title="Meu Mascote"
        subtitle={`${studyStreak} dias consecutivos cuidando dele`}
        showCoins={true}
        coins={coins}
      />

      <div className="px-6 space-y-6">
        {/* Mascot Display */}
        <section className="bg-gradient-to-br from-blue-400 to-purple-500 p-6 rounded-xl text-white">
          <div className="text-center">
            <div className="text-8xl mb-4 animate-bounce-gentle">
              {mascotState() === 'feliz' ? '😊' : 
               mascotState() === 'muito-com-fome' ? '😫' :
               mascotState() === 'doente' ? '🤒' : '😐'}
            </div>
            <h2 className="text-xl font-bold mb-2">Engenho Jr.</h2>
            <p className="text-blue-100">
              {mascotState() === 'feliz' ? 'Muito feliz e pronto para estudar!' :
               mascotState() === 'muito-com-fome' ? 'Precisa de comida urgentemente!' :
               mascotState() === 'doente' ? 'Não está se sentindo bem...' :
               'Esperando seus cuidados'}
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Status do Mascote</h3>
          <div className="space-y-3">
            {[
              { name: 'Saúde', value: mascotStats.health, color: 'bg-green-500', icon: '❤️' },
              { name: 'Felicidade', value: mascotStats.happiness, color: 'bg-yellow-500', icon: '😊' },
              { name: 'Fome', value: 100 - mascotStats.hunger, color: 'bg-blue-500', icon: '🍽️' },
              { name: 'Energia', value: mascotStats.energy, color: 'bg-purple-500', icon: '⚡' }
            ].map((stat) => (
              <div key={stat.name} className="flex items-center space-x-3">
                <span className="text-lg">{stat.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{stat.name}</span>
                    <span className="text-sm text-gray-500">{stat.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${stat.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${stat.value}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Tabs */}
        <div className="flex space-x-2">
          {[
            { id: 'care', label: 'Cuidar', icon: '🍔' },
            { id: 'dress', label: 'Vestir', icon: '👕' },
            { id: 'play', label: 'Jogar', icon: '🎮' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-engenha-blue text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content based on selected tab */}
        {selectedTab === 'care' && (
          <section className="space-y-4">
            <h3 className="font-semibold text-gray-800">Alimentar Mascote</h3>
            <div className="grid grid-cols-2 gap-3">
              {foods.map((food) => (
                <button
                  key={food.name}
                  onClick={() => feedMascot(food.name, food.cost)}
                  disabled={coins < food.cost}
                  className={`bg-white p-4 rounded-xl border text-left transition-colors ${
                    coins >= food.cost 
                      ? 'border-gray-200 hover:border-engenha-blue hover:shadow-md' 
                      : 'border-gray-100 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-2xl mb-2">{food.name.split(' ')[1]}</div>
                  <h4 className="font-medium text-gray-800">{food.name.split(' ')[0]}</h4>
                  <p className="text-xs text-gray-500 mb-2">{food.effect}</p>
                  <p className="text-sm font-bold text-engenha-blue">🪙 {food.cost}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {selectedTab === 'dress' && (
          <section className="space-y-4">
            <h3 className="font-semibold text-gray-800">Personalizar Mascote</h3>
            <div className="grid grid-cols-2 gap-3">
              {accessories.map((accessory) => (
                <div
                  key={accessory.name}
                  className={`bg-white p-4 rounded-xl border ${
                    accessory.owned ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-2">{accessory.name.split(' ')[1]}</div>
                  <h4 className="font-medium text-gray-800">{accessory.name.split(' ')[0]}</h4>
                  {accessory.owned ? (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-green-600 font-medium">✓ Possui</p>
                      <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Equipado
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-engenha-blue">🪙 {accessory.cost}</p>
                      <button
                        onClick={() => openPurchaseModal(accessory)}
                        disabled={coins < accessory.cost}
                        className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
                          coins >= accessory.cost
                            ? 'bg-engenha-blue text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Comprar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedTab === 'play' && (
          <section className="space-y-4">
            <h3 className="font-semibold text-gray-800">Minigames Educacionais</h3>
            <div className="space-y-3">
              {minigames.map((game) => (
                <button
                  key={game.name}
                  onClick={playWithMascot}
                  className="w-full bg-white p-4 rounded-xl border border-gray-200 hover:border-engenha-blue hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{game.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-800">{game.name}</h4>
                        <p className="text-sm text-gray-500">Ganhe moedas respondendo perguntas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-engenha-blue">{game.reward}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">{selectedItem.name.split(' ')[1]}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Comprar {selectedItem.name.split(' ')[0]}?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Este item custará {selectedItem.cost} moedas. Você tem {coins} moedas disponíveis.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => buyAccessory(selectedItem)}
                  disabled={coins < selectedItem.cost}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    coins >= selectedItem.cost
                      ? 'bg-engenha-blue text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Comprar 🪙 {selectedItem.cost}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
};

export default Mascote;
