import React, { useState, useEffect, useRef, useCallback } from 'react';

// Types
interface Car {
  id: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  color: string;
  width: number;
  height: number;
  skill?: number;
  waypointIndex: number;
  checkpointsPassed: number[];
  lap: number;
}

interface Checkpoint {
  x: number;
  y: number;
  width: number;
  height: number;
  id: number;
  isFinishLine?: boolean;
  passed?: boolean;
}

interface GameState {
  state: 'menu' | 'racing' | 'paused' | 'results';
  playerCar: Car;
  aiCars: Car[];
  checkpoints: Checkpoint[];
  lap: number;
  maxLaps: number;
  position: number;
  started: boolean;
  totalTime: number;
  lapTimes: number[];
}

// Track waypoints for AI navigation
const WAYPOINTS = [
  { x: 300, y: 100 },
  { x: 550, y: 100 },
  { x: 650, y: 200 },
  { x: 650, y: 400 },
  { x: 550, y: 500 },
  { x: 350, y: 500 },
  { x: 250, y: 400 },
  { x: 200, y: 250 }
];

const CHECKPOINTS = [
  { x: 350, y: 90, width: 100, height: 20, id: 0, isFinishLine: true, passed: false },
  { x: 650, y: 300, width: 20, height: 100, id: 1, passed: false },
  { x: 450, y: 500, width: 100, height: 20, id: 2, passed: false },
  { x: 250, y: 300, width: 20, height: 100, id: 3, passed: false }
];

const CAR_COLORS = {
  player: '#DC2626', // Vermelho
  ai1: '#2563EB',    // Azul
  ai2: '#16A34A',    // Verde
  ai3: '#F59E0B',    // Amarelo
  ai4: '#06B6D4'     // Turquesa
};

// Constants for game physics and rendering
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const ACCELERATION = 0.2;
const BRAKE_POWER = 0.4;
const FRICTION = 0.05;
const TURN_SPEED = 0.06;
const MAX_SPEED = 5;
const TRACK_BACKGROUND_COLOR = '#1F2937';
const GRASS_COLOR = '#4ADE80';
const TRACK_BORDER_COLOR = '#DC2626';

interface RacingGameProps {
  onGameEnd?: (score: number, coins: number) => void;
  onClose: () => void;
}

const RacingGame: React.FC<RacingGameProps> = ({ onGameEnd, onClose }) => {
  // Canvas references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIdRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  // Timer for animations and lap tracking
  const startTimeRef = useRef<number>(0);
  const lapTimeRef = useRef<number>(0);
  
  // Score tracking
  const [bestLapTime, setBestLapTime] = useState<number | null>(null);
  
  // Keyboard controls
  const [keys, setKeys] = useState<Set<string>>(new Set());

  // Initialize game state
  const initializeGameState = async (): Promise<GameState> => {
    // Create AI cars
    const aiCars: Car[] = [
      {
        id: 'ai1',
        x: 380,
        y: 150,
        angle: Math.PI / 2,
        speed: 0,
        color: CAR_COLORS.ai1,
        width: 30,
        height: 50,
        skill: 0.95,
        waypointIndex: 0,
        checkpointsPassed: [],
        lap: 1
      },
      {
        id: 'ai2',
        x: 320,
        y: 150,
        angle: Math.PI / 2,
        speed: 0,
        color: CAR_COLORS.ai2,
        width: 30,
        height: 50,
        skill: 1.0,
        waypointIndex: 0,
        checkpointsPassed: [],
        lap: 1
      },
      {
        id: 'ai3',
        x: 350,
        y: 190,
        angle: Math.PI / 2,
        speed: 0,
        color: CAR_COLORS.ai3,
        width: 30,
        height: 50,
        skill: 1.05,
        waypointIndex: 0,
        checkpointsPassed: [],
        lap: 1
      },
      {
        id: 'ai4',
        x: 400,
        y: 190,
        angle: Math.PI / 2,
        speed: 0,
        color: CAR_COLORS.ai4,
        width: 30,
        height: 50,
        skill: 0.9,
        waypointIndex: 0,
        checkpointsPassed: [],
        lap: 1
      }
    ];

    // Reset checkpoints
    const checkpoints = CHECKPOINTS.map(cp => ({ ...cp, passed: cp.isFinishLine ? true : false }));
    
    return {
      state: 'menu',
      playerCar: {
        id: 'player',
        x: 350,
        y: 150,
        angle: Math.PI / 2,
        speed: 0,
        color: CAR_COLORS.player,
        width: 30,
        height: 50,
        waypointIndex: 0,
        checkpointsPassed: [],
        lap: 1
      },
      aiCars,
      checkpoints,
      lap: 1,
      maxLaps: 3,
      position: 1,
      started: false,
      totalTime: 0,
      lapTimes: []
    };
  };

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    state: 'menu',
    playerCar: {
      id: 'player',
      x: 350,
      y: 150,
      angle: Math.PI / 2,
      speed: 0,
      color: CAR_COLORS.player,
      width: 30,
      height: 50,
      waypointIndex: 0,
      checkpointsPassed: [],
      lap: 1
    },
    aiCars: [],
    checkpoints: CHECKPOINTS,
    lap: 1,
    maxLaps: 3,
    position: 1,
    started: false,
    totalTime: 0,
    lapTimes: []
  });

  // Initialize game
  useEffect(() => {
    // Initialize gameState with AI cars
    initializeGameState().then(initialState => {
      setGameState(initialState);
    });
    
    // Set up canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false; // Pixel art style
      }
    }
    
    // Setup keyboard event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (key === 'p') {
        // Toggle pause
        setGameState(prev => ({
          ...prev,
          state: prev.state === 'racing' ? 'paused' : (prev.state === 'paused' ? 'racing' : prev.state)
        }));
        return;
      }
      
      setKeys(prev => {
        const next = new Set(prev);
        next.add(key);
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  // Start the game
  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      state: 'racing',
      started: true
    }));
    
    startTimeRef.current = performance.now();
    lapTimeRef.current = performance.now();
    
    // Start the game loop
    if (canvasRef.current) {
      gameLoop(0);
    }
  };
  
  // Draw the track
  const drawTrack = (ctx: CanvasRenderingContext2D) => {
    // Background
    ctx.fillStyle = GRASS_COLOR;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw track (oval)
    ctx.fillStyle = TRACK_BACKGROUND_COLOR;
    ctx.beginPath();
    ctx.ellipse(GAME_WIDTH/2, GAME_HEIGHT/2, 300, 200, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw inner part (cut out the middle)
    ctx.fillStyle = GRASS_COLOR;
    ctx.beginPath();
    ctx.ellipse(GAME_WIDTH/2, GAME_HEIGHT/2, 200, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the track borders
    ctx.strokeStyle = TRACK_BORDER_COLOR;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(GAME_WIDTH/2, GAME_HEIGHT/2, 300, 200, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.ellipse(GAME_WIDTH/2, GAME_HEIGHT/2, 200, 100, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw finish line
    ctx.fillStyle = '#FFFFFF';
    const finishLine = gameState.checkpoints.find(cp => cp.isFinishLine);
    if (finishLine) {
      ctx.fillRect(finishLine.x, finishLine.y, finishLine.width, finishLine.height);
      
      // Checker pattern
      ctx.fillStyle = '#000000';
      const checkerSize = finishLine.height / 2;
      for (let i = 0; i < finishLine.width / checkerSize; i += 2) {
        ctx.fillRect(finishLine.x + i * checkerSize, finishLine.y, checkerSize, checkerSize);
        ctx.fillRect(finishLine.x + (i + 1) * checkerSize, finishLine.y + checkerSize, checkerSize, checkerSize);
      }
    }
    
    // Draw waypoints for debugging
    if (false) { // Set to true to see waypoints
      WAYPOINTS.forEach((waypoint, i) => {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(waypoint.x, waypoint.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.fillText(i.toString(), waypoint.x - 4, waypoint.y + 4);
      });
    }
  };
  
  // Draw a car
  const drawCar = (ctx: CanvasRenderingContext2D, car: Car) => {
    ctx.save();
    
    // Translate and rotate to car position and angle
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    
    // Draw car body
    ctx.fillStyle = car.color;
    ctx.fillRect(-car.width/2, -car.height/2, car.width, car.height);
    
    // Draw car details
    ctx.fillStyle = '#000000';
    ctx.fillRect(-car.width/2 + 2, -car.height/2 + 5, car.width - 4, 10); // Windshield
    
    // Draw tires
    ctx.fillStyle = '#333333';
    ctx.fillRect(-car.width/2 - 3, -car.height/2 + 5, 3, 10); // Left front
    ctx.fillRect(car.width/2, -car.height/2 + 5, 3, 10); // Right front
    ctx.fillRect(-car.width/2 - 3, car.height/2 - 15, 3, 10); // Left rear
    ctx.fillRect(car.width/2, car.height/2 - 15, 3, 10); // Right rear
    
    // Add dust trail if car is moving fast
    if (car.speed > 1.5) {
      ctx.fillStyle = 'rgba(222, 184, 135, 0.5)';
      ctx.beginPath();
      ctx.arc(-car.width/2, car.height/2, 5 + Math.random() * 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(car.width/2, car.height/2, 5 + Math.random() * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };
  
  // Draw the HUD
  const drawHUD = (ctx: CanvasRenderingContext2D) => {
    // Speed display
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(20, 20, 180, 80);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 180, 80);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px monospace';
    ctx.fillText(`VELOCIDADE: ${Math.floor(gameState.playerCar.speed * 20)} KM/H`, 30, 45);
    ctx.fillText(`POSIÇÃO: ${gameState.position}° / ${gameState.aiCars.length + 1}`, 30, 70);
    ctx.fillText(`VOLTA: ${gameState.lap} / ${gameState.maxLaps}`, 30, 95);
    
    // Timer display
    const timeElapsed = gameState.started ? (performance.now() - startTimeRef.current) / 1000 : 0;
    const currentLapTime = gameState.started ? (performance.now() - lapTimeRef.current) / 1000 : 0;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(GAME_WIDTH - 200, 20, 180, 80);
    ctx.strokeStyle = '#FFFFFF';
    ctx.strokeRect(GAME_WIDTH - 200, 20, 180, 80);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`TEMPO: ${timeElapsed.toFixed(1)}s`, GAME_WIDTH - 190, 45);
    ctx.fillText(`VOLTA: ${currentLapTime.toFixed(2)}s`, GAME_WIDTH - 190, 70);
    if (bestLapTime) {
      ctx.fillText(`MELHOR: ${(bestLapTime / 1000).toFixed(2)}s`, GAME_WIDTH - 190, 95);
    }
    
    // Mini map
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(GAME_WIDTH - 110, 110, 90, 90);
    ctx.strokeStyle = '#FFFFFF';
    ctx.strokeRect(GAME_WIDTH - 110, 110, 90, 90);
    
    // Draw mini track
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(GAME_WIDTH - 65, 155, 40, 30, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw player dot on minimap
    const normalizedX = (gameState.playerCar.x / GAME_WIDTH) * 80;
    const normalizedY = (gameState.playerCar.y / GAME_HEIGHT) * 80;
    ctx.fillStyle = CAR_COLORS.player;
    ctx.beginPath();
    ctx.arc(GAME_WIDTH - 110 + normalizedX, 110 + normalizedY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // AI dots
    gameState.aiCars.forEach(car => {
      const aiX = (car.x / GAME_WIDTH) * 80;
      const aiY = (car.y / GAME_HEIGHT) * 80;
      ctx.fillStyle = car.color;
      ctx.beginPath();
      ctx.arc(GAME_WIDTH - 110 + aiX, 110 + aiY, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  
  // Draw menu screen
  const drawMenuScreen = (ctx: CanvasRenderingContext2D) => {
    // Background
    ctx.fillStyle = GRASS_COLOR;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw track for the background
    drawTrack(ctx);
    
    // Title panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(GAME_WIDTH/2 - 250, GAME_HEIGHT/2 - 150, 500, 300);
    ctx.strokeStyle = CAR_COLORS.player;
    ctx.lineWidth = 5;
    ctx.strokeRect(GAME_WIDTH/2 - 250, GAME_HEIGHT/2 - 150, 500, 300);
    
    // Game title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CORRIDA DE CARROS', GAME_WIDTH/2, GAME_HEIGHT/2 - 90);
    
    // Draw car preview
    ctx.save();
    ctx.translate(GAME_WIDTH/2, GAME_HEIGHT/2 - 10);
    ctx.scale(1.5, 1.5);
    
    // Draw car body
    ctx.fillStyle = CAR_COLORS.player;
    ctx.fillRect(-15, -12.5, 30, 25);
    
    // Draw car details
    ctx.fillStyle = '#000000';
    ctx.fillRect(-15 + 2, -12.5 + 5, 30 - 4, 5); // Windshield
    
    // Draw tires
    ctx.fillStyle = '#333333';
    ctx.fillRect(-15 - 3, -12.5 + 5, 3, 5); // Left front
    ctx.fillRect(15, -12.5 + 5, 3, 5); // Right front
    ctx.fillRect(-15 - 3, 12.5 - 10, 3, 5); // Left rear
    ctx.fillRect(15, 12.5 - 10, 3, 5); // Right rear
    
    ctx.restore();
    
    // Instructions
    ctx.font = '20px monospace';
    ctx.fillText('Use SETAS ou WASD para controlar o carro', GAME_WIDTH/2, GAME_HEIGHT/2 + 50);
    
    // Start button
    ctx.fillStyle = 'rgba(0, 200, 0, 0.8)';
    ctx.fillRect(GAME_WIDTH/2 - 100, GAME_HEIGHT/2 + 80, 200, 50);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(GAME_WIDTH/2 - 100, GAME_HEIGHT/2 + 80, 200, 50);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('INICIAR CORRIDA', GAME_WIDTH/2, GAME_HEIGHT/2 + 110);
    
    // Reset text alignment
    ctx.textAlign = 'left';
  };
  
  // Draw results screen
  const drawResultsScreen = (ctx: CanvasRenderingContext2D) => {
    // Background
    drawTrack(ctx);
    
    // Results panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(GAME_WIDTH/2 - 250, GAME_HEIGHT/2 - 200, 500, 400);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.strokeRect(GAME_WIDTH/2 - 250, GAME_HEIGHT/2 - 200, 500, 400);
    
    // Results title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('RESULTADOS', GAME_WIDTH/2, GAME_HEIGHT/2 - 150);
    
    // Position
    const positionText = gameState.position === 1 ? '1° LUGAR!' : `${gameState.position}° LUGAR`;
    ctx.font = 'bold 28px monospace';
    ctx.fillStyle = gameState.position === 1 ? '#FFD700' : '#FFFFFF';
    ctx.fillText(positionText, GAME_WIDTH/2, GAME_HEIGHT/2 - 100);
    
    // Draw line
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(GAME_WIDTH/2 - 200, GAME_HEIGHT/2 - 70);
    ctx.lineTo(GAME_WIDTH/2 + 200, GAME_HEIGHT/2 - 70);
    ctx.stroke();
    
    // Times
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px monospace';
    ctx.textAlign = 'left';
    
    const totalTime = gameState.totalTime / 1000;
    ctx.fillText(`Tempo Total: ${totalTime.toFixed(2)}s`, GAME_WIDTH/2 - 200, GAME_HEIGHT/2 - 30);
    
    ctx.fillText('Tempos por Volta:', GAME_WIDTH/2 - 200, GAME_HEIGHT/2 + 10);
    
    // Lap times
    gameState.lapTimes.forEach((time, index) => {
      const isBest = time === bestLapTime;
      ctx.fillStyle = isBest ? '#FFD700' : '#FFFFFF';
      ctx.fillText(`Volta ${index + 1}: ${(time/1000).toFixed(2)}s ${isBest ? '(MELHOR)' : ''}`, 
                   GAME_WIDTH/2 - 180, GAME_HEIGHT/2 + 40 + index * 30);
    });
    
    // Play again button
    ctx.fillStyle = 'rgba(0, 200, 0, 0.8)';
    ctx.fillRect(GAME_WIDTH/2 - 100, GAME_HEIGHT/2 + 150, 200, 50);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(GAME_WIDTH/2 - 100, GAME_HEIGHT/2 + 150, 200, 50);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('JOGAR NOVAMENTE', GAME_WIDTH/2, GAME_HEIGHT/2 + 180);
    
    // Reset text alignment
    ctx.textAlign = 'left';
  };
  
  // Update game state
  const updateGame = (deltaMultiplier: number) => {
    setGameState(prev => {
      // Create new state to avoid direct mutation
      const newState = { ...prev };
      
      // Update player car
      let playerCar = { ...newState.playerCar };
      
      // Handle player controls
      if (keys.has('arrowup') || keys.has('w')) {
        playerCar.speed = Math.min(playerCar.speed + ACCELERATION * deltaMultiplier, MAX_SPEED);
      } else if (keys.has('arrowdown') || keys.has('s')) {
        playerCar.speed = Math.max(playerCar.speed - BRAKE_POWER * deltaMultiplier, 0);
      } else {
        // Gradual slowdown when not accelerating
        playerCar.speed = Math.max(playerCar.speed - FRICTION * deltaMultiplier, 0);
      }
      
      // Turning
      if ((keys.has('arrowleft') || keys.has('a')) && playerCar.speed > 0.1) {
        playerCar.angle -= TURN_SPEED * deltaMultiplier * (playerCar.speed / MAX_SPEED);
      }
      if ((keys.has('arrowright') || keys.has('d')) && playerCar.speed > 0.1) {
        playerCar.angle += TURN_SPEED * deltaMultiplier * (playerCar.speed / MAX_SPEED);
      }
      
      // Update position based on velocity and angle
      playerCar.x += Math.sin(playerCar.angle) * playerCar.speed * deltaMultiplier;
      playerCar.y -= Math.cos(playerCar.angle) * playerCar.speed * deltaMultiplier;
      
      // Boundary checking
      playerCar.x = Math.max(0, Math.min(playerCar.x, GAME_WIDTH));
      playerCar.y = Math.max(0, Math.min(playerCar.y, GAME_HEIGHT));
      
      // Update AI cars
      const aiCars = newState.aiCars.map(car => {
        const updatedCar = { ...car };
        
        // Find next waypoint
        const target = WAYPOINTS[updatedCar.waypointIndex];
        
        // Calculate direction to waypoint
        const dx = target.x - updatedCar.x;
        const dy = target.y - updatedCar.y;
        const distanceToWaypoint = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate target angle
        const targetAngle = Math.atan2(dx, -dy);
        
        // Smoothly turn towards waypoint
        let angleDiff = targetAngle - updatedCar.angle;
        
        // Normalize angle difference
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        // Turn towards waypoint
        if (Math.abs(angleDiff) > 0.05) {
          updatedCar.angle += Math.sign(angleDiff) * TURN_SPEED * 0.7 * deltaMultiplier;
        }
        
        // Adjust speed based on waypoint distance and corners
        const isTurning = Math.abs(angleDiff) > 0.8;
        const targetSpeed = isTurning ? MAX_SPEED * 0.6 : MAX_SPEED * (0.7 + 0.3 * Math.random() * (updatedCar.skill || 1.0));
        
        if (updatedCar.speed < targetSpeed) {
          updatedCar.speed += ACCELERATION * 0.7 * deltaMultiplier * (updatedCar.skill || 1.0);
        } else {
          updatedCar.speed -= BRAKE_POWER * 0.5 * deltaMultiplier;
        }
        
        // Update position
        updatedCar.x += Math.sin(updatedCar.angle) * updatedCar.speed * deltaMultiplier;
        updatedCar.y -= Math.cos(updatedCar.angle) * updatedCar.speed * deltaMultiplier;
        
        // Check if waypoint reached
        if (distanceToWaypoint < 30) {
          updatedCar.waypointIndex = (updatedCar.waypointIndex + 1) % WAYPOINTS.length;
        }
        
        return updatedCar;
      });
      
      // Check checkpoints for player car
      newState.checkpoints.forEach(checkpoint => {
        // Simple rectangle collision check
        if (!checkpoint.passed && isColliding(playerCar, checkpoint)) {
          checkpoint.passed = true;
          
          if (checkpoint.isFinishLine && newState.checkpoints.every(cp => cp.passed || cp.isFinishLine)) {
            // Completed a lap
            const currentTime = performance.now();
            const lapTime = currentTime - lapTimeRef.current;
            
            // Track lap time
            const lapTimes = [...newState.lapTimes, lapTime];
            
            // Check if it's the best lap
            if (!bestLapTime || lapTime < bestLapTime) {
              setBestLapTime(lapTime);
            }
            
            // Reset checkpoint states
            newState.checkpoints.forEach(cp => {
              if (!cp.isFinishLine) cp.passed = false;
            });
            
            // Update lap counter
            const newLap = newState.lap + 1;
            
            // Check if race is finished
            if (newLap > newState.maxLaps) {
              newState.state = 'results';
              newState.totalTime = performance.now() - startTimeRef.current;
              
              // Call onGameEnd if provided
              if (onGameEnd) {
                // Calculate score based on position and time
                const score = Math.floor(1000 / newState.position);
                const coins = Math.floor(score / 10);
                onGameEnd(score, coins);
              }
            } else {
              // Continue racing, next lap
              lapTimeRef.current = performance.now();
              return {
                ...newState,
                lap: newLap,
                lapTimes,
                checkpoints: newState.checkpoints.map(cp => ({
                  ...cp,
                  passed: cp.isFinishLine ? true : false
                }))
              };
            }
          }
        }
      });
      
      // Calculate race positions
      const allCars = [playerCar, ...aiCars];
      allCars.sort((a, b) => {
        if (a.lap !== b.lap) return b.lap - a.lap;
        
        // When laps are the same, compare checkpoints passed
        const aCheckpoints = a.checkpointsPassed.length;
        const bCheckpoints = b.checkpointsPassed.length;
        if (aCheckpoints !== bCheckpoints) return bCheckpoints - aCheckpoints;
        
        // If checkpoints are equal, compare distance to next checkpoint
        return 0; // Simplified, could be enhanced with distance calculation
      });
      
      const playerPosition = allCars.findIndex(car => car.id === 'player') + 1;
      
      return {
        ...newState,
        playerCar,
        aiCars,
        position: playerPosition,
        totalTime: performance.now() - startTimeRef.current
      };
    });
  };
  
  // Helper function to check collision between car and checkpoint
  const isColliding = (car: Car, checkpoint: Checkpoint) => {
    // Simple AABB collision
    const carLeft = car.x - car.width / 2;
    const carRight = car.x + car.width / 2;
    const carTop = car.y - car.height / 2;
    const carBottom = car.y + car.height / 2;
    
    return !(
      carRight < checkpoint.x ||
      carLeft > checkpoint.x + checkpoint.width ||
      carBottom < checkpoint.y ||
      carTop > checkpoint.y + checkpoint.height
    );
  };
  
  // Main game loop
  const gameLoop = (timestamp: number) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Calculate delta time
    const deltaTime = timestamp - (lastTimeRef.current || timestamp);
    lastTimeRef.current = timestamp;
    
    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    if (gameState.state === 'menu') {
      drawMenuScreen(ctx);
    } else if (gameState.state === 'racing' || gameState.state === 'paused') {
      // Draw track and cars even when paused
      drawTrack(ctx);
      drawCar(ctx, gameState.playerCar);
      gameState.aiCars.forEach(car => drawCar(ctx, car));
      drawHUD(ctx);
      
      // Only update game if not paused
      if (gameState.state === 'racing') {
        updateGame(deltaTime / 16); // Normalize to ~60fps
      } else {
        // Show pause message
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(GAME_WIDTH/2 - 150, GAME_HEIGHT/2 - 50, 300, 100);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(GAME_WIDTH/2 - 150, GAME_HEIGHT/2 - 50, 300, 100);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px monospace';
        ctx.fillText('JOGO PAUSADO', GAME_WIDTH/2 - 90, GAME_HEIGHT/2 - 10);
        ctx.font = '16px monospace';
        ctx.fillText('Pressione P para continuar', GAME_WIDTH/2 - 120, GAME_HEIGHT/2 + 20);
      }
    } else if (gameState.state === 'results') {
      drawResultsScreen(ctx);
    }
    
    // Request next frame
    frameIdRef.current = requestAnimationFrame(gameLoop);
  };
  
  // Use effect for game loop
  useEffect(() => {
    // Start game loop on mount
    frameIdRef.current = requestAnimationFrame(gameLoop);
    
    // Cleanup on unmount
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);
  
  // Handle clicks on the canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    // Get canvas bounds
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Calculate click position relative to canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Handle click based on game state
    if (gameState.state === 'menu') {
      // Check if clicked on start button
      if (
        x >= GAME_WIDTH/2 - 100 && 
        x <= GAME_WIDTH/2 + 100 && 
        y >= GAME_HEIGHT/2 + 80 && 
        y <= GAME_HEIGHT/2 + 130
      ) {
        startGame();
      }
    } else if (gameState.state === 'results') {
      // Check if clicked on play again button
      if (
        x >= GAME_WIDTH/2 - 100 && 
        x <= GAME_WIDTH/2 + 100 && 
        y >= GAME_HEIGHT/2 + 150 && 
        y <= GAME_HEIGHT/2 + 200
      ) {
        resetGame();
      }
    }
  };
  
  // Reset the game to initial state
  const resetGame = () => {
    initializeGameState().then(initialState => {
      setGameState(initialState);
      setGameState(prev => ({
        ...prev,
        state: 'menu'
      }));
    });
  };

  return (
    <div className="racing-game-container">
      <div className="racing-game-wrapper relative h-screen w-full flex items-center justify-center bg-black">
        <canvas 
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          onClick={handleCanvasClick}
          className="racing-canvas max-w-full max-h-full"
          style={{ 
            background: 'black',
            boxShadow: '0 0 20px rgba(0, 100, 255, 0.5)'
          }}
        />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors"
          style={{ zIndex: 100 }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default RacingGame;
