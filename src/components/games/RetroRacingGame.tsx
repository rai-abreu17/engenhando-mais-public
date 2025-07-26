import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Trophy, Settings, Play } from 'lucide-react';

// Types
interface Car {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  name: string;
  style: 'aggressive' | 'balanced' | 'defensive' | 'speedy';
}

interface Track {
  id: number;
  name: string;
  unlocked: boolean;
  difficulty: number;
  bestTime?: number;
}

interface GameState {
  state: 'menu' | 'carSelect' | 'racing' | 'results' | 'settings';
  currentTrack: number;
  difficulty: 'easy' | 'medium' | 'hardcore';
  lap: number;
  position: number;
  speed: number;
  credits: number;
  lapTimes: number[];
  totalTime: number;
}

const TRACKS: Track[] = [
  { id: 0, name: 'Coastal Grand', unlocked: true, difficulty: 1 },
  { id: 1, name: 'Mountain Pass', unlocked: false, difficulty: 2 },
  { id: 2, name: 'City Speedway', unlocked: false, difficulty: 3 }
];

const CAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA726', '#9C27B0', '#66BB6A'];

const OPPONENT_CARS: Omit<Car, 'x' | 'y'>[] = [
  { id: 1, speed: 0.8, color: '#DC2626', name: 'Lightning', style: 'aggressive' },
  { id: 2, speed: 0.75, color: '#2563EB', name: 'Steady', style: 'balanced' },
  { id: 3, speed: 0.7, color: '#16A34A', name: 'Guardian', style: 'defensive' },
  { id: 4, speed: 0.85, color: '#F59E0B', name: 'Bullet', style: 'speedy' }
];

const RetroRacingGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [gameState, setGameState] = useState<GameState>({
    state: 'menu',
    currentTrack: 0,
    difficulty: 'medium',
    lap: 1,
    position: 1,
    speed: 0,
    credits: 3,
    lapTimes: [],
    totalTime: 0
  });

  const [selectedCarColor, setSelectedCarColor] = useState(CAR_COLORS[0]);
  const [tracks, setTracks] = useState(TRACKS);
  const [playerCar, setPlayerCar] = useState<Car>({
    id: 0,
    x: 50,
    y: 20,
    speed: 0,
    color: selectedCarColor,
    name: 'Player',
    style: 'balanced'
  });

  const [opponentCars, setOpponentCars] = useState<Car[]>([]);
  const [roadOffset, setRoadOffset] = useState(0);
  const [keys, setKeys] = useState<Set<string>>(new Set());

  const gameLoopRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState.state !== 'racing') return;

    // Player controls
    setPlayerCar(prev => {
      let newSpeed = prev.speed;
      let newX = prev.x;

      // Acceleration/Braking
      if (keys.has('arrowup') || keys.has('w')) {
        newSpeed = Math.min(newSpeed + 0.5, 10);
      } else if (keys.has('arrowdown') || keys.has('s')) {
        newSpeed = Math.max(newSpeed - 0.8, 0);
      } else {
        newSpeed = Math.max(newSpeed - 0.3, 0); // Arcade-style quick deceleration
      }

      // Steering
      if (keys.has('arrowleft') || keys.has('a')) {
        newX = Math.max(newX - 2, 10);
      }

      if (keys.has('arrowright') || keys.has('d')) {
        newX = Math.min(newX + 2, 90);
      }

      return { ...prev, speed: newSpeed, x: newX };
    });

    // Update road animation
    setRoadOffset(prev => (prev + playerCar.speed) % 100);

    // Update game state
    setGameState(prev => ({
      ...prev,
      speed: playerCar.speed,
      totalTime: Date.now() - startTimeRef.current
    }));

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.state, keys, playerCar.speed]);

  useEffect(() => {
    if (gameState.state === 'racing') {
      startTimeRef.current = Date.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.state, gameLoop]);

  const startRace = () => {
    if (gameState.credits <= 0) return;

    setGameState(prev => ({
      ...prev,
      state: 'racing',
      lap: 1,
      position: Math.floor(Math.random() * 5) + 1,
      lapTimes: [],
      totalTime: 0,
      credits: prev.credits - 1
    }));

    // Initialize opponent cars
    const opponents = OPPONENT_CARS.map((car, index) => ({
      ...car,
      x: 20 + (index * 15),
      y: 30 + (index * 10)
    }));
    setOpponentCars(opponents);
  };

  const selectTrack = (trackId: number) => {
    if (!tracks[trackId].unlocked) return;
    setGameState(prev => ({ ...prev, currentTrack: trackId }));
  };

  const finishRace = () => {
    const lapTime = Date.now() - startTimeRef.current;
    const newLapTimes = [...gameState.lapTimes, lapTime];

    if (gameState.lap >= 3) {
      // Race finished
      setGameState(prev => ({
        ...prev,
        state: 'results',
        lapTimes: newLapTimes
      }));
    } else {
      // Next lap
      setGameState(prev => ({
        ...prev,
        lap: prev.lap + 1,
        lapTimes: newLapTimes
      }));
      startTimeRef.current = Date.now();
    }
  };

  // Menu Component
  const MenuScreen = () => (
    <div className="h-full bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Retro background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse"></div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors"
      >
        <X size={20} />
      </button>

      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 font-mono">
          RETRO RACER
        </h1>
        <p className="text-xl text-cyan-300 font-mono">POLE POSITION STYLE</p>
      </div>

      <div className="space-y-4 text-center">
        <button
          onClick={() => setGameState(prev => ({ ...prev, state: 'carSelect' }))}
          className="w-64 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-bold text-lg transition-all transform hover:scale-105 border-2 border-cyan-400"
          disabled={gameState.credits <= 0}
        >
          <Play className="inline mr-2" size={20} />
          INICIAR CORRIDA
        </button>

        <button
          onClick={() => setGameState(prev => ({ ...prev, state: 'settings' }))}
          className="w-64 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-bold text-lg transition-all transform hover:scale-105 border-2 border-purple-400"
        >
          <Settings className="inline mr-2" size={20} />
          CONFIGURAÇÕES
        </button>

        <div className="mt-6 p-4 bg-black bg-opacity-50 rounded-lg border border-cyan-500">
          <p className="text-cyan-300 font-mono">CRÉDITOS: {gameState.credits}</p>
          <p className="text-sm text-gray-400 font-mono">Use WASD ou setas para dirigir</p>
        </div>
      </div>

      {/* Retro decorations */}
      <div className="absolute bottom-8 left-8 text-xs text-gray-500 font-mono">
        2024 NAMCO STYLE
      </div>
    </div>
  );

  // Car Selection Component
  const CarSelectScreen = () => (
    <div className="h-full bg-gradient-to-b from-blue-900 to-purple-900 text-white flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-8 font-mono text-cyan-400">SELECIONE SEU CARRO</h2>

      <div className="mb-8">
        <div
          className="w-32 h-20 rounded-lg border-4 border-white shadow-lg transform hover:scale-110 transition-transform"
          style={{ backgroundColor: selectedCarColor }}
        ></div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {CAR_COLORS.map((color, index) => (
          <button
            key={index}
            onClick={() => setSelectedCarColor(color)}
            className={`w-16 h-10 rounded border-2 transition-all ${
              selectedCarColor === color ? 'border-yellow-400 scale-110' : 'border-gray-400'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-center font-mono">SELECIONAR PISTA</h3>
        <div className="space-y-2">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => selectTrack(track.id)}
              disabled={!track.unlocked}
              className={`w-64 py-3 rounded-lg font-bold transition-all ${
                track.unlocked
                  ? gameState.currentTrack === track.id
                    ? 'bg-yellow-600 border-2 border-yellow-400'
                    : 'bg-blue-600 hover:bg-blue-500 border-2 border-blue-400'
                  : 'bg-gray-600 border-2 border-gray-500 opacity-50 cursor-not-allowed'
              }`}
            >
              {track.name} {!track.unlocked && '🔒'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setGameState(prev => ({ ...prev, state: 'menu' }))}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-bold"
        >
          VOLTAR
        </button>
        <button
          onClick={startRace}
          className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold"
          disabled={gameState.credits <= 0}
        >
          COMEÇAR CORRIDA
        </button>
      </div>
    </div>
  );

  // Racing Screen Component
  const RacingScreen = () => (
    <div className="h-full bg-gradient-to-b from-orange-400 via-red-500 to-purple-600 relative overflow-hidden">
      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gray-800 transform perspective-1000 rotateX(10deg)">
        {/* Road markings */}
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 20px,
              yellow 20px,
              yellow 24px
            )`,
            transform: `translateY(${roadOffset}px)`
          }}
        />

        {/* Side barriers */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-red-600 opacity-80"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-red-600 opacity-80"></div>
      </div>

      {/* Player car */}
      <div
        className="absolute bottom-20 transition-all duration-100 z-20"
        style={{
          left: `${playerCar.x}%`,
          transform: 'translateX(-50%)'
        }}
      >
        <div
          className="w-12 h-20 rounded-lg border-2 border-white shadow-lg"
          style={{ backgroundColor: selectedCarColor }}
        />
      </div>

      {/* Opponent cars */}
      {opponentCars.map(car => (
        <div
          key={car.id}
          className="absolute transition-all duration-200 z-10"
          style={{
            left: `${car.x}%`,
            bottom: `${car.y}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <div
            className="w-10 h-16 rounded border border-white"
            style={{ backgroundColor: car.color }}
          />
        </div>
      ))}

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start text-white z-30">
        <div className="bg-black bg-opacity-70 p-3 rounded-lg font-mono">
          <div>VELOCIDADE: {Math.floor(gameState.speed * 20)} KM/H</div>
          <div>POSIÇÃO: {gameState.position}° / 5</div>
          <div>VOLTA: {gameState.lap} / 3</div>
        </div>

        <div className="bg-black bg-opacity-70 p-3 rounded-lg font-mono text-right">
          <div>TEMPO: {(gameState.totalTime / 1000).toFixed(1)}s</div>
          <div>PISTA: {tracks[gameState.currentTrack].name}</div>
        </div>
      </div>

      {/* Mini-map */}
      <div className="absolute top-4 right-4 w-24 h-24 bg-black bg-opacity-70 rounded-lg border border-cyan-400 z-30">
        <div className="text-xs text-cyan-400 text-center font-mono">MAPA</div>
        <div className="relative h-full">
          <div className="absolute bottom-2 left-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2"></div>
        </div>
      </div>

      {/* Lap completion trigger */}
      {Math.floor(gameState.totalTime / 10000) !== gameState.lap - 1 && (
        <button
          onClick={finishRace}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-bold text-white z-30"
        >
          COMPLETAR VOLTA
        </button>
      )}
    </div>
  );

  // Results Screen Component
  const ResultsScreen = () => (
    <div className="h-full bg-gradient-to-b from-yellow-400 to-orange-600 flex items-center justify-center text-black">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
        <Trophy className="mx-auto text-yellow-600 mb-4" size={64} />
        <h2 className="text-3xl font-bold mb-4">CORRIDA FINALIZADA!</h2>

        <div className="space-y-2 mb-6">
          <p>Posição Final: {gameState.position}° lugar</p>
          <p>Melhor Volta: {Math.min(...gameState.lapTimes) / 1000}s</p>
          <p>Tempo Total: {gameState.totalTime / 1000}s</p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setGameState(prev => ({ ...prev, state: 'menu' }))}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            MENU PRINCIPAL
          </button>
          <button
            onClick={() => setGameState(prev => ({ ...prev, state: 'carSelect' }))}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={gameState.credits <= 0}
          >
            NOVA CORRIDA
          </button>
        </div>
      </div>
    </div>
  );

  // Settings Screen Component
  const SettingsScreen = () => (
    <div className="h-full bg-gradient-to-b from-gray-800 to-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl border border-cyan-500">
        <h2 className="text-2xl font-bold mb-6 text-cyan-400 font-mono">CONFIGURAÇÕES</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block mb-2 font-mono">DIFICULDADE:</label>
            <select
              value={gameState.difficulty}
              onChange={(e) => setGameState(prev => ({ ...prev, difficulty: e.target.value as any }))}
              className="w-full p-2 bg-black border border-cyan-500 rounded text-cyan-400 font-mono"
            >
              <option value="easy">FÁCIL</option>
              <option value="medium">MÉDIO</option>
              <option value="hardcore">HARDCORE</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setGameState(prev => ({ ...prev, state: 'menu' }))}
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold"
        >
          VOLTAR
        </button>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="fixed inset-0 z-50 bg-black">
      {gameState.state === 'menu' && <MenuScreen />}
      {gameState.state === 'carSelect' && <CarSelectScreen />}
      {gameState.state === 'racing' && <RacingScreen />}
      {gameState.state === 'results' && <ResultsScreen />}
      {gameState.state === 'settings' && <SettingsScreen />}
    </div>
  );
};

export default RetroRacingGame;
