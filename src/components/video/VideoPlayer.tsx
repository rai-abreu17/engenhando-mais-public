import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Maximize, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Adicionar declaração de tipos para a API do YouTube
declare global {
  interface Window {
    YT: {
      Player: any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
      loaded: number;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoQuestion {
  id: string;
  time: number; // em segundos
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface VideoPlayerProps {
  videoId: string;
  title: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  questions: VideoQuestion[];
  onPlay: () => void;
  onPause: () => void;
  onTimeUpdate: (time: number, videoDuration?: number) => void;
  onQuestionTriggered: (question: VideoQuestion) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  title,
  currentTime,
  duration,
  isPlaying,
  questions,
  onPlay,
  onPause,
  onTimeUpdate,
  onQuestionTriggered
}) => {
  // Refs
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  
  // Estados básicos
  const [volume, setVolume] = useState(80);
  const [showControls, setShowControls] = useState(true);
  const [triggeredQuestions, setTriggeredQuestions] = useState<Set<string>>(new Set());
  // Helper to namespace question IDs by video to avoid collisions between lessons
  const questionKey = (qId: string) => `${videoId}::${qId}`;
  const [internalTime, setInternalTime] = useState(currentTime || 0);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para as configurações de vídeo
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoQuality, setVideoQuality] = useState('auto');
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [isChangingSettings, setIsChangingSettings] = useState(false); // Estado para controlar alterações em andamento

  // Função para criar o player do YouTube
  const initPlayer = () => {
    try {
      console.log(`[VideoPlayer] Iniciando player do YouTube para video: ${videoId}, tempo DEVE SER ZERO`);
      
      // Verificar se a API do YouTube está realmente disponível
      if (!window.YT || !window.YT.Player) {
        console.error("API do YouTube não está disponível ainda");
        return; // Sairemos e tentaremos novamente quando a API estiver pronta
      }
      
      // Limpar player anterior se existir
      if (playerRef.current) {
        try {
          console.log('[VideoPlayer] Destruindo player antigo antes de criar novo');
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (error) {
          console.error("Erro ao destruir player antigo:", error);
        }
      }
      
      // Verificar se o contêiner está disponível
      if (!playerContainerRef.current) {
        console.error("Container do player não encontrado");
        return;
      }
      
      // Criar ID único para o iframe
      const playerElementId = `youtube-player-${Date.now()}`;
      
      // Limpar conteúdo existente e criar elemento para o iframe
      playerContainerRef.current.innerHTML = '';
      const playerElement = document.createElement('div');
      playerElement.id = playerElementId;
      playerContainerRef.current.appendChild(playerElement);
      
      console.log('Criando player para vídeo:', videoId);
      
      // Criar o player com configuração completa
      playerRef.current = new window.YT.Player(playerElementId, {
        videoId: videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0, // Começamos com autoplay desligado para garantir inicialização
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
          cc_load_policy: captionsEnabled ? 1 : 0,  // 1 força legendas, 0 desativa
          cc_lang_pref: 'pt'  // preferência de idioma para legendas
        },
        events: {
            onReady: (event: any) => {
              console.log(`[VideoPlayer] Player pronto para vídeo: ${videoId} - FORÇANDO INÍCIO EM 0!`);
              setPlayerReady(true);
              event.target.setVolume(volume);
              
              // SEMPRE iniciar do começo - independente do que diz currentTime
              console.log('[VideoPlayer] Forçando seekTo(0) na inicialização');
              event.target.seekTo(0, true);
              
              // Obter a duração real do vídeo
              const actualDuration = event.target.getDuration();
              if (actualDuration && actualDuration > 0) {
                console.log(`[VideoPlayer] Duração detectada: ${Math.floor(actualDuration)}s - Notificando com tempo 0`);
                // Sempre notificar com tempo 0 ao inicializar
                onTimeUpdate(0, Math.floor(actualDuration));
              }
              
              // DESATIVAR: Não usar currentTime na inicialização
              // if (currentTime > 0) {
              //   event.target.seekTo(currentTime, true);
              // }            // Definir a taxa de reprodução inicial
            try {
              event.target.setPlaybackRate(playbackRate);
            } catch (e) {
              console.error('Erro ao definir playbackRate:', e);
            }
            
            // Verificar e configurar legendas na inicialização
            try {
              // Verificar se legendas estão disponíveis para este vídeo
              console.log('Verificando disponibilidade de legendas...');
              
              // Usar a API moderna para legendas, se disponível
              if (typeof event.target.getOptions === 'function') {
                const options = event.target.getOptions();
                console.log('Opções disponíveis para o vídeo:', options);
                
                if (options.includes('captions')) {
                  console.log('API de legendas disponível');
                  
                  // Obter legendas disponíveis
                  if (typeof event.target.getOption === 'function') {
                    const tracks = event.target.getOption('captions', 'tracklist');
                    console.log('Legendas disponíveis:', tracks);
                  }
                  
                  // Configurar legendas de acordo com o estado atual
                  if (captionsEnabled) {
                    console.log('Ativando legendas na inicialização');
                    event.target.setOption('captions', 'track', {languageCode: 'pt'});
                    event.target.setOption('captions', 'reload', true);
                    event.target.setOption('captions', 'fontSize', 2); // tamanho grande para melhor legibilidade
                    
                    // Tentar forçar legendas visíveis
                    setTimeout(() => {
                      try {
                        const iframe = event.target.getIframe();
                        if (iframe) {
                          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                          if (iframeDoc) {
                            const style = iframeDoc.createElement('style');
                            style.id = 'custom-caption-style';
                            style.textContent = '.ytp-caption-window-container { display: block !important; }';
                            iframeDoc.head.appendChild(style);
                          }
                        }
                      } catch (e) {
                        console.error('Erro ao forçar legendas visíveis:', e);
                      }
                    }, 1000);
                  }
                } else {
                  console.log('Este vídeo não possui API de legendas disponível');
                }
              } else {
                console.log('API moderna de legendas não disponível');
              }
            } catch (e) {
              console.error('Erro ao configurar legendas:', e);
            }
            
            // Iniciar reprodução se necessário (com pequeno delay para garantir inicialização)
            setTimeout(() => {
              if (isPlaying) {
                try {
                  event.target.playVideo();
                } catch (e) {
                  console.error('Erro ao iniciar reprodução:', e);
                }
              }
            }, 200);
            
            // Obter qualidades de vídeo disponíveis
            try {
              const qualities = event.target.getAvailableQualityLevels();
              if (qualities && qualities.length > 0) {
                setAvailableQualities(qualities);
                setVideoQuality(event.target.getPlaybackQuality() || 'auto');
              }
            } catch (error) {
              console.error("Erro ao obter qualidades de vídeo:", error);
            }
          },
          onStateChange: (event: any) => {
            console.log('Mudança de estado:', event.data);
            // Atualiza o estado do player quando o vídeo é reproduzido ou pausado
            if (event.data === window.YT.PlayerState.PLAYING) {
              onPlay();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              onPause();
            }
            
            // Garante que o estado interno está sincronizado
            setTimeout(() => {
              try {
                if (event.data === window.YT.PlayerState.PLAYING && !isPlaying) {
                  onPlay();
                } else if (event.data === window.YT.PlayerState.PAUSED && isPlaying) {
                  onPause();
                }
              } catch (error) {
                console.error("Erro ao sincronizar estado:", error);
              }
            }, 0);
          },
          onError: (event: any) => {
            console.error('YouTube Player Error:', event.data);
            // Decodificar código de erro
            let errorMessage = "Erro ao carregar o vídeo";
            switch(event.data) {
              case 2:
                errorMessage = "ID de vídeo inválido";
                break;
              case 5:
                errorMessage = "Erro de HTML5";
                break;
              case 100:
                errorMessage = "Vídeo não encontrado";
                break;
              case 101:
              case 150:
                errorMessage = "O proprietário não permite a reprodução em players incorporados";
                break;
            }
            setError(errorMessage);
          }
        }
      });
    } catch (error) {
      console.error("Erro ao inicializar o player:", error);
      setError("Erro ao inicializar o player: " + (error instanceof Error ? error.message : String(error)));
    }
  };
  
  // Inicializar a API do YouTube
  useEffect(() => {
    // Função para inicializar API com tratamento de erro
    const setupYouTubeAPI = () => {
      try {
        console.log(`[VideoPlayer] Inicializando API para videoId: ${videoId}, currentTime definido como: ${currentTime}`);
        
        // Verificar se já existe script da API
        if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
          if (window.YT && window.YT.Player) {
            console.log('[VideoPlayer] API do YouTube já carregada, inicializando player do zero');
            initPlayer();
          } else {
            // API está carregando, definir callback
            console.log('[VideoPlayer] API do YouTube ainda carregando, definindo callback');
            window.onYouTubeIframeAPIReady = initPlayer;
          }
          return;
        }
        
        // Carregar API
        console.log('[VideoPlayer] Carregando script da API do YouTube');
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        
        // Definir callback
        window.onYouTubeIframeAPIReady = () => {
          console.log('[VideoPlayer] YouTube API carregada com sucesso, inicializando player com videoId:', videoId);
          initPlayer();
        };
      } catch (error) {
        console.error('Erro ao configurar API do YouTube:', error);
        setError('Erro ao carregar API do YouTube');
      }
    };
    
    // Reset internos importantes
    console.log(`[VideoPlayer] useEffect[videoId] - Resetando para videoId: ${videoId}`);
    setInternalTime(0);
    
    // Chamar função de setup
    setupYouTubeAPI();

    return () => {
      // Limpar o player quando o componente for desmontado
      if (playerRef.current) {
        try {
          console.log('[VideoPlayer] Cleanup - destruindo player antigo');
          playerRef.current.destroy();
        } catch (error) {
          console.error('Erro ao destruir o player:', error);
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // Reset triggered questions when the video changes to avoid carrying state between lessons
  useEffect(() => {
    console.log(`[VideoPlayer] VideoId mudou para: ${videoId} - Resetando completamente o player`);
    setTriggeredQuestions(new Set());
    // Reset internal playback time for the new video
    setInternalTime(0);
    try {
      // Inform parent that time reset to 0
      onTimeUpdate(0);
      
      // SOLUÇÃO FORTE: destruir e recriar o player completamente
      if (playerRef.current) {
        try {
          console.log('[VideoPlayer] Destruindo player antigo para criar novo do zero');
          playerRef.current.destroy();
          playerRef.current = null;
          
          // Forçar reinicialização do player
          setTimeout(() => {
            console.log('[VideoPlayer] Recriando player após destruição');
            initPlayer();
          }, 100);
        } catch (e) {
          console.error('Erro ao destruir player:', e);
        }
      }
    } catch (e) {
      console.error('Erro ao resetar tempo do player ao mudar de vídeo:', e);
    }
  }, [videoId]);

  // Sincronizar tempo interno e verificar questões
  // Fechar menu de configurações quando clicar fora
  useEffect(() => {
    const settingsButtonRef = document.querySelector('[data-settings-button="true"]');
    const settingsMenuRef = document.querySelector('[data-settings-menu="true"]');
    
    const handleClickOutside = (event: MouseEvent) => {
      if (!showSettingsMenu) return;
      
      const isClickInside = 
        (settingsButtonRef && settingsButtonRef.contains(event.target as Node)) ||
        (settingsMenuRef && settingsMenuRef.contains(event.target as Node));
      
      if (!isClickInside) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsMenu]);

  useEffect(() => {
    if (!playerReady || !playerRef.current) return;

    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentTime = Math.floor(playerRef.current.getCurrentTime());
          const actualDuration = playerRef.current.getDuration();
          
          setInternalTime(currentTime);
          
          // Se a duração do vídeo mudou, atualize-a também
          if (actualDuration && Math.abs(actualDuration - duration) > 1) {
            onTimeUpdate(currentTime, Math.floor(actualDuration));
          } else {
            onTimeUpdate(currentTime);
          }
          
          // Verificar o estado real do player e sincronizar com nosso estado local
          if (typeof playerRef.current.getPlayerState === 'function') {
            const playerState = playerRef.current.getPlayerState();
            const isActuallyPlaying = playerState === window.YT.PlayerState.PLAYING;
            
            // Se o estado interno não coincide com o estado real do player, atualize-o
            if (isActuallyPlaying !== isPlaying) {
              if (isActuallyPlaying) {
                onPlay();
              } else {
                onPause();
              }
            }
          }
          
          // Verificar questões (com namespace por vídeo)
          const currentQuestions = questions.filter(
            q => Math.abs(q.time - currentTime) < 1 && !triggeredQuestions.has(questionKey(q.id))
          );
      
          if (currentQuestions.length > 0 && isPlaying) {
            const question = currentQuestions[0];
            setTriggeredQuestions(prev => new Set([...Array.from(prev), questionKey(question.id)]));
            playerRef.current.pauseVideo();
            onQuestionTriggered(question);
          }
        } catch (error) {
          console.error('Error getting player time:', error);
        }
      }
    }, 500); // Reduzimos o intervalo para 500ms para detecção mais rápida de mudanças
    
    return () => clearInterval(interval);
  }, [playerReady, isPlaying, questions, triggeredQuestions, duration, onTimeUpdate, onPlay, onPause, onQuestionTriggered]);

  // Sincronizar estados com o player
  useEffect(() => {
    if (!playerReady || !playerRef.current) return;
    
    // Se estamos no meio de uma mudança de configuração, não interferir
    // Isso evita que o useEffect cause problemas com as funções específicas
    if (isChangingSettings) {
      return;
    }
    
    try {
      // Sincronizamos os parâmetros com cuidado para não interferir um no outro
      
      // 1. Estado de reprodução
      const playerState = playerRef.current.getPlayerState?.();
      const isCurrentlyPlaying = playerState === window.YT.PlayerState.PLAYING;
      
      if (isPlaying && !isCurrentlyPlaying) {
        console.log('Sincronizando: Iniciando reprodução');
        playerRef.current.playVideo();
      } else if (!isPlaying && isCurrentlyPlaying) {
        console.log('Sincronizando: Pausando reprodução');
        playerRef.current.pauseVideo();
      }
      
      // 2. Volume
      playerRef.current.setVolume(volume);
      
      // 3. Taxa de reprodução - verificamos se é realmente necessário mudar
      const currentRate = playerRef.current.getPlaybackRate?.();
      if (currentRate !== undefined && Math.abs(currentRate - playbackRate) > 0.01) {
        console.log('Sincronizando taxa de reprodução:', playbackRate);
        playerRef.current.setPlaybackRate(playbackRate);
      }
      
      // 4. Qualidade de vídeo (se não for auto)
      if (videoQuality !== 'auto') {
        const currentQuality = playerRef.current.getPlaybackQuality?.();
        if (currentQuality !== videoQuality) {
          console.log('Sincronizando qualidade de vídeo:', videoQuality);
          playerRef.current.setPlaybackQuality(videoQuality);
        }
      }
      
      // 5. Legendas (tentativa via API sem recarregar)
      try {
        if (typeof playerRef.current.getOptions === 'function') {
          const options = playerRef.current.getOptions();
          
          if (options.includes('captions')) {
            if (captionsEnabled) {
              playerRef.current.setOption('captions', 'track', {languageCode: 'pt'});
              playerRef.current.setOption('captions', 'reload', true);
              playerRef.current.setOption('captions', 'displaySettings', {'background': '#000000CC'});
            } else {
              playerRef.current.setOption('captions', 'track', {});
            }
          }
        }
      } catch (e) {
        console.error('Erro ao sincronizar legendas:', e);
      }
    } catch (error) {
      console.error("Erro ao sincronizar estado do player:", error);
    }
  }, [isPlaying, volume, playbackRate, videoQuality, captionsEnabled, playerReady, isChangingSettings]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerReady || !playerRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.floor((clickX / rect.width) * duration);
    
    // Atualizar a posição do vídeo
    playerRef.current.seekTo(newTime, true);
    setInternalTime(newTime);
    onTimeUpdate(newTime);
    
    // Se o vídeo estiver pausado e o usuário clicar na barra, 
    // presumimos que quer começar a reproduzir do ponto clicado
    if (!isPlaying) {
      playerRef.current.playVideo();
      // onPlay será chamado pelo evento onStateChange
    }
  };
  
  const togglePlayPause = () => {
    if (!playerReady || !playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  // Calcular posições das questões na barra
  const getQuestionStars = () => {
    return questions.map(question => ({
      ...question,
      position: (question.time / duration) * 100
    }));
  };
  
  // Funções para o menu de configurações
  const handlePlaybackRateChange = (rate: number) => {
    if (!playerReady || !playerRef.current) return;
    
    // Indicar que estamos alterando configurações
    setIsChangingSettings(true);
    
    // Salvamos o tempo atual e o estado de reprodução
    const currentTime = playerRef.current.getCurrentTime();
    const wasPlaying = isPlaying || (playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING);
    
    console.log('Alterando velocidade para:', rate, 'Estado de reprodução:', wasPlaying ? 'reproduzindo' : 'pausado');
    
    // Atualize o estado local primeiro
    setPlaybackRate(rate);
    
    try {
      // Alterar a velocidade
      playerRef.current.setPlaybackRate(rate);
      
      // A API do YouTube pode pausar o vídeo ao mudar a velocidade,
      // então vamos verificar e garantir que continue reproduzindo
      setTimeout(() => {
        try {
          // Verificar estado atual
          const currentState = playerRef.current.getPlayerState();
          const isCurrentlyPlaying = currentState === window.YT.PlayerState.PLAYING;
          
          if (wasPlaying && !isCurrentlyPlaying) {
            console.log('Retomando reprodução após alteração de velocidade');
            playerRef.current.playVideo();
            
            // Se não estiver no estado de reprodução no React, atualizar
            if (!isPlaying) {
              onPlay();
            }
          }
          
          // Finalizamos a alteração de configurações
          setIsChangingSettings(false);
        } catch (error) {
          console.error('Erro ao verificar estado após mudança de velocidade:', error);
          setIsChangingSettings(false);
        }
      }, 200); // pequeno delay para garantir que a API processou a mudança de velocidade
    } catch (error) {
      console.error('Erro ao alterar velocidade:', error);
      setIsChangingSettings(false);
    }
    
    // Fechar o menu de configurações
    setShowSettingsMenu(false);
  };
  
  const handleQualityChange = (quality: string) => {
    if (!playerReady || !playerRef.current) return;
    
    // Indicar que estamos alterando configurações
    setIsChangingSettings(true);
    
    // Salvamos o tempo atual e o estado de reprodução
    const currentTime = playerRef.current.getCurrentTime();
    // Verificar o estado real do player, que pode ser diferente do estado do React
    const wasPlaying = isPlaying || (playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING);
    
    console.log('Alterando qualidade para:', quality, 'Estado de reprodução:', wasPlaying ? 'reproduzindo' : 'pausado');
    
    // Atualize o estado local
    setVideoQuality(quality);
    
    try {
      // Alterar a qualidade
      playerRef.current.setPlaybackQuality(quality);
      
      // Em alguns casos, mudar a qualidade pode fazer o vídeo retroceder alguns segundos
      // Vamos garantir que ele continua do ponto certo
      playerRef.current.seekTo(currentTime, true);
      
      // Como mudar a qualidade pode pausar o vídeo em alguns casos,
      // vamos verificar e garantir que continue reproduzindo se estava antes
      setTimeout(() => {
        try {
          // Verificar estado atual
          const currentState = playerRef.current.getPlayerState();
          const isCurrentlyPlaying = currentState === window.YT.PlayerState.PLAYING;
          
          if (wasPlaying && !isCurrentlyPlaying) {
            console.log('Retomando reprodução após alteração de qualidade');
            playerRef.current.playVideo();
            
            // Se não estiver no estado de reprodução no React, atualizar
            if (!isPlaying) {
              onPlay();
            }
          }
          
          // Finalizamos a alteração de configurações
          setIsChangingSettings(false);
        } catch (error) {
          console.error('Erro ao verificar estado após mudança de qualidade:', error);
          setIsChangingSettings(false);
        }
      }, 300); // delay um pouco maior para qualidade, pois pode levar mais tempo para processar
    } catch (error) {
      console.error('Erro ao alterar qualidade:', error);
      setIsChangingSettings(false);
    }
    
    // Fechar o menu de configurações
    setShowSettingsMenu(false);
  };
  
  const toggleCaptions = () => {
    if (!playerReady || !playerRef.current) return;
    
    // Atualizar estado local
    const newCaptionsState = !captionsEnabled;
    setCaptionsEnabled(newCaptionsState);
    
    try {
      console.log('Tentando alternar legendas para:', newCaptionsState ? 'ativado' : 'desativado');
      
      // Método 1: Usar a API de legendas diretas se disponível
      if (typeof playerRef.current.getOptions === 'function') {
        const options = playerRef.current.getOptions();
        
        if (options.includes('captions')) {
          console.log('Usando API de legendas moderna');
          
          if (newCaptionsState) {
            // Tentar ativar legendas usando setOption (API moderna)
            playerRef.current.setOption('captions', 'reload', true);
            playerRef.current.setOption('captions', 'track', {'languageCode': 'pt'});
            playerRef.current.setOption('captions', 'displaySettings', {'background': '#000000CC'});
          } else {
            playerRef.current.setOption('captions', 'track', {});
          }
          
          // Fechar menu após alternar legendas
          setShowSettingsMenu(false);
          return; // Sucesso usando API moderna
        }
      }
      
      // Método 2: Injeção de CSS para mostrar/ocultar legendas
      // Esta é uma solução alternativa que controla as legendas existentes
      try {
        const iframe = playerRef.current.getIframe();
        if (iframe) {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
          
          if (iframeDocument) {
            // Remover qualquer estilo anterior que possa ter sido injetado
            const oldStyle = iframeDocument.getElementById('custom-caption-style');
            if (oldStyle) {
              oldStyle.remove();
            }
            
            if (newCaptionsState) {
              // Injetar CSS para mostrar legendas (se existirem)
              const style = iframeDocument.createElement('style');
              style.id = 'custom-caption-style';
              style.textContent = '.ytp-caption-window-container { display: block !important; }';
              iframeDocument.head.appendChild(style);
            } else {
              // Injetar CSS para ocultar legendas
              const style = iframeDocument.createElement('style');
              style.id = 'custom-caption-style';
              style.textContent = '.ytp-caption-window-container { display: none !important; }';
              iframeDocument.head.appendChild(style);
            }
            
            console.log('Legendas controladas via CSS injection');
            setShowSettingsMenu(false);
            return; // Sucesso usando injeção CSS
          }
        }
      } catch (cssError) {
        console.error('Erro ao tentar controlar legendas via CSS:', cssError);
      }
      
      // Método 3: Se os métodos anteriores falharem, enviamos mensagens postMessage
      try {
        const iframe = playerRef.current.getIframe();
        if (iframe) {
          const command = newCaptionsState ? 'enableCaptions' : 'disableCaptions';
          iframe.contentWindow?.postMessage(JSON.stringify({
            event: 'command',
            func: command,
            args: ['pt'] // linguagem
          }), '*');
          
          console.log('Tentativa de controle via postMessage');
          setShowSettingsMenu(false);
          return; // Tentativa via postMessage
        }
      } catch (postError) {
        console.error('Erro ao tentar controlar legendas via postMessage:', postError);
      }
      
      // Se chegamos aqui, nenhum método funcionou. Mostramos uma mensagem para o usuário
      console.log('Nenhum método de controle de legendas funcionou, recomendando uso do botão CC no player');
      
      // Criar notificação temporária
      const notification = document.createElement('div');
      notification.className = 'legend-notification';
      notification.innerHTML = `
        <div class="bg-engenha-bright-blue text-white p-3 rounded-lg shadow-lg max-w-xs z-50 fixed bottom-20 left-1/2 transform -translate-x-1/2">
          <p class="text-sm font-medium">Use o botão CC no player para ${newCaptionsState ? 'ativar' : 'desativar'} legendas</p>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Remover notificação após 3 segundos
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      
      // Fechar menu de configurações
      setShowSettingsMenu(false);
      
    } catch (error) {
      console.error("Erro ao configurar legendas:", error);
    }
  };
  
  const getQualityLabel = (quality: string): string => {
    switch (quality) {
      case 'hd1080': return '1080p';
      case 'hd720': return '720p';
      case 'large': return '480p';
      case 'medium': return '360p';
      case 'small': return '240p';
      case 'tiny': return '144p';
      case 'auto': return 'Auto';
      default: return quality;
    }
  };
  
  const toggleFullscreen = () => {
    // Elemento que queremos em tela cheia (o contêiner do player)
    const container = document.getElementById('video-player-container') as HTMLElement;
    
    if (!container) {
      console.error("Elemento do player não encontrado");
      return;
    }
    
    try {
      // Verificar se já estamos em tela cheia
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      
      if (isFullscreen) {
        // Sair do modo tela cheia
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      } else {
        // Entrar em modo tela cheia
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          (container as any).msRequestFullscreen();
        } else {
          console.error("API de tela cheia não suportada");
        }
      }
    } catch (error) {
      console.error("Erro ao alternar modo tela cheia:", error);
    }
  };

  return (
    <div className="relative bg-engenha-dark-navy aspect-video group overflow-visible" id="video-player-container">
      {/* Container para o player do YouTube */}
      <div 
        ref={playerContainerRef} 
        className="w-full h-full rounded-lg z-0"
        id="youtube-player"
      />

      {/* Overlay de carregamento */}
      {!playerReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-engenha-dark-navy/90 z-10">
          <div className="w-16 h-16 border-4 border-engenha-bright-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white font-medium">Carregando player...</p>
        </div>
      )}

      {/* Overlay de erro */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-engenha-dark-navy/90 z-30">
          <div className="bg-red-600/20 border border-red-600 rounded-lg p-6 max-w-md text-center">
            <h3 className="text-white font-bold text-xl mb-2">Erro no Player</h3>
            <p className="text-white/90 mb-4">{error}</p>
            <Button 
              variant="engenha"
              onClick={() => {
                setError(null);
                initPlayer();
              }}
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      )}

      {/* Overlay para informações das questões e controles */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity z-20",
          showControls ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Barra de progresso customizada com questões */}
        <div className="relative mb-4">
          <div 
            className="w-full h-3 bg-white/30 rounded-full cursor-pointer relative overflow-hidden"
            onClick={handleProgressClick}
          >
            {/* Progresso baseado no tempo atual */}
            <div 
              className="h-full bg-engenha-orange transition-all duration-300 rounded-full"
              style={{ width: `${(internalTime / duration) * 100}%` }}
            />
            
            {/* Estrelas das questões */}
            {getQuestionStars().map(star => (
              <div
                key={star.id}
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${star.position}%` }}
                title={`Pergunta aos ${formatTime(star.time)}`}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-transform",
                  triggeredQuestions.has(questionKey(star.id)) 
                    ? "bg-green-500" 
                    : "bg-engenha-gold animate-pulse"
                )}>
                  <span className="sr-only">Pergunta aos {formatTime(star.time)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informações e controles customizados */}
        <div className="flex items-center gap-4 text-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="text-white hover:text-white hover:bg-engenha-bright-blue/40 rounded-full"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <span className="text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
            {formatTime(internalTime)} / {formatTime(duration)}
          </span>
          
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-24 h-1 accent-engenha-bright-blue bg-white/30 rounded-full"
            />
          </div>
          
          <div className="flex-1" />
          
          {/* Botão de configurações */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              data-settings-button="true"
              onClick={(e) => {
                e.stopPropagation(); // Evitar propagação do evento
                setShowSettingsMenu(!showSettingsMenu);
              }}
              className="text-white hover:text-white hover:bg-engenha-bright-blue/40 rounded-full"
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            {/* Menu de configurações */}
            {showSettingsMenu && (
              <div 
                data-settings-menu="true"
                className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900/95 backdrop-blur-sm border-2 border-engenha-blue rounded-lg shadow-xl p-4 z-50"
                onClick={(e) => e.stopPropagation()} // Impedir que cliques no menu fechem o próprio menu
              >
                <div className="text-sm font-medium mb-3 text-white border-b border-engenha-blue pb-1">Configurações</div>
                
                {/* Velocidade de reprodução */}
                <div className="mb-4">
                  <div className="text-xs text-white font-medium mb-2">Velocidade</div>
                  <div className="flex flex-wrap gap-2 bg-black/30 p-2 rounded-md">
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(rate => (
                      <Button
                        key={rate}
                        variant={playbackRate === rate ? "engenha" : "engenha-outline"}
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handlePlaybackRateChange(rate);
                        }}
                        className="py-1 min-w-[38px]"
                      >
                        {rate}x
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Qualidade de vídeo */}
                <div className="mb-4">
                  <div className="text-xs text-white font-medium mb-2">Qualidade</div>
                  <div className="flex flex-wrap gap-2 bg-black/30 p-2 rounded-md">
                    <Button
                      variant={videoQuality === 'auto' ? "engenha" : "engenha-outline"}
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleQualityChange('auto');
                      }}
                      className="py-1"
                    >
                      Auto
                    </Button>
                    
                    {availableQualities.filter(q => q !== 'auto').map(quality => (
                      <Button
                        key={quality}
                        variant={videoQuality === quality ? "engenha" : "engenha-outline"}
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleQualityChange(quality);
                        }}
                        className="py-1"
                      >
                        {getQualityLabel(quality)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Legendas */}
                <div>
                  <div className="text-xs text-white font-medium mb-2">Legendas</div>
                  <div className="bg-black/30 p-2 rounded-md">
                    <Button
                      variant={captionsEnabled ? "engenha" : "engenha-outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleCaptions();
                      }}
                      className="w-full justify-start"
                    >
                      {captionsEnabled ? "Ativadas" : "Desativadas"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Fullscreen button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation(); // Evitar propagação do evento
              toggleFullscreen();
            }}
            className="text-white hover:text-white hover:bg-engenha-bright-blue/40 rounded-full"
          >
            <Maximize className="h-5 w-5" />
          </Button>
          
          {questions.length > 0 && (
            <div className="bg-engenha-orange/90 text-white px-3 py-1 rounded-full text-sm font-medium">
              {questions.length} questões
            </div>
          )}
        </div>
      </div>
    </div>
  );
};