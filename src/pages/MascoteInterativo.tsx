import React, { useState, useEffect } from 'react';
import { Play, Heart, Utensils, Shirt, Gamepad2, ShoppingCart, Star, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import Header from '../features/student/components/Header';
import Navigation from '../features/student/components/Navigation';
import QuizGame from '../components/games/QuizGame';

interface MascotType {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  cost?: number;
}

interface MascotStats {
  health: number;
  happiness: number;
  hunger: number;
  energy: number;
  level: number;
  experience: number;
}

interface MascotState {
  emotion: 'happy' | 'sad' | 'hungry' | 'sleepy' | 'excited' | 'sick';
  animation: 'idle' | 'eating' | 'playing' | 'sleeping' | 'dancing';
  lastInteraction: Date;
}

const MascoteInterativo = () => {
  const [coins, setCoins] = useState(120);
  const [selectedTab, setSelectedTab] = useState('care');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showMascotSelector, setShowMascotSelector] = useState(false);
  const [showQuizGame, setShowQuizGame] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  
  const [currentMascot, setCurrentMascot] = useState('engineer');
  const [mascotStats, setMascotStats] = useState<MascotStats>({
    health: 85,
    happiness: 70,
    hunger: 40,
    energy: 60,
    level: 5,
    experience: 750
  });

  const [mascotState, setMascotState] = useState<MascotState>({
    emotion: 'happy',
    animation: 'idle',
    lastInteraction: new Date()
  });

  const mascotTypes: MascotType[] = [
    {
      id: 'engineer',
      name: 'Engenheiro',
      emoji: '👷‍♂️',
      description: 'O mascote clássico do ENGENHA+',
      unlocked: true
    },
    {
      id: 'scientist',
      name: 'Cientista',
      emoji: '👨‍🔬',
      description: 'Para os amantes da ciência',
      unlocked: false,
      cost: 100
    },
    {
      id: 'robot',
      name: 'Robô',
      emoji: '🤖',
      description: 'Tecnologia avançada',
      unlocked: false,
      cost: 150
    },
    {
      id: 'astronaut',
      name: 'Astronauta',
      emoji: '👨‍🚀',
      description: 'Para explorar o universo',
      unlocked: false,
      cost: 200
    }
  ];

  const foods = [
    { name: 'Pizza', emoji: '🍕', cost: 10, hunger: -30, happiness: +15 },
    { name: 'Hambúrguer', emoji: '🍔', cost: 15, hunger: -40, happiness: +20 },
    { name: 'Salada', emoji: '🥗', cost: 8, hunger: -20, happiness: +5, health: +10 },
    { name: 'Sorvete', emoji: '🍦', cost: 12, hunger: -15, happiness: +25 },
    { name: 'Café', emoji: '☕', cost: 5, hunger: -10, energy: +20 },
    { name: 'Vitamina', emoji: '🥤', cost: 20, hunger: -25, health: +20, energy: +15 }
  ];

  const accessories = [
    { name: 'Óculos', emoji: '🤓', cost: 30, owned: false, category: 'face' },
    { name: 'Chapéu', emoji: '🎩', cost: 50, owned: true, category: 'head' },
    { name: 'Gravata', emoji: '👔', cost: 40, owned: false, category: 'neck' },
    { name: 'Capa', emoji: '🦸‍♂️', cost: 80, owned: false, category: 'body' },
    { name: 'Coroa', emoji: '👑', cost: 100, owned: false, category: 'head' },
    { name: 'Luvas', emoji: '🧤', cost: 25, owned: false, category: 'hands' }
  ];

  const games = [
    { name: 'Quiz de Matemática', icon: '🧮', difficulty: 'easy' as const, reward: 15 },
    { name: 'Desafio de Física', icon: '⚗️', difficulty: 'medium' as const, reward: 25 },
    { name: 'Puzzle de Engenharia', icon: '🔧', difficulty: 'hard' as const, reward: 40 },
    { name: 'Memória Científica', icon: '🧠', difficulty: 'easy' as const, reward: 20 }
  ];

  // Determinar emoção do mascote baseado nos stats
  useEffect(() => {
    let newEmotion: MascotState['emotion'] = 'happy';
    
    if (mascotStats.hunger > 80) newEmotion = 'hungry';
    else if (mascotStats.health < 30) newEmotion = 'sick';
    else if (mascotStats.energy < 20) newEmotion = 'sleepy';
    else if (mascotStats.happiness > 90) newEmotion = 'excited';
    else if (mascotStats.happiness < 30) newEmotion = 'sad';

    setMascotState(prev => ({ ...prev, emotion: newEmotion }));
  }, [mascotStats]);

  // Animação automática do mascote
  useEffect(() => {
    const interval = setInterval(() => {
      const animations: MascotState['animation'][] = ['idle', 'dancing'];
      const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
      setMascotState(prev => ({ ...prev, animation: randomAnimation }));
      
      // Voltar para idle após 2 segundos
      setTimeout(() => {
        setMascotState(prev => ({ ...prev, animation: 'idle' }));
      }, 2000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const feedMascot = (food: any) => {
    if (coins >= food.cost) {
      setCoins(coins - food.cost);
      setMascotStats(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger + food.hunger),
        happiness: Math.min(100, prev.happiness + (food.happiness || 0)),
        health: Math.min(100, prev.health + (food.health || 0)),
        energy: Math.min(100, prev.energy + (food.energy || 0)),
        experience: prev.experience + 10
      }));
      
      setMascotState(prev => ({ 
        ...prev, 
        animation: 'eating',
        lastInteraction: new Date()
      }));
      
      if (soundEnabled) {
        // Simular som de comer
        console.log('🔊 Som de comer');
      }
      
      setTimeout(() => {
        setMascotState(prev => ({ ...prev, animation: 'idle' }));
      }, 2000);
    }
  };

  const playWithMascot = () => {
    setMascotStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 20),
      energy: Math.max(0, prev.energy - 15),
      experience: prev.experience + 15
    }));
    
    setMascotState(prev => ({ 
      ...prev, 
      animation: 'playing',
      lastInteraction: new Date()
    }));
    
    if (soundEnabled) {
      console.log('🔊 Som de brincadeira');
    }
    
    setTimeout(() => {
      setMascotState(prev => ({ ...prev, animation: 'idle' }));
    }, 3000);
  };

  const petMascot = () => {
    setMascotStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
      experience: prev.experience + 5
    }));
    
    setMascotState(prev => ({ 
      ...prev, 
      emotion: 'excited',
      lastInteraction: new Date()
    }));
    
    if (soundEnabled) {
      console.log('🔊 Som de carinho');
    }
  };

  const buyAccessory = (accessory: any) => {
    if (coins >= accessory.cost && !accessory.owned) {
      setCoins(coins - accessory.cost);
      setShowPurchaseModal(false);
      setSelectedItem(null);
      alert(`Você comprou ${accessory.name}! Seu mascote está mais estiloso agora! 🎉`);
    }
  };

  const changeMascot = (mascotId: string) => {
    const mascot = mascotTypes.find(m => m.id === mascotId);
    if (mascot?.unlocked || (mascot && coins >= (mascot.cost || 0))) {
      if (!mascot.unlocked && mascot.cost) {
        setCoins(coins - mascot.cost);
        // Marcar como desbloqueado
        mascot.unlocked = true;
      }
      setCurrentMascot(mascotId);
      setShowMascotSelector(false);
      
      if (soundEnabled) {
        console.log('🔊 Som de troca de mascote');
      }
    }
  };

  const startQuiz = (difficulty: 'easy' | 'medium' | 'hard') => {
    setQuizDifficulty(difficulty);
    setShowQuizGame(true);
  };

  const handleQuizEnd = (score: number, coinsEarned: number) => {
    setCoins(coins + coinsEarned);
    setMascotStats(prev => ({
      ...prev,
      experience: prev.experience + score,
      happiness: Math.min(100, prev.happiness + 10)
    }));
    setShowQuizGame(false);
    
    if (soundEnabled) {
      console.log('🔊 Som de vitória');
    }
  };

  const getMascotDisplay = () => {
    const mascot = mascotTypes.find(m => m.id === currentMascot);
    let display = mascot?.emoji || '👷‍♂️';
    
    // Adicionar efeitos baseados na emoção
    switch (mascotState.emotion) {
      case 'happy': display += '😊'; break;
      case 'sad': display += '😢'; break;
      case 'hungry': display += '🍽️'; break;
      case 'sleepy': display += '😴'; break;
      case 'excited': display += '🎉'; break;
      case 'sick': display += '🤒'; break;
    }
    
    // Adicionar efeitos de animação
    if (mascotState.animation === 'dancing') display += '💃';
    if (mascotState.animation === 'eating') display += '🍴';
    if (mascotState.animation === 'playing') display += '🎮';
    
    return display;
  };

  const getStatColor = (value: number) => {
    if (value >= 70) return 'bg-engenha-sky-blue';
    if (value >= 40) return 'bg-engenha-gold';
    return 'bg-engenha-orange';
  };

  return (
    <div className="min-h-screen bg-engenha-light-blue pb-20">
      <Header 
        title="Meu Mascote"
        subtitle={`Nível ${mascotStats.level} • ${mascotStats.experience} XP`}
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

        {/* Mascote Principal */}
        <div className="bg-engenha-light-cream rounded-2xl p-6 shadow-lg border border-engenha-sky-blue">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-engenha-dark-navy">
                {mascotTypes.find(m => m.id === currentMascot)?.name || 'Engenheiro'}
              </h2>
              <p className="text-sm text-engenha-dark-navy opacity-70">
                Última interação: {mascotState.lastInteraction.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-full bg-engenha-sky-blue text-white"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                onClick={() => setShowMascotSelector(true)}
                className="p-2 rounded-full bg-engenha-orange text-white"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Mascote Display */}
          <div 
            className="text-8xl text-center py-8 cursor-pointer select-none"
            onClick={petMascot}
            style={{
              animation: mascotState.animation === 'dancing' ? 'bounce 0.5s infinite' : 
                        mascotState.animation === 'playing' ? 'pulse 0.5s infinite' : 'none'
            }}
          >
            {getMascotDisplay()}
          </div>

          {/* Status do Mascote */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-engenha-dark-navy flex items-center">
                  <Heart className="mr-1" size={16} /> Saúde
                </span>
                <span className="text-sm text-engenha-dark-navy">{mascotStats.health}%</span>
              </div>
              <div className="w-full bg-engenha-light-blue rounded-full h-2">
                <div 
                  className={`${getStatColor(mascotStats.health)} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${mascotStats.health}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-engenha-dark-navy flex items-center">
                  😊 Felicidade
                </span>
                <span className="text-sm text-engenha-dark-navy">{mascotStats.happiness}%</span>
              </div>
              <div className="w-full bg-engenha-light-blue rounded-full h-2">
                <div 
                  className={`${getStatColor(mascotStats.happiness)} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${mascotStats.happiness}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-engenha-dark-navy flex items-center">
                  🍽️ Fome
                </span>
                <span className="text-sm text-engenha-dark-navy">{100 - mascotStats.hunger}%</span>
              </div>
              <div className="w-full bg-engenha-light-blue rounded-full h-2">
                <div 
                  className={`${getStatColor(100 - mascotStats.hunger)} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${100 - mascotStats.hunger}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-engenha-dark-navy flex items-center">
                  ⚡ Energia
                </span>
                <span className="text-sm text-engenha-dark-navy">{mascotStats.energy}%</span>
              </div>
              <div className="w-full bg-engenha-light-blue rounded-full h-2">
                <div 
                  className={`${getStatColor(mascotStats.energy)} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${mascotStats.energy}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Botões de Interação Rápida */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={playWithMascot}
              className="bg-engenha-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-engenha-dark-orange transition-colors flex items-center"
            >
              <Play className="mr-2" size={16} />
              Brincar
            </button>
            <button
              onClick={petMascot}
              className="bg-engenha-sky-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-engenha-bright-blue transition-colors flex items-center"
            >
              <Heart className="mr-2" size={16} />
              Carinho
            </button>
          </div>
        </div>

        {/* Tabs de Atividades */}
        <div className="bg-engenha-light-cream rounded-xl shadow-sm border border-engenha-sky-blue">
          <div className="flex border-b border-engenha-sky-blue">
            <button
              onClick={() => setSelectedTab('care')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                selectedTab === 'care' 
                  ? 'bg-engenha-sky-blue text-white' 
                  : 'text-engenha-dark-navy hover:bg-engenha-light-blue'
              }`}
            >
              <Utensils className="inline mr-2" size={16} />
              Cuidar
            </button>
            <button
              onClick={() => setSelectedTab('dress')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                selectedTab === 'dress' 
                  ? 'bg-engenha-sky-blue text-white' 
                  : 'text-engenha-dark-navy hover:bg-engenha-light-blue'
              }`}
            >
              <Shirt className="inline mr-2" size={16} />
              Vestir
            </button>
            <button
              onClick={() => setSelectedTab('play')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                selectedTab === 'play' 
                  ? 'bg-engenha-sky-blue text-white' 
                  : 'text-engenha-dark-navy hover:bg-engenha-light-blue'
              }`}
            >
              <Gamepad2 className="inline mr-2" size={16} />
              Jogar
            </button>
          </div>

          <div className="p-4">
            {/* Aba Cuidar */}
            {selectedTab === 'care' && (
              <div>
                <h3 className="font-semibold text-engenha-dark-navy mb-4">Alimentar Mascote</h3>
                <div className="grid grid-cols-2 gap-3">
                  {foods.map((food, index) => (
                    <button
                      key={index}
                      onClick={() => feedMascot(food)}
                      disabled={coins < food.cost}
                      className={`p-3 rounded-lg border transition-colors ${
                        coins >= food.cost
                          ? 'border-engenha-sky-blue bg-engenha-light-blue hover:bg-engenha-sky-blue hover:text-white'
                          : 'border-engenha-light-blue bg-engenha-light-blue text-engenha-dark-navy cursor-not-allowed'
                      }`}
                    >
                      <div className="text-2xl mb-1">{food.emoji}</div>
                      <div className="text-sm font-medium">{food.name}</div>
                      <div className="text-xs text-engenha-gold">🪙 {food.cost}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Aba Vestir */}
            {selectedTab === 'dress' && (
              <div>
                <h3 className="font-semibold text-engenha-dark-navy mb-4">Personalizar Mascote</h3>
                <div className="grid grid-cols-2 gap-3">
                  {accessories.map((accessory, index) => (
                    <div key={index} className="p-3 rounded-lg border border-engenha-sky-blue bg-engenha-light-blue">
                      <div className="text-2xl mb-1">{accessory.emoji}</div>
                      <div className="text-sm font-medium text-engenha-dark-navy">{accessory.name}</div>
                      <div className="text-xs text-engenha-gold mb-2">🪙 {accessory.cost}</div>
                      {accessory.owned ? (
                        <button className="w-full bg-engenha-sky-blue text-white py-1 px-2 rounded text-xs">
                          Equipado
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedItem(accessory);
                            setShowPurchaseModal(true);
                          }}
                          disabled={coins < accessory.cost}
                          className={`w-full py-1 px-2 rounded text-xs font-medium ${
                            coins >= accessory.cost
                              ? 'bg-engenha-orange text-white hover:bg-engenha-dark-orange'
                              : 'bg-engenha-light-blue text-engenha-dark-navy cursor-not-allowed'
                          }`}
                        >
                          Comprar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aba Jogar */}
            {selectedTab === 'play' && (
              <div>
                <h3 className="font-semibold text-engenha-dark-navy mb-4">Mini-Jogos Educativos</h3>
                <div className="space-y-3">
                  {games.map((game, index) => (
                    <div key={index} className="p-4 rounded-lg border border-engenha-sky-blue bg-engenha-light-blue">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{game.icon}</div>
                          <div>
                            <div className="font-medium text-engenha-dark-navy">{game.name}</div>
                            <div className="text-xs text-engenha-dark-navy opacity-70">
                              Dificuldade: {game.difficulty === 'easy' ? 'Fácil' : game.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-engenha-gold font-medium">
                            🪙 +{game.reward}
                          </div>
                          <button 
                            onClick={() => startQuiz(game.difficulty)}
                            className="bg-engenha-orange text-white px-3 py-1 rounded text-sm hover:bg-engenha-dark-orange transition-colors"
                          >
                            Jogar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Compra */}
      {showPurchaseModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-sm w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">{selectedItem.emoji}</div>
              <h3 className="text-lg font-bold text-engenha-dark-navy mb-2">
                Comprar {selectedItem.name}?
              </h3>
              <p className="text-sm text-engenha-dark-navy mb-4">
                Este item custará {selectedItem.cost} moedas. Você tem {coins} moedas disponíveis.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => buyAccessory(selectedItem)}
                  disabled={coins < selectedItem.cost}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                    coins >= selectedItem.cost
                      ? 'bg-engenha-orange text-white hover:bg-engenha-dark-orange'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Comprar 🪙 {selectedItem.cost}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Mascote */}
      {showMascotSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-md w-full">
            <h3 className="text-lg font-bold text-engenha-dark-navy mb-4 text-center">
              Escolher Mascote
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {mascotTypes.map((mascot) => (
                <button
                  key={mascot.id}
                  onClick={() => changeMascot(mascot.id)}
                  disabled={!mascot.unlocked && coins < (mascot.cost || 0)}
                  className={`p-4 rounded-lg border transition-colors ${
                    currentMascot === mascot.id
                      ? 'border-engenha-orange bg-engenha-orange text-white'
                      : mascot.unlocked || coins >= (mascot.cost || 0)
                      ? 'border-engenha-sky-blue bg-engenha-light-blue hover:bg-engenha-sky-blue hover:text-white'
                      : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="text-3xl mb-2">{mascot.emoji}</div>
                  <div className="text-sm font-medium">{mascot.name}</div>
                  <div className="text-xs opacity-70">{mascot.description}</div>
                  {!mascot.unlocked && (
                    <div className="text-xs text-engenha-gold mt-1">🪙 {mascot.cost}</div>
                  )}
                  {mascot.unlocked && (
                    <div className="text-xs text-green-600 mt-1">✓ Desbloqueado</div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMascotSelector(false)}
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Quiz Game */}
      {showQuizGame && (
        <QuizGame
          difficulty={quizDifficulty}
          onGameEnd={handleQuizEnd}
          onClose={() => setShowQuizGame(false)}
        />
      )}

      <Navigation />
    </div>
  );
};

export default MascoteInterativo;

