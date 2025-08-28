import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Utensils, Hand, Moon, Gamepad2, Shirt, Sparkles, Volume2, VolumeX, Edit2 } from 'lucide-react';
import Navigation from '../components/common/Navigation';
import RacingGame from '../components/games/RacingGame';
import ShootingGame from '../components/games/ShootingGame';

interface AnimalMascot {
  id: string;
  name: string;
  emoji: string;
  type: 'cat' | 'dog' | 'rabbit' | 'bird' | 'hamster' | 'fish';
  unlocked: boolean;
  cost?: number;
  description: string;
}

interface MascotStats {
  hunger: number;
  energy: number;
  health: number;
  level: number;
  experience: number;
}

interface MascotState {
  emotion: 'happy' | 'sad' | 'sleepy' | 'hungry' | 'dirty' | 'sick' | 'excited';
  animation: 'idle' | 'eating' | 'playing' | 'sleeping' | 'dancing';
  lastInteraction: Date;
}

const MascoteNovo = () => {
  const [coins, setCoins] = useState(459);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentMascot, setCurrentMascot] = useState('cat');
  const [showMascotSelector, setShowMascotSelector] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showFoodShop, setShowFoodShop] = useState(false);
  const [showGameMenu, setShowGameMenu] = useState(false);
  const [showRacingGame, setShowRacingGame] = useState(false);
  const [showShootingGame, setShowShootingGame] = useState(false);
  const [showNameEditor, setShowNameEditor] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [customMascotNames, setCustomMascotNames] = useState<{[key: string]: string}>({});
  const [ownedAccessories, setOwnedAccessories] = useState<string[]>([]);

  const [mascotStats, setMascotStats] = useState<MascotStats>({
    hunger: 60,
    energy: 75,
    health: 95,
    level: 12,
    experience: 2340
  });

  const [mascotState, setMascotState] = useState<MascotState>({
    emotion: 'happy',
    animation: 'idle',
    lastInteraction: new Date()
  });

  const animalMascots: AnimalMascot[] = [
    {
      id: 'cat',
      name: 'Miau',
      emoji: '🐱',
      type: 'cat',
      unlocked: true,
      description: 'Gato esperto e curioso'
    },
    {
      id: 'dog',
      name: 'Rex',
      emoji: '🐶',
      type: 'dog',
      unlocked: true,
      description: 'Cachorro leal e brincalhão'
    },
    {
      id: 'rabbit',
      name: 'Coelho',
      emoji: '🐰',
      type: 'rabbit',
      unlocked: false,
      cost: 100,
      description: 'Coelho rápido e fofo'
    },
    {
      id: 'bird',
      name: 'Piu',
      emoji: '🐦',
      type: 'bird',
      unlocked: false,
      cost: 150,
      description: 'Pássaro colorido e musical'
    },
    {
      id: 'hamster',
      name: 'Hammy',
      emoji: '🐹',
      type: 'hamster',
      unlocked: false,
      cost: 80,
      description: 'Hamster ativo e pequeno'
    },
    {
      id: 'fish',
      name: 'Nemo',
      emoji: '🐠',
      type: 'fish',
      unlocked: false,
      cost: 120,
      description: 'Peixe tranquilo e zen'
    }
  ];

  // Determinar emoção baseada nos stats
  useEffect(() => {
    let newEmotion: MascotState['emotion'] = 'happy';
    
    if (mascotStats.health < 30) newEmotion = 'sick';
    else if (mascotStats.hunger < 20) newEmotion = 'hungry';
    else if (mascotStats.energy < 20) newEmotion = 'sleepy';
    else if (mascotStats.energy > 80) newEmotion = 'excited';

    setMascotState(prev => ({ ...prev, emotion: newEmotion }));
  }, [mascotStats]);

  // Animação automática
  useEffect(() => {
    const interval = setInterval(() => {
      const animations: MascotState['animation'][] = ['idle', 'dancing'];
      const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
      setMascotState(prev => ({ ...prev, animation: randomAnimation }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Load mascot from localStorage on component mount
  useEffect(() => {
    const savedMascot = localStorage.getItem('selectedMascot');
    const savedUnlockedMascots = localStorage.getItem('unlockedMascots');
    const savedCustomNames = localStorage.getItem('customMascotNames');
    
    if (savedMascot) {
      setCurrentMascot(savedMascot);
    }
    
    if (savedUnlockedMascots) {
      const unlockedIds = JSON.parse(savedUnlockedMascots);
      // Atualizar o estado dos mascotes desbloqueados
      unlockedIds.forEach((id: string) => {
        const mascot = animalMascots.find(m => m.id === id);
        if (mascot) {
          mascot.unlocked = true;
        }
      });
    }

    if (savedCustomNames) {
      setCustomMascotNames(JSON.parse(savedCustomNames));
    }
  }, []);

  // Save mascot to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedMascot', currentMascot);
  }, [currentMascot]);

  const getCurrentMascot = () => {
    return animalMascots.find(m => m.id === currentMascot) || animalMascots[0];
  };

  const getMascotDisplay = () => {
    const mascot = getCurrentMascot();
    const baseSize = 'text-9xl';
    
    // Adicionar efeitos baseados na emoção
    let emotionEffect = '';
    switch (mascotState.emotion) {
      case 'happy':
      case 'excited':
        emotionEffect = 'animate-bounce';
        break;
      case 'sleepy':
        emotionEffect = 'opacity-70';
        break;
      case 'sad':
        emotionEffect = 'grayscale';
        break;
    }

    return (
      <div className={`${baseSize} ${emotionEffect} transition-all duration-500`}>
        {mascot.emoji}
      </div>
    );
  };

  const getEmotionEmoji = () => {
    switch (mascotState.emotion) {
      case 'happy': return '😊';
      case 'excited': return '🤩';
      case 'sad': return '😢';
      case 'sleepy': return '😴';
      case 'hungry': return '🤤';
      case 'dirty': return '🤢';
      case 'sick': return '🤒';
      default: return '😊';
    }
  };

  const feedMascot = () => {
    if (coins >= 10) {
      setCoins(coins - 10);
      setMascotStats(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 30),
        experience: prev.experience + 5
      }));
      setMascotState(prev => ({ 
        ...prev, 
        animation: 'eating',
        lastInteraction: new Date()
      }));
      
      if (soundEnabled) {
        console.log('🔊 Som de comer');
      }

      setTimeout(() => {
        setMascotState(prev => ({ ...prev, animation: 'idle' }));
      }, 2000);
    }
  };

  const petMascot = () => {
    setMascotStats(prev => ({
      ...prev,
      experience: prev.experience + 3
    }));
    setMascotState(prev => ({ 
      ...prev, 
      animation: 'dancing',
      lastInteraction: new Date()
    }));
    
    if (soundEnabled) {
      console.log('🔊 Som de carinho');
    }

    setTimeout(() => {
      setMascotState(prev => ({ ...prev, animation: 'idle' }));
    }, 2000);
  };

  const playWithMascot = () => {
    if (mascotStats.energy >= 20) {
      setMascotStats(prev => ({
        ...prev,
        energy: prev.energy - 20,
        experience: prev.experience + 10
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
    }
  };

  const cleanMascot = () => {
    if (coins >= 5) {
      setCoins(coins - 5);
      setMascotStats(prev => ({
        ...prev,
        health: Math.min(100, prev.health + 5)
      }));
      setMascotState(prev => ({ 
        ...prev,
        lastInteraction: new Date()
      }));
      
      if (soundEnabled) {
        console.log('🔊 Som de limpeza');
      }
    }
  };

  const putToSleep = () => {
    setMascotStats(prev => ({
      ...prev,
      energy: 100,
      health: Math.min(100, prev.health + 10)
    }));
    setMascotState(prev => ({ 
      ...prev, 
      animation: 'sleeping',
      lastInteraction: new Date()
    }));
    
    if (soundEnabled) {
      console.log('🔊 Som de dormir');
    }

    setTimeout(() => {
      setMascotState(prev => ({ ...prev, animation: 'idle' }));
    }, 5000);
  };

  const changeMascot = (mascotId: string) => {
    const mascot = animalMascots.find(m => m.id === mascotId);
    if (mascot?.unlocked || (mascot && coins >= (mascot.cost || 0))) {
      if (!mascot.unlocked && mascot.cost) {
        setCoins(coins - mascot.cost);
        mascot.unlocked = true;
        
        // Salvar mascotes desbloqueados no localStorage
        const unlockedMascots = animalMascots.filter(m => m.unlocked).map(m => m.id);
        localStorage.setItem('unlockedMascots', JSON.stringify(unlockedMascots));
      }
      setCurrentMascot(mascotId);
      setShowMascotSelector(false);
      
      if (soundEnabled) {
        console.log('🔊 Som de troca de mascote');
      }
    }
  };

  const handleGameEnd = (score: number, coinsEarned: number) => {
    setCoins(coins + coinsEarned);
    setMascotStats(prev => ({
      ...prev,
      experience: prev.experience + score
    }));
    setShowRacingGame(false);
    setShowShootingGame(false);
    
    if (soundEnabled) {
      console.log('🔊 Som de vitória');
    }
  };

  const getMascotName = () => {
    const mascot = getCurrentMascot();
    return customMascotNames[mascot.id] || mascot.name;
  };

  const openNameEditor = () => {
    const currentName = getMascotName();
    setEditingName(currentName);
    setShowNameEditor(true);
  };

  const saveMascotName = () => {
    if (editingName.trim()) {
      const newCustomNames = {
        ...customMascotNames,
        [currentMascot]: editingName.trim()
      };
      setCustomMascotNames(newCustomNames);
      localStorage.setItem('customMascotNames', JSON.stringify(newCustomNames));
      setShowNameEditor(false);
      
      if (soundEnabled) {
        console.log('🔊 Som de confirmação');
      }
    }
  };

  const cancelNameEdit = () => {
    setShowNameEditor(false);
    setEditingName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-engenha-light-blue to-engenha-sky-blue">
      {/* Header com moedas e controles */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-engenha-gold rounded-full px-3 py-1 flex items-center">
            <span className="text-engenha-dark-navy font-bold">🪙 {coins}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-white bg-opacity-20 rounded-full p-2"
          >
            {soundEnabled ? <Volume2 className="text-white" size={20} /> : <VolumeX className="text-white" size={20} />}
          </button>
        </div>
      </div>

      {/* Área principal do mascote */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Nome e nível do mascote */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-engenha-dark-navy">
              {getMascotName()}
            </h2>
            <button
              onClick={openNameEditor}
              className="p-1 rounded-full bg-engenha-orange bg-opacity-20 hover:bg-opacity-40 text-engenha-orange transition-all duration-200"
              title="Editar nome"
            >
              <Edit2 size={16} />
            </button>
          </div>
          <p className="text-engenha-dark-navy opacity-70">
            Nível {mascotStats.level} • {mascotStats.experience} XP
          </p>
        </div>

        {/* Mascote principal */}
        <div className="relative mb-8">
          <div className="bg-white bg-opacity-30 rounded-3xl p-8 backdrop-blur-sm">
            <div className="relative inline-block">
              {/* Container do mascote com acessórios */}
              <div className="relative">
                {getMascotDisplay()}
                
                {/* Acessórios do mascote - sistema completamente refatorado */}
                {ownedAccessories.map((accessory, index) => {
                  const accessoryEmoji = accessory.split(' ')[0];
                  
                  // Sistema de proporção baseado no mascote (text-9xl)
                  // Mascote é text-9xl (144px), então os acessórios devem ser proporcionais
                  let accessoryConfig = {
                    position: '',
                    size: '',
                    animation: '',
                    transform: '',
                    zIndex: 'z-20'
                  };
                  
                  if (accessory.includes('Cartola')) {
                    // Cartola: 70% do tamanho do mascote, bem no topo
                    accessoryConfig = {
                      position: 'absolute -top-20 left-1/2',
                      transform: '-translate-x-1/2',
                      size: 'text-7xl', // 70% do mascote (text-9xl)
                      animation: mascotState.animation === 'dancing' ? 'animate-bounce' : 
                                mascotState.animation === 'idle' ? 'animate-pulse' : '',
                      zIndex: 'z-20'
                    };
                  } else if (accessory.includes('Coroa')) {
                    // Coroa: 60% do tamanho, como tiara
                    accessoryConfig = {
                      position: 'absolute -top-16 left-1/2',
                      transform: '-translate-x-1/2',
                      size: 'text-6xl', // 60% do mascote
                      animation: mascotState.animation === 'dancing' ? 'animate-pulse' : 
                                mascotState.animation === 'idle' ? 'animate-bounce' : '',
                      zIndex: 'z-20'
                    };
                  } else if (accessory.includes('Óculos')) {
                    // Óculos: 50% do tamanho, na região dos olhos
                    accessoryConfig = {
                      position: 'absolute top-8 left-1/2',
                      transform: '-translate-x-1/2',
                      size: 'text-5xl', // 50% do mascote, proporcional aos olhos
                      animation: mascotState.animation === 'dancing' ? 'animate-pulse' : 
                                mascotState.animation === 'idle' ? 'animate-bounce' : '',
                      zIndex: 'z-20'
                    };
                  } else if (accessory.includes('Laço')) {
                    // Laço: 40% do tamanho, na orelha
                    accessoryConfig = {
                      position: 'absolute top-2 -right-4',
                      transform: '',
                      size: 'text-4xl', // 40% do mascote
                      animation: mascotState.animation === 'dancing' ? 'animate-spin' : 
                                mascotState.animation === 'idle' ? 'animate-pulse' : '',
                      zIndex: 'z-20'
                    };
                  } else if (accessory.includes('Estrela')) {
                    // Estrela: 45% do tamanho, flutuando
                    accessoryConfig = {
                      position: 'absolute -top-8 -right-8',
                      transform: '',
                      size: 'text-4xl', // 45% do mascote
                      animation: 'animate-pulse', // Sempre brilhando
                      zIndex: 'z-20'
                    };
                  } else if (accessory.includes('Chifre')) {
                    // Chifre: 55% do tamanho, centro do topo
                    accessoryConfig = {
                      position: 'absolute -top-24 left-1/2',
                      transform: '-translate-x-1/2',
                      size: 'text-5xl', // 55% do mascote
                      animation: mascotState.animation === 'dancing' ? 'animate-bounce' : 
                                mascotState.animation === 'idle' ? 'animate-pulse' : '',
                      zIndex: 'z-20'
                    };
                  } else if (accessory.includes('Aura')) {
                    // Aura: 120% do tamanho, envolvendo
                    accessoryConfig = {
                      position: 'absolute -inset-8 flex items-center justify-center',
                      transform: '',
                      size: 'text-9xl opacity-30', // Maior que o mascote, mas transparente
                      animation: 'animate-pulse', // Efeito mágico constante
                      zIndex: 'z-10' // Atrás do mascote
                    };
                  } else if (accessory.includes('Máscara')) {
                    // Máscara: 60% do tamanho, centro do rosto
                    accessoryConfig = {
                      position: 'absolute top-6 left-1/2',
                      transform: '-translate-x-1/2',
                      size: 'text-6xl', // 60% do mascote
                      animation: mascotState.animation === 'dancing' ? 'animate-pulse' : 
                                mascotState.animation === 'idle' ? 'animate-bounce' : '',
                      zIndex: 'z-20'
                    };
                  }
                  
                  return (
                    <div 
                      key={index} 
                      className={`${accessoryConfig.position} ${accessoryConfig.size} ${accessoryConfig.animation} ${accessoryConfig.zIndex} pointer-events-none transition-all duration-500 ease-in-out`}
                      style={{
                        transform: accessoryConfig.transform,
                        filter: accessory.includes('Aura') ? 'drop-shadow(0 0 20px gold)' : 'none',
                        textShadow: accessory.includes('Aura') ? '0 0 30px gold, 0 0 40px gold' : 'none'
                      }}
                    >
                      {accessoryEmoji}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Emoção atual */}
          <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
            <span className="text-2xl">{getEmotionEmoji()}</span>
          </div>
        </div>

        {/* Barras de status */}
        <div className="w-full max-w-sm space-y-2 mb-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-engenha-dark-navy">❤️ Saúde</span>
            <span className="text-sm text-engenha-dark-navy">{mascotStats.health}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div 
              className="bg-engenha-dark-orange h-2 rounded-full transition-all duration-300"
              style={{ width: `${mascotStats.health}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-engenha-dark-navy">🍽️ Fome</span>
            <span className="text-sm text-engenha-dark-navy">{mascotStats.hunger}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div 
              className="bg-[#ff7a28] h-2 rounded-full transition-all duration-300"
              style={{ width: `${mascotStats.hunger}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-engenha-dark-navy">⚡ Energia</span>
            <span className="text-sm text-engenha-dark-navy">{mascotStats.energy}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div 
              className="bg-engenha-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${mascotStats.energy}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Botões de ação - estilo My Talking Tom */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => setShowMascotSelector(true)}
            className="bg-engenha-sky-blue bg-opacity-90 rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
            title="Trocar Mascote"
          >
            <Sparkles className="text-white" size={24} />
          </button>
          
          <button
            onClick={() => setShowShop(true)}
            className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
          >
            <ShoppingCart className="text-engenha-dark-navy" size={24} />
          </button>
          
          <button
            onClick={() => setShowFoodShop(true)}
            className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
          >
            <Utensils className="text-engenha-dark-navy" size={24} />
          </button>
          
          <button
            onClick={() => setShowGameMenu(true)}
            className="bg-engenha-orange rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
          >
            <Gamepad2 className="text-white" size={24} />
          </button>
          
          <button
            onClick={playWithMascot}
            className="bg-engenha-orange rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
          >
            <Heart className="text-white" size={24} />
          </button>
        </div>
      </div>

      {/* Modal de seleção de mascote */}
      {showMascotSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-engenha-dark-navy">
                🎭 Escolher Mascote
              </h3>
              <button
                onClick={() => setShowMascotSelector(false)}
                className="text-engenha-dark-navy hover:text-engenha-orange text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-[#f0f6ff] rounded-lg">
              <p className="text-sm text-[#030025]">
                💡 Seu mascote escolhido será salvo automaticamente e permanecerá o mesmo em todos os dispositivos!
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {animalMascots.map((mascot) => (
                <button
                  key={mascot.id}
                  onClick={() => changeMascot(mascot.id)}
                  disabled={!mascot.unlocked && coins < (mascot.cost || 0)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    currentMascot === mascot.id
                      ? 'border-engenha-orange bg-engenha-orange text-white shadow-lg transform scale-105'
                      : mascot.unlocked || coins >= (mascot.cost || 0)
                      ? 'border-engenha-sky-blue bg-engenha-light-blue hover:bg-engenha-sky-blue hover:text-white hover:scale-105'
                      : 'border-engenha-light-blue bg-engenha-light-blue text-engenha-dark-navy cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="text-4xl mb-2">{mascot.emoji}</div>
                  <div className="text-sm font-medium">{mascot.name}</div>
                  <div className="text-xs opacity-70 mt-1">{mascot.description}</div>
                  {currentMascot === mascot.id && (
                    <div className="text-xs text-white mt-2 font-bold">✓ Selecionado</div>
                  )}
                  {!mascot.unlocked && currentMascot !== mascot.id && (
                    <div className="text-xs text-engenha-gold mt-2 font-bold">🪙 {mascot.cost}</div>
                  )}
                  {mascot.unlocked && currentMascot !== mascot.id && (
                    <div className="text-xs text-[#28b0ff] mt-2 font-bold">✓ Desbloqueado</div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMascotSelector(false)}
              className="w-full bg-engenha-light-blue text-engenha-dark-navy py-3 px-4 rounded-lg font-medium hover:bg-engenha-sky-blue hover:text-white transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de jogos */}
      {showGameMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-engenha-dark-navy mb-4 text-center">
              Jogos Interativos
            </h3>
            <div className="space-y-3 mb-4">
              <button 
                onClick={() => {
                  setShowGameMenu(false);
                  setShowRacingGame(true);
                }}
                className="w-full p-4 bg-engenha-light-blue rounded-lg border border-engenha-sky-blue hover:bg-engenha-sky-blue hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🏎️</span>
                  <div className="text-left">
                    <div className="font-medium">Corrida Educativa</div>
                    <div className="text-xs opacity-70">Responda perguntas para acelerar!</div>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  setShowGameMenu(false);
                  setShowShootingGame(true);
                }}
                className="w-full p-4 bg-engenha-light-blue rounded-lg border border-engenha-sky-blue hover:bg-engenha-sky-blue hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  <div className="text-left">
                    <div className="font-medium">Tiro ao Alvo</div>
                    <div className="text-xs opacity-70">Acerte perguntas para munição especial!</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-4 bg-engenha-light-blue rounded-lg border border-engenha-sky-blue hover:bg-engenha-sky-blue hover:text-white transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🧩</span>
                  <div className="text-left">
                    <div className="font-medium">Puzzle Inteligente</div>
                    <div className="text-xs opacity-70">Resolva questões para desbloquear peças!</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full p-4 bg-engenha-light-blue rounded-lg border border-engenha-sky-blue hover:bg-engenha-sky-blue hover:text-white transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🏃‍♂️</span>
                  <div className="text-left">
                    <div className="font-medium">Corrida de Obstáculos</div>
                    <div className="text-xs opacity-70">Supere desafios com conhecimento!</div>
                  </div>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowGameMenu(false)}
              className="w-full bg-engenha-light-blue text-engenha-dark-navy py-2 px-4 rounded-lg font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Jogos */}
      {showRacingGame && (
        <div className="fixed inset-0 z-[150]">
          <RacingGame
            key="racing-game" /* Usa uma chave fixa para evitar remontagem desnecessária */
            onGameEnd={handleGameEnd}
            onClose={() => {
              console.log('🎮 Fechando jogo de corrida');
              setShowRacingGame(false);
            }}
          />
        </div>
      )}

      {showShootingGame && (
        <ShootingGame
          onGameEnd={handleGameEnd}
          onClose={() => setShowShootingGame(false)}
        />
      )}

      {/* Loja de Comida */}
      {showFoodShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-engenha-dark-navy">
                🍽️ Loja de Comida
              </h3>
              <button
                onClick={() => setShowFoodShop(false)}
                className="text-engenha-dark-navy hover:text-engenha-orange"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: '🍎 Maçã', price: 5, effect: 'Fome -10%' },
                { name: '🍌 Banana', price: 8, effect: 'Energia +15%' },
                { name: '🥕 Cenoura', price: 6, effect: 'Saúde +10%' },
                { name: '🍖 Carne', price: 15, effect: 'Fome -25%' },
                { name: '🐟 Peixe', price: 12, effect: 'Saúde +20%' },
                { name: '🥛 Leite', price: 10, effect: 'Saúde +15%' },
                { name: '🍯 Mel', price: 20, effect: 'Energia +30%' },
                { name: '🧀 Queijo', price: 18, effect: 'Energia +25%' }
              ].map((food, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-engenha-sky-blue">
                  <div className="text-center">
                    <div className="text-2xl mb-1">{food.name.split(' ')[0]}</div>
                    <div className="text-sm font-semibold text-engenha-dark-navy mb-1">
                      {food.name.split(' ').slice(1).join(' ')}
                    </div>
                    <div className="text-xs text-engenha-dark-navy opacity-70 mb-2">
                      {food.effect}
                    </div>
                    <button
                      onClick={() => {
                        if (coins >= food.price) {
                          setCoins(coins - food.price);
                          setMascotStats(prev => {
                            const newStats = { ...prev };
                            if (food.effect.includes('Fome')) {
                              newStats.hunger = Math.max(0, prev.hunger - parseInt(food.effect.match(/-(\d+)%/)?.[1] || '0'));
                            }
                            if (food.effect.includes('Energia')) {
                              newStats.energy = Math.min(100, prev.energy + parseInt(food.effect.match(/\+(\d+)%/)?.[1] || '0'));
                            }
                            if (food.effect.includes('Saúde')) {
                              newStats.health = Math.min(100, prev.health + parseInt(food.effect.match(/\+(\d+)%/)?.[1] || '0'));
                            }
                            return newStats;
                          });
                          if (soundEnabled) {
                            console.log('🔊 Som de alimentação');
                          }
                        }
                      }}
                      disabled={coins < food.price}
                      className={`w-full py-1 px-2 rounded text-xs font-bold ${
                        coins >= food.price
                          ? 'bg-engenha-orange text-white hover:bg-engenha-dark-orange'
                          : 'bg-[#f0f6ff] text-[#030025] cursor-not-allowed'
                      }`}
                    >
                      🪙 {food.price}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loja de Acessórios */}
      {showShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-engenha-dark-navy">
                🛍️ Loja de Acessórios
              </h3>
              <button
                onClick={() => setShowShop(false)}
                className="text-engenha-dark-navy hover:text-engenha-orange"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Acessórios com moedas */}
              <div className="bg-engenha-gold bg-opacity-20 rounded-lg p-3">
                <h4 className="font-bold text-engenha-dark-navy mb-2">💰 Compre com Moedas</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: '🎩 Cartola', price: 50, type: 'coins' },
                    { name: '👓 Óculos', price: 30, type: 'coins' },
                    { name: '🎀 Laço', price: 25, type: 'coins' },
                    { name: '⭐ Estrela', price: 40, type: 'coins' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-2 text-center">
                      <div className="text-lg mb-1">{item.name.split(' ')[0]}</div>
                      <div className="text-xs font-semibold text-engenha-dark-navy mb-1">
                        {item.name.split(' ').slice(1).join(' ')}
                      </div>
                      <button
                        onClick={() => {
                          if (coins >= item.price) {
                            setCoins(coins - item.price);
                            setOwnedAccessories(prev => [...prev, item.name]);
                            if (soundEnabled) {
                              console.log('🔊 Som de compra');
                            }
                          }
                        }}
                        disabled={coins < item.price || ownedAccessories.includes(item.name)}
                        className={`w-full py-1 px-2 rounded text-xs font-bold ${
                          ownedAccessories.includes(item.name)
                            ? 'bg-engenha-sky-blue text-white cursor-not-allowed'
                            : coins >= item.price
                            ? 'bg-engenha-gold text-engenha-dark-navy hover:bg-engenha-gold hover:opacity-80'
                            : 'bg-engenha-light-blue text-engenha-dark-navy cursor-not-allowed'
                        }`}
                      >
                        {ownedAccessories.includes(item.name) ? '✓ Comprado' : `🪙 ${item.price}`}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acessórios premium */}
              <div className="bg-engenha-light-blue bg-opacity-20 rounded-lg p-3">
                <h4 className="font-bold text-engenha-dark-navy mb-2">💎 Acessórios Premium</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: '👑 Coroa Real', price: 'R$ 4,99', type: 'money' },
                    { name: '🦄 Chifre Unicórnio', price: 'R$ 2,99', type: 'money' },
                    { name: '🌟 Aura Dourada', price: 'R$ 6,99', type: 'money' },
                    { name: '🎭 Máscara Misteriosa', price: 'R$ 3,99', type: 'money' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-2 text-center border-2 border-engenha-sky-blue">
                      <div className="text-lg mb-1">{item.name.split(' ')[0]}</div>
                      <div className="text-xs font-semibold text-engenha-dark-navy mb-1">
                        {item.name.split(' ').slice(1).join(' ')}
                      </div>
                      <button
                        onClick={() => {
                          // Aqui seria integrado com sistema de pagamento real
                          alert(`Redirecionando para pagamento de ${item.price}`);
                        }}
                        className="w-full py-1 px-2 rounded text-xs font-bold bg-engenha-orange text-white hover:bg-engenha-dark-orange"
                      >
                        💎 {item.price}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor de Nome do Mascote */}
      {showNameEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-engenha-dark-navy">
                ✏️ Editar Nome do Mascote
              </h3>
              <button
                onClick={() => setShowNameEditor(false)}
                className="text-engenha-dark-navy hover:text-engenha-orange"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-engenha-dark-navy mb-1">
                Nome Atual:
              </label>
              <div className="bg-white rounded-lg p-2 text-center text-2xl font-bold text-engenha-dark-navy">
                {getMascotName()}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-engenha-dark-navy mb-1">
                Novo Nome:
              </label>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="w-full bg-white rounded-lg p-2 text-center text-2xl font-bold text-engenha-dark-navy border border-engenha-sky-blue focus:ring-2 focus:ring-engenha-orange focus:outline-none"
                placeholder="Digite o novo nome"
              />
            </div>
            
            <div className="flex justify-between gap-2">
              <button
                onClick={saveMascotName}
                className="w-full bg-engenha-orange text-white rounded-lg py-2 font-medium hover:bg-engenha-dark-orange transition-colors"
              >
                Salvar Nome
              </button>
              <button
                onClick={cancelNameEdit}
                className="w-full bg-engenha-light-blue text-engenha-dark-navy rounded-lg py-2 font-medium hover:bg-engenha-sky-blue hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
};

export default MascoteNovo;

