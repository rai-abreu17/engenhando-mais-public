import React, { useRef, useEffect, useState, useCallback } from 'react';
import CarRacingGame from '@/lib/CarRacingGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Coins, X } from 'lucide-react';

// Importação do CSS específico para o jogo de corrida
import '@/styles/racing-game.css';

interface CanvasRacingGameProps {
  onGameEnd: (score: number, coins: number) => void;
  onClose: () => void;
}

const CanvasRacingGame: React.FC<CanvasRacingGameProps> = ({ onGameEnd, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameInstance = useRef<CarRacingGame | null>(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [gameRestarts, setGameRestarts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Função para ativar/desativar o modo de depuração
  const toggleDebugMode = () => {
    if (gameInstance.current) {
      gameInstance.current.toggleDebugMode();
      const newDebugMode = !debugMode;
      setDebugMode(newDebugMode);
      
      // Log detalhado sobre mudança no modo de depuração
      console.log(`🐛 Modo de depuração ${newDebugMode ? 'ATIVADO' : 'DESATIVADO'}`);
      
      if (newDebugMode) {
        console.log('ℹ️ Informações de debug disponíveis:');
        console.log(' - Áreas de colisão visualizadas em cores');
        console.log(' - Logs detalhados no console');
        console.log(' - Contador de logs visível na tela');
        console.log(' - Informações de sobreposição entre objetos');
      }
    }
  };

  // Referência para evitar múltiplas inicializações
  const isInitializedRef = useRef(false);
  // Contador para rastrear montagens/desmontagens
  const mountCountRef = useRef(0);
  // Timestamp da última montagem
  const mountTimeRef = useRef(0);
  
  // Criamos uma função de cleanup que pode ser chamada de qualquer lugar
  const cleanupGame = useCallback(() => {
    console.log('🧹 Executando limpeza de recursos do jogo...');
    if (gameInstance.current) {
      try {
        gameInstance.current.destroy();
        gameInstance.current = null;
      } catch (err) {
        console.error('❌ Erro ao destruir jogo:', err);
      }
    }
    isInitializedRef.current = false;
  }, []);
  
  // Effect para controlar a desmontagem definitiva do componente
  useEffect(() => {    
    // Incrementa o contador de montagens e registra o tempo
    mountCountRef.current += 1;
    mountTimeRef.current = Date.now();
    const currentMountCount = mountCountRef.current;
    
    // Desativa logs para evitar spam no console
    if (currentMountCount <= 2 || currentMountCount % 5 === 0) {
      console.log(`🎲 Componente CanvasRacingGame montado #${currentMountCount}`);
    }
    
    // Cleanup apenas quando o componente é realmente desmontado da aplicação
    return () => {
      const mountDuration = Date.now() - mountTimeRef.current;
      
      // Se o componente existiu por muito pouco tempo, pode estar em um ciclo de remontagem
      // Neste caso, evitamos fazer a limpeza completa para melhorar performance
      if (mountDuration < 500) {
        console.log(`⏱️ Montagem rápida detectada: ${mountDuration}ms - pulando limpeza`);
        return;
      }
      
      // Desativa logs para evitar spam no console
      if (currentMountCount <= 2 || currentMountCount % 5 === 0) {
        console.log(`🚫 Componente CanvasRacingGame desmontado #${currentMountCount}`);
      }
      
      // Usa nossa função de limpeza comum apenas se o jogo realmente foi inicializado
      if (isInitializedRef.current) {
        cleanupGame();
      }
    };
  }, [cleanupGame]);
  
  // Ref para rastrear tempo de inicialização
  const initStartTimeRef = useRef(0);

  useEffect(() => {
    // Detectar ciclos de montagem/desmontagem rápidos
    const currentTime = Date.now();
    const timeSinceLastInit = currentTime - initStartTimeRef.current;
    
    // Se uma nova inicialização for solicitada muito rapidamente, pode ser ciclo de montagem/desmontagem
    const isRapidReinitialization = timeSinceLastInit < 1000;
    
    // Atualiza o tempo da última tentativa de inicialização
    initStartTimeRef.current = currentTime;
    
    // Limita logs para evitar spam
    if (mountCountRef.current <= 2 || mountCountRef.current % 5 === 0) {
      console.log(`🔄 Effect de inicialização #${mountCountRef.current} executado`);
      
      if (isRapidReinitialization) {
        console.warn(`⚠️ Reinicialização rápida detectada (${timeSinceLastInit}ms)`);
      }
    }
    
    // Se o jogo não foi iniciado pelo usuário, não faz nada além de aguardar
    if (!gameStarted) {
      if (mountCountRef.current <= 2 || mountCountRef.current % 5 === 0) {
        console.log('⏳ Aguardando o usuário iniciar o jogo...');
      }
      setIsLoading(false); // Garante que não fique em loading
      return;
    }
    
    // Se o jogo já estiver inicializado e funcionando, reusa
    if (gameInstance.current && isInitializedRef.current) {
      console.warn('🚨 Jogo já inicializado - ignorando nova inicialização');
      setIsLoading(false); // Garante que o loading seja removido
      return;
    }
    
    // Pequeno atraso para evitar inicializações repetidas em ciclos de montagem/desmontagem
    const initDelay = isRapidReinitialization ? 800 : 100;
    
    // Marca que estamos inicializando (para mostrar tela de loading)
    setIsLoading(true);
    
    console.log('🚀 Agendando inicialização com delay de segurança:', initDelay, 'ms');
    
    // Inicialização com atraso para prevenir ciclos de montagem/desmontagem
    const delayedInitTimeoutId = setTimeout(() => {
      console.log('🚀 Iniciando processo de inicialização do jogo após atraso de segurança...');
      
      // Marca como inicializado
      isInitializedRef.current = true;
      
      console.log('🎮 Jogo sendo instanciado agora a pedido do usuário');
      
      // Executa a inicialização do jogo
      initializeGame();
    }, initDelay);
    
    // Adiciona um timeout para garantir que o loading não fica preso
    const timeoutId = setTimeout(() => {
      if (!gameInstance.current && isInitializedRef.current) {
        console.warn('⚠️ Tempo limite para inicialização do jogo excedido, forçando atualização');
        // Força um refresh do componente
        setIsLoading(false);
        setGameStarted(false);
        isInitializedRef.current = false;
        alert('Tempo limite excedido ao iniciar o jogo. Por favor, tente novamente.');
      }
    }, 8000); // 8 segundos de timeout
    
    const handleGameOver = (finalScore: number, finalCoins: number) => {
      console.log(`🛑 JOGO FINALIZADO no componente React`);
      console.log(`📊 Pontuação final: ${finalScore}, Moedas: ${finalCoins}`);
      console.log(`🔄 Aguardando reinício...`);
      setGameOver(true);
      onGameEnd(finalScore, finalCoins);
    };

    const handleScoreUpdate = (currentScore: number, currentCoins: number) => {
      setScore(currentScore);
      setCoins(currentCoins);
    };

    // Executar inicialização dentro do timeout para dar tempo ao componente de estabilizar
    const initializeGame = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('❌ Canvas não encontrado durante inicialização');
        setIsLoading(false);
        return;
      }

      // Garante que o canvas tem o tamanho correto antes de inicializar o jogo
      const updateCanvasSize = () => {
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
        }
      };
      
      // Configura o tamanho inicial
      updateCanvasSize();

      // Inicializa o jogo após configurar o tamanho do canvas
      try {
        // Só cria nova instância se não existir uma
        if (!gameInstance.current) {
          console.log('🔧 Criando nova instância de CarRacingGame');
          gameInstance.current = new CarRacingGame(canvas, handleGameOver, handleScoreUpdate);
          
          // Adiciona um pequeno atraso para garantir que o jogo seja renderizado corretamente
          setTimeout(() => {
            if (gameInstance.current) {
              console.log('✅ Jogo inicializado com sucesso!');
              setIsLoading(false); // Desativa o estado de carregamento após o jogo ser inicializado
            }
          }, 1000);
        } else {
          console.log('♻️ Reusando instância existente do jogo');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar o jogo:', error);
        setIsLoading(false);
        setGameStarted(false);
        isInitializedRef.current = false;
      }
      
      // Adiciona listener para redimensionamento
      window.addEventListener('resize', updateCanvasSize);
      
      // Retorna função para limpar recursos quando o effect for desmontado
      return () => {
        window.removeEventListener('resize', updateCanvasSize);
      };
    };
    
    return () => {
      // Limpa os timeouts para evitar vazamentos
      clearTimeout(delayedInitTimeoutId);
      clearTimeout(timeoutId);
      
      console.log('⚙️ Limpeza de effect, gameStarted:', gameStarted ? 'sim' : 'não', 'gameOver:', gameOver ? 'sim' : 'não');
    };
  }, [gameStarted]);

  // Função para iniciar jogo de forma segura
  const safelyStartGame = () => {
    console.log('🎮 Iniciando jogo de forma segura');
    setIsLoading(true);
    setTimeout(() => {
      setGameStarted(true);
    }, 100);
  };
  
  // Função para reiniciar jogo de forma segura
  const safelyRestartGame = () => {
    const newRestartCount = gameRestarts + 1;
    console.log(`🎮 Reiniciando jogo - Reinício #${newRestartCount}`);
    console.log(`📊 Estatísticas: Pontuação: ${score}, Moedas: ${coins}`);
    
    try {
      if (gameInstance.current) {
        console.log('🔄 Reiniciando instância atual do jogo');
        gameInstance.current.resetGame();
        setGameOver(false);
        setScore(0);
        setCoins(0);
        setGameRestarts(newRestartCount);
      } else {
        console.warn('⚠️ Tentativa de reiniciar jogo, mas não há instância disponível');
        // Se não houver instância, reiniciar o componente completamente
        setIsLoading(true);
        setGameOver(false);
        setGameStarted(false);
        
        setTimeout(() => {
          console.log('🔄 Iniciando nova instância do jogo após Game Over');
          setGameStarted(true);
        }, 500);
      }
    } catch (error) {
      console.error('❌ Erro ao reiniciar jogo:', error);
      alert('Erro ao reiniciar o jogo. Tentando iniciar uma nova partida...');
      
      // Em caso de erro, tenta iniciar um novo jogo do zero
      cleanupGame();
      setIsLoading(true);
      setGameOver(false);
      
      setTimeout(() => {
        setGameStarted(true);
      }, 500);
    }
  };
  
  // Gerenciamento de teclas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        if (gameOver) {
          // Reinicia o jogo quando pressiona espaço e está no game over
          safelyRestartGame();
          e.preventDefault();
        } else if (!gameStarted) {
          // Inicia o jogo quando pressiona espaço e está na tela inicial
          console.log('🎮 Iniciando jogo via teclado (tecla espaço)');
          safelyStartGame();
          e.preventDefault();
        }
      }
      
      // Apenas processa teclas de direção se o jogo estiver em andamento
      if (gameStarted && !gameOver && !isLoading && gameInstance.current) {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
          console.log('⬅️ Tecla ESQUERDA pressionada');
          gameInstance.current.setDirection('left');
          e.preventDefault();
        }
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
          console.log('➡️ Tecla DIREITA pressionada');
          gameInstance.current.setDirection('right');
          e.preventDefault();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver, gameStarted, gameRestarts, score, coins, isLoading]);

  useEffect(() => {
    // Primeira abordagem: oculta o menu de navegação diretamente
    const navElement = document.querySelector('nav.fixed.bottom-0');
    if (navElement) {
      navElement.setAttribute('style', 'display: none !important');
    }
    
    // Segunda abordagem: adiciona classe ao body para usar o CSS
    document.body.classList.add('game-active');
    
    return () => {
      // Restaura a visibilidade do menu de navegação quando o componente desmonta
      if (navElement) {
        navElement.removeAttribute('style');
      }
      document.body.classList.remove('game-active');
    };
  }, []);

  return (
    <div className="racing-game-container bg-black flex flex-col">
      <div className="flex items-center justify-between px-2 py-1 racing-game-overlay">
        <CardTitle className="text-lg text-white">
          🏎️ Corrida Educativa
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-blue-50/80 px-2 py-1 rounded-md">
            <Trophy className="h-3 w-3 text-blue-600" />
            <span className="font-medium text-blue-800">{score}</span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50/80 px-2 py-1 rounded-md">
            <Coins className="h-3 w-3 text-yellow-600" />
            <span className="font-medium text-yellow-800">{coins}</span>
          </div>
          <div className="flex items-center space-x-2">
            {process.env.NODE_ENV === 'development' && (
              <Button 
                onClick={toggleDebugMode} 
                variant="outline" 
                size="sm" 
                title="Ativa visualização de áreas de colisão e logs detalhados"
                className={`h-8 text-xs ${debugMode ? 'bg-yellow-200 font-bold' : ''}`}
              >
                {debugMode ? '🐞 Debug: ON' : '🔍 Debug: OFF'}
              </Button>
            )}
            <Button 
              onClick={() => {
                // Usa a função comum de limpeza
                console.log('🚪 Botão FECHAR clicado, limpando recursos do jogo...');
                cleanupGame();
                onClose();
              }} 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas do Jogo - ocupa todo o espaço restante */}
      <div className="flex-grow relative w-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full bg-gray-900 racing-game-canvas"
        />
        
        {/* Controles na tela para dispositivos móveis - apenas mostrados quando o jogo estiver ativo */}
        {gameInstance.current && !gameOver && gameStarted && (
          <div className="absolute inset-x-0 bottom-6 flex justify-between px-8 pointer-events-none">
            <button 
              className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center pointer-events-auto active:bg-white/30 backdrop-blur-sm"
              onTouchStart={(e) => {
                e.preventDefault(); // Previne comportamento padrão
                if (gameInstance.current) {
                  console.log('👆 Botão ESQUERDA tocado');
                  gameInstance.current.setDirection('left');
                } else {
                  console.warn('⚠️ Tentativa de usar botão esquerdo, mas jogo não está inicializado');
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                if (gameInstance.current) {
                  console.log('👆 Botão ESQUERDA clicado');
                  gameInstance.current.setDirection('left');
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center pointer-events-auto active:bg-white/30 backdrop-blur-sm"
              onTouchStart={(e) => {
                e.preventDefault(); // Previne comportamento padrão
                if (gameInstance.current) {
                  console.log('👆 Botão DIREITA tocado');
                  gameInstance.current.setDirection('right');
                } else {
                  console.warn('⚠️ Tentativa de usar botão direito, mas jogo não está inicializado');
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                if (gameInstance.current) {
                  console.log('👆 Botão DIREITA clicado');
                  gameInstance.current.setDirection('right');
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Tela de Welcome ou Game Over ou Loading */}
        {(gameOver || !gameStarted || isLoading) && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-[10003]">
            <div className="text-center text-white space-y-4 max-w-md p-6 bg-gray-900/80 rounded-xl border border-cyan-500/30 pointer-events-auto">
              {gameOver ? (
                <>
                  <h3 className="text-2xl font-bold text-cyan-300">Jogo Finalizado!</h3>
                  <div className="flex justify-center space-x-4 py-2">
                    <div className="bg-blue-900/50 rounded-lg px-4 py-2">
                      <div className="text-sm text-blue-300">Pontuação</div>
                      <div className="text-2xl font-bold text-white">{score}</div>
                    </div>
                    <div className="bg-yellow-900/50 rounded-lg px-4 py-2">
                      <div className="text-sm text-yellow-300">Moedas</div>
                      <div className="text-2xl font-bold text-white">{coins}</div>
                    </div>
                  </div>
                  <button 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 rounded-lg font-bold text-white hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all"
                    onClick={() => {
                      console.log('🎮 Botão JOGAR NOVAMENTE clicado');
                      safelyRestartGame();
                    }}
                  >
                    Jogar Novamente
                  </button>
                  <p className="text-sm text-gray-300">Ou pressione ESPAÇO para reiniciar</p>
                </>
              ) : isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                  <p className="text-lg text-cyan-300">Iniciando o jogo...</p>
                  <p className="text-sm text-gray-400">Preparando os carros, por favor aguarde</p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-cyan-300">Corrida Educativa</h2>
                  <p className="text-gray-300">Evite os outros carros e colete moedas para ganhar pontos!</p>
                  <div className="py-4">
                    <div className="flex items-center justify-center space-x-6 bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                          </svg>
                        </div>
                        <p className="text-sm">Esquerda</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                        <p className="text-sm">Direita</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 px-12 py-4 rounded-lg font-bold text-xl text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all shadow-lg"
                    onClick={() => {
                      console.log('🎮 Botão JOGAR clicado');
                      setIsLoading(true);
                      
                      // Pequeno atraso para permitir a renderização do estado de carregamento
                      // Primeiro vamos limpar qualquer instância anterior que possa estar causando problemas
                      if (gameInstance.current) {
                        console.log('⚠️ Instância anterior encontrada, limpando...');
                        cleanupGame();
                      }
                      
                      // Resetamos o estado para forçar uma nova inicialização limpa
                      isInitializedRef.current = false;
                      
                      // Pequeno atraso para garantir que a limpeza foi concluída
                      setTimeout(() => {
                        console.log('🎯 Inicializando jogo a partir do zero');
                        setGameStarted(true);
                      }, 200);
                    }}
                  >
                    JOGAR
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasRacingGame;