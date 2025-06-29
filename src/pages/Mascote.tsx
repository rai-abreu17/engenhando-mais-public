
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const Mascote = () => {
  const [mascotStats, setMascotStats] = useState({
    health: 85,
    hunger: 40,
    energy: 60
  });
  const [coins, setCoins] = useState(120);
  const [studyStreak, setStudyStreak] = useState(7);
  const [selectedTab, setSelectedTab] = useState('care');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [currentMascot, setCurrentMascot] = useState('🐱');

  // Load mascot from localStorage on component mount
  useEffect(() => {
    const savedMascot = localStorage.getItem('selectedMascot');
    if (savedMascot) {
      setCurrentMascot(savedMascot);
    }
  }, []);

  // Save mascot to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedMascot', currentMascot);
  }, [currentMascot]);

  const mascotState = () => {
    if (mascotStats.hunger > 80) return 'muito-com-fome';
    if (mascotStats.health < 30) return 'doente';
    if (mascotStats.energy < 20) return 'cansado';
    return 'normal';
  };

  const feedMascot = (foodType: string, cost: number) => {
    if (coins >= cost) {
      setCoins(coins - cost);
      setMascotStats(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 30),
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
      energy: Math.max(0, prev.energy - 15)
    }));
  };

  const foods = [
    { name: 'Pizza 🍕', cost: 10, effect: 'Reduz fome moderadamente' },
    { name: 'Hambúrguer 🍔', cost: 15, effect: 'Reduz fome e aumenta saúde' },
    { name: 'Sorvete 🍦', cost: 8, effect: 'Reduz fome levemente' },
    { name: 'Energia ⚡', cost: 20, effect: 'Restaura energia completamente' }
  ];

  const accessories = [
    { name: 'Óculos 🤓', cost: 25, owned: true },
    { name: 'Chapéu 🎩', cost: 30, owned: false },
    { name: 'Gravata 👔', cost: 20, owned: true },
    { name: 'Capa 🦸', cost: 50, owned: false }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMascotStats(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 2),
        energy: Math.max(0, prev.energy - 1)
      }));
    }, 30000); // Stats decrease over time

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-engenha-light-blue pb-20">
      <Header 
        title="Meu Mascote"
        subtitle={`${studyStreak} dias consecutivos cuidando dele`}
        showStreak={true}
        streakDays={studyStreak}
      />

      <div className="px-6 space-y-6">
        {/* Indicador de Moedas */}
        <div className="flex justify-end">
          <div className="bg-engenha-gold border border-engenha-gold px-4 py-2 rounded-full shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🪙</span>
              <span className="font-semibold text-engenha-dark-navy">{coins}</span>
              <span className="text-xs text-engenha-dark-navy">moedas</span>
            </div>
          </div>
        </div>

        {/* Mascot Display */}
        <section className="bg-gradient-to-br from-engenha-sky-blue to-engenha-orange p-6 rounded-xl text-white">
          <div className="text-center">
            <div className="text-8xl mb-4 animate-bounce-gentle">
              {currentMascot}
            </div>
            <h2 className="text-xl font-bold mb-2">Engenho Jr.</h2>
            <p className="text-engenha-light-cream opacity-80">
              {mascotState() === 'muito-com-fome' ? 'Precisa de comida urgentemente!' :
               mascotState() === 'doente' ? 'Não está se sentindo bem...' :
               mascotState() === 'cansado' ? 'Está muito cansado, precisa descansar!' :
               'Pronto para estudar!'}
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-engenha-light-cream p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold text-engenha-dark-navy mb-4">Status do Mascote</h3>
          <div className="space-y-3">
            {[
              { name: 'Saúde', value: mascotStats.health, color: 'bg-engenha-sky-blue', icon: '❤️' },
              { name: 'Fome', value: 100 - mascotStats.hunger, color: 'bg-engenha-blue', icon: '🍽️' },
              { name: 'Energia', value: mascotStats.energy, color: 'bg-engenha-orange', icon: '⚡' }
            ].map((stat) => (
              <div key={stat.name} className="flex items-center space-x-3">
                <span className="text-lg">{stat.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-engenha-dark-navy">{stat.name}</span>
                    <span className="text-sm text-engenha-dark-navy opacity-70">{stat.value}%</span>
                  </div>
                  <div className="w-full bg-engenha-light-blue rounded-full h-2">
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
            { id: 'customize', label: 'Personalizar', icon: '�' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-engenha-blue text-white'
                  : 'bg-engenha-light-cream text-engenha-dark-navy border border-engenha-sky-blue'
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
            <h3 className="font-semibold text-engenha-dark-navy">Alimentar Mascote</h3>
            <div className="grid grid-cols-2 gap-3">
              {foods.map((food) => (
                <button
                  key={food.name}
                  onClick={() => feedMascot(food.name, food.cost)}
                  disabled={coins < food.cost}
                  className={`bg-engenha-light-cream p-4 rounded-xl border text-left transition-colors ${
                    coins >= food.cost 
                      ? 'border-engenha-sky-blue hover:border-engenha-orange hover:shadow-md' 
                      : 'border-engenha-light-blue opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-2xl mb-2">{food.name.split(' ')[1]}</div>
                  <h4 className="font-medium text-engenha-dark-navy">{food.name.split(' ')[0]}</h4>
                  <p className="text-xs text-engenha-dark-navy opacity-70 mb-2">{food.effect}</p>
                  <p className="text-sm font-bold text-engenha-blue">🪙 {food.cost}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {selectedTab === 'dress' && (
          <section className="space-y-4">
            <h3 className="font-semibold text-engenha-dark-navy">Personalizar Mascote</h3>
            <div className="grid grid-cols-2 gap-3">
              {accessories.map((accessory) => (
                <div
                  key={accessory.name}
                  className={`bg-engenha-light-cream p-4 rounded-xl border ${
                    accessory.owned ? 'border-engenha-sky-blue bg-engenha-light-blue' : 'border-engenha-sky-blue'
                  }`}
                >
                  <div className="text-2xl mb-2">{accessory.name.split(' ')[1]}</div>
                  <h4 className="font-medium text-engenha-dark-navy">{accessory.name.split(' ')[0]}</h4>
                  {accessory.owned ? (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-engenha-sky-blue font-medium">✓ Possui</p>
                      <button className="text-xs bg-engenha-light-blue text-engenha-dark-navy px-2 py-1 rounded">
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
                            ? 'bg-engenha-orange text-white hover:bg-engenha-dark-orange'
                            : 'bg-engenha-light-blue text-engenha-dark-navy cursor-not-allowed'
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

        {selectedTab === 'customize' && (
          <section className="space-y-4">
            <h3 className="font-semibold text-engenha-dark-navy">Escolha seu Mascote</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { emoji: '🐱', name: 'Gato' },
                { emoji: '🐶', name: 'Cachorro' },
                { emoji: '🐨', name: 'Coala' },
                { emoji: '🐸', name: 'Sapo' },
                { emoji: '🦊', name: 'Raposa' },
                { emoji: '🐺', name: 'Lobo' },
                { emoji: '🦝', name: 'Guaxinim' },
                { emoji: '🐹', name: 'Hamster' },
                { emoji: '🐰', name: 'Coelho' }
              ].map((mascot) => (
                <button
                  key={mascot.emoji}
                  onClick={() => setCurrentMascot(mascot.emoji)}
                  className={`bg-engenha-light-cream p-4 rounded-xl border-2 transition-all text-center ${
                    currentMascot === mascot.emoji
                      ? 'border-engenha-orange bg-engenha-light-blue'
                      : 'border-engenha-sky-blue hover:border-engenha-orange'
                  }`}
                >
                  <div className="text-3xl mb-2">{mascot.emoji}</div>
                  <p className="text-sm font-medium text-engenha-dark-navy">{mascot.name}</p>
                </button>
              ))}
            </div>
            <div className="bg-engenha-light-blue p-4 rounded-xl">
              <p className="text-sm text-engenha-dark-navy">
                💡 Seu mascote escolhido será salvo automaticamente e permanecerá o mesmo em todos os dispositivos!
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-engenha-light-cream rounded-xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">{selectedItem.name.split(' ')[1]}</div>
              <h3 className="text-lg font-bold text-engenha-dark-navy mb-2">
                Comprar {selectedItem.name.split(' ')[0]}?
              </h3>
              <p className="text-engenha-dark-navy opacity-70 text-sm mb-4">
                Este item custará {selectedItem.cost} moedas. Você tem {coins} moedas disponíveis.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 bg-engenha-light-blue text-engenha-dark-navy py-2 rounded-lg font-medium hover:bg-engenha-sky-blue hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => buyAccessory(selectedItem)}
                  disabled={coins < selectedItem.cost}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    coins >= selectedItem.cost
                      ? 'bg-engenha-orange text-white hover:bg-engenha-dark-orange'
                      : 'bg-engenha-light-blue text-engenha-dark-navy cursor-not-allowed'
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
