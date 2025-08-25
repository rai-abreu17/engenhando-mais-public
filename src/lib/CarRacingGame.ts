// SVG car sprites com o modelo fornecido
const createCarSVG = (primaryColor: string, windowColor: string = '#FFFFFF') => `
<svg width="34" height="56" viewBox="0 0 34 56" xmlns="http://www.w3.org/2000/svg">
  <g fill-rule="evenodd">
    <!-- Rodas traseiras (originais) -->
    <path fill="#222222" d="M0 36h8v16H0zM26 36h8v16h-8z"/>

    <!-- Carroceria -->
    <path fill="${primaryColor}" d="M8 0h18v56H8z"/>
    <path fill="${windowColor}" d="M14 0h6v52h-6z"/>
    <path fill="#222222" d="M11 20h12v10H11z"/>
    <path fill="#444444" d="M4 8h26v8H4z"/>
    <path fill="#444444" d="M8 44h18v8H8z"/>

    <!-- Rodas dianteiras: mesmas formas das traseiras, posicionadas mais à frente (y=8)
         e desenhadas depois da carroceria para aparecerem sobre ela quando preciso -->
    <path fill="#222222" d="M0 8h8v16H0zM26 8h8v16h-8z"/>
  </g>
</svg>
`;

const createImageFromSVG = (svgString: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image(34, 56);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG image'));
    };
    
    img.src = url;
  });
};

// Car colors
const PLAYER_CAR_COLOR = '#D82C2C'; // Red
const OPPONENT_COLORS = ['#2C5AD8', '#2CD85A', '#D8A52C', '#8A2CD8', '#D82CA5']; // Blue, Green, Orange, Purple, Pink

interface Player {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    image: HTMLImageElement;
}

interface Obstacle {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    image: HTMLImageElement;
}



interface Road {
    left: number;
    right: number;
    width: number;
    lineOffset: number;
}

class CarRacingGame {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private onGameOver: (score: number, coins: number) => void;
    private onScoreUpdate: (score: number, coins: number) => void;
    
    private width: number;
    private height: number;
    private player: Player;
    private obstacles: Obstacle[];
    private collectibles: any[] = []; // Re-added collectibles
    
    private score: number;
    private coins: number = 0; // Re-added coins
    private gameOver: boolean;
    private gameStarted: boolean;
    private isDebugMode: boolean = false; // Modo de depuração para visualizar áreas de colisão
    private logCounter: number = 0; // Contador para mensagens de log
    private maxLogsPerSecond: number = 30; // Limita os logs para não sobrecarregar o console
    private lastLogTime: number = 0;
    
    // Método público para ativar/desativar o modo de debug
    public toggleDebugMode(): void {
        this.isDebugMode = !this.isDebugMode;
        console.log(`Modo de depuração: ${this.isDebugMode ? 'Ativado' : 'Desativado'}`);
        
        // Reset log counter quando alternar o modo de debug
        this.logCounter = 0;
    }
    
    // Método para controle de direção (usado pelos botões na tela)
    public setDirection(direction: 'left' | 'right'): void {
        // Limpa estado atual
        this.keys["ArrowLeft"] = false;
        this.keys["ArrowRight"] = false;
        
        // Define nova direção
        if (direction === 'left') {
            this.keys["ArrowLeft"] = true;
        } else if (direction === 'right') {
            this.keys["ArrowRight"] = true;
        }
        
        // Inicia o jogo se ainda não começou
        if (!this.gameStarted) {
            console.log('🏁 JOGO INICIADO via botão de direção:', direction);
            this.gameStarted = true;
        }
    }
    
    private road: Road;
    private obstacleSpawnInterval: number;
    private lastObstacleSpawnTime: number;
    private lastCollectibleSpawnTime: number;
    private lastScoreUpdateTime: number = 0; // Para atualizar a pontuação periodicamente
    private lastTime?: number;
    private animationFrameId?: number;
    
    private keys: { [key: string]: boolean };
    private keyDownHandler?: (e: KeyboardEvent) => void;
    private keyUpHandler?: (e: KeyboardEvent) => void;

    constructor(canvas: HTMLCanvasElement, onGameOver: (score: number, coins: number) => void, onScoreUpdate: (score: number, coins: number) => void) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.onGameOver = onGameOver;
        this.onScoreUpdate = onScoreUpdate;
        
        // Log de inicialização do jogo
        console.log('🎮 JOGO INSTANCIADO:', 
                    '\n - Versão:', '1.0.5',
                    '\n - Data:', new Date().toLocaleString(),
                    '\n - Dispositivo:', 'ontouchstart' in window ? 'Móvel' : 'Desktop',
                    '\n - Modo debug disponível:', process.env.NODE_ENV === 'development' ? 'Sim' : 'Não');
        
        // Inicializa valores padrão
        this.width = canvas.width || window.innerWidth;
        this.height = canvas.height || window.innerHeight;
        
        // Calcula o tamanho do carro baseado em 10% da largura da tela
        const carWidth = Math.floor(this.width * 0.10);
        // Mantém proporção do SVG original (34x56 = ~1:1.65)
        const carHeight = Math.floor(carWidth * 1.65);

        // Define a estrada (40% da tela de largura)
        this.road = {
            left: this.width * 0.30,   // 30% da tela
            right: this.width * 0.70,  // 70% da tela
            width: this.width * 0.40,  // 40% da tela
            lineOffset: 0
        };

        // Posiciona o carro na via esquerda inicialmente
        const leftLaneCenter = this.road.left + (this.road.width * 0.25) - (carWidth / 2);
        
        this.player = {
            x: leftLaneCenter,
            y: this.height - carHeight - 5, // Posicionado mais próximo ao fundo da tela
            width: carWidth,
            height: carHeight,
            speed: 10,  // Aumentado para transição mais rápida entre vias
            image: new Image()
        };
        
        // Inicializa imagem do carro
        this.initializePlayerCar();
        
        this.obstacles = [];
        this.collectibles = [];

        this.score = 0;
        this.coins = 0;
        this.gameOver = false;
        this.gameStarted = false;

        // Intervalos iniciais para spawns
        this.obstacleSpawnInterval = 1800; // ms - Restaurado para o valor original (era 3000)
        this.lastObstacleSpawnTime = 0;
        this.lastCollectibleSpawnTime = 0; // Re-added collectible spawn time

        this.keys = {};
        
        // Inicializa event listeners e redimensiona o canvas
        this.initEventListeners();
        
        // Importante: força o redimensionamento inicial
        this.resizeCanvas();
        
        // Atualiza dimensões sempre que a tela for redimensionada
        window.addEventListener('resize', this.resizeCanvas);
    }

    private async initializePlayerCar(): Promise<void> {
        console.log('🚗 Inicializando carro do jogador...');
        
        // Primeiro cria uma versão fallback para garantir
        const fallbackImage = new Image(34, 56);
        
        try {
            // Carrega imagem SVG com um timeout para evitar ficar preso
            const loadWithTimeout = async () => {
                return new Promise<HTMLImageElement>((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        reject(new Error('Timeout ao carregar imagem do carro'));
                    }, 3000);
                    
                    try {
                        createImageFromSVG(createCarSVG(PLAYER_CAR_COLOR))
                            .then(img => {
                                clearTimeout(timeoutId);
                                resolve(img);
                            })
                            .catch(err => {
                                clearTimeout(timeoutId);
                                reject(err);
                            });
                    } catch (err) {
                        clearTimeout(timeoutId);
                        reject(err);
                    }
                });
            };
            
            // Tenta carregar a imagem do carro
            this.player.image = await loadWithTimeout();
            console.log('✅ Carro do jogador carregado com sucesso!');
        } catch (error) {
            console.error('❌ Falha ao carregar carro do jogador:', error);
            console.log('⚠️ Usando fallback para renderização do carro');
            // Continuamos mesmo com erro, vamos usar o fallback com desenho
            this.player.image = fallbackImage;
        } finally {
            // Sempre inicia o loop do jogo, mesmo em caso de erro
            console.log('🎬 Iniciando loop de renderização do jogo');
            requestAnimationFrame(this.loop);
        }
    }

    private initEventListeners(): void {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Support both arrow keys and WASD
            if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
                this.keys["ArrowLeft"] = true;
            }
            if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
                this.keys["ArrowRight"] = true;
            }
            
            if (e.key === " " && this.gameOver) {
                console.log('🎮 Reiniciando jogo via tecla espaço (no event handler interno)');
                this.resetGame();
            }
            
            if (!this.gameStarted && (e.key === "ArrowLeft" || e.key === "ArrowRight" || 
                e.key === "a" || e.key === "A" || e.key === "d" || e.key === "D")) {
                console.log('🏁 JOGO INICIADO via teclado! Tecla:', e.key);
                this.gameStarted = true;
            }
        };
        
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
                this.keys["ArrowLeft"] = false;
            }
            if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
                this.keys["ArrowRight"] = false;
            }
        };
        
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        this.canvas.addEventListener("touchstart", this.handleTouchStart, { passive: false });
        this.canvas.addEventListener("touchend", this.handleTouchEnd);

        // Store references for cleanup
        this.keyDownHandler = handleKeyDown;
        this.keyUpHandler = handleKeyUp;
        
        // Make sure canvas size adjusts to window size
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas);
    }
    
    private resizeCanvas = (): void => {
        const container = this.canvas.parentElement;
        if (!container) return;
        
        // Configura dimensões do canvas para preencher o container
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        // Atualiza dimensões do jogo
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Ajusta posição da estrada baseada nas novas dimensões
        // Usando 40% da largura para a estrada, centralizando-a
        this.road = {
            left: this.width * 0.30,   // 30% da tela
            right: this.width * 0.70,  // 70% da tela
            width: this.width * 0.40,  // 40% da tela
            lineOffset: this.road?.lineOffset || 0
        };
        
        // Ajusta posição do jogador após redimensionamento
        if (this.player) {
            // Ajustado para 10% da largura da tela
            const carWidth = Math.floor(this.width * 0.10); 
            // Mantém proporção do SVG original (34x56 = ~1:1.65)
            const carHeight = Math.floor(carWidth * 1.65); 
            
            this.player.width = carWidth;
            this.player.height = carHeight;
            
            // Define centros das vias
            const leftLaneCenter = this.road.left + (this.road.width * 0.25) - (carWidth / 2);
            const rightLaneCenter = this.road.left + (this.road.width * 0.75) - (carWidth / 2);
            
            // Mantém o jogador na via correta
            // Verifica se está mais próximo da via esquerda ou direita
            const isLeftLane = Math.abs(this.player.x - leftLaneCenter) < 
                               Math.abs(this.player.x - rightLaneCenter);
            
            this.player.x = isLeftLane ? leftLaneCenter : rightLaneCenter;
            
            // Ajusta posição vertical para ficar próximo ao final da tela
            this.player.y = this.height - carHeight - 5; // Reduzido o espaço para o carro ficar mais visível
        }
        
        // Redimensiona os obstáculos existentes
        if (this.obstacles?.length) {
            const carWidth = Math.floor(this.width * 0.10); 
            const carHeight = Math.floor(carWidth * 1.65); 
            
            this.obstacles.forEach(obstacle => {
                // Calcula proporção da posição atual em relação à estrada
                const leftLaneCenter = this.road.left + (this.road.width * 0.25);
                const rightLaneCenter = this.road.left + (this.road.width * 0.75);
                
                // Verifica qual via está mais próxima
                const isLeftLane = Math.abs(obstacle.x + (obstacle.width / 2) - leftLaneCenter) < 
                                  Math.abs(obstacle.x + (obstacle.width / 2) - rightLaneCenter);
                
                // Atualiza tamanho
                obstacle.width = carWidth;
                obstacle.height = carHeight;
                
                // Reposiciona na via correta
                obstacle.x = (isLeftLane ? leftLaneCenter : rightLaneCenter) - (carWidth / 2);
            });
        }
        

    }

    public resetGame(): void {
        // Log com informações sobre o reinício
        const reason = this.gameOver ? "colisão detectada" : "início manual";
        const mobileDevice = 'ontouchstart' in window;
        const scoreInfo = this.score > 0 ? `pontuação: ${this.score}` : "sem pontuação";
        const gameStatus = this.gameStarted ? "jogo em andamento" : "jogo não iniciado";
        const deviceType = mobileDevice ? "dispositivo móvel" : "desktop/laptop";
        
        console.log(`🔄 JOGO REINICIADO! Motivo: ${reason}, ${scoreInfo}`);
        console.log(`🎮 Informações: ${gameStatus}, Dispositivo: ${deviceType}, Debug Mode: ${this.isDebugMode ? 'ON' : 'OFF'}`);
        console.log('📊 ESTATÍSTICAS DO JOGO ANTERIOR:',
                    '\n - Colisões processadas:', this.logCounter,
                    '\n - Posição final do jogador:', Math.round(this.player.x), 'x', Math.round(this.player.y),
                    '\n - Obstáculos ativos:', this.obstacles.length,
                    '\n - Pontuação final:', this.score,
                    '\n - Intervalo de spawn:', Math.round(this.obstacleSpawnInterval));
                    
        // Salva os valores para o relatório
        const finalScore = this.score;
        
        // Resetando o jogo
        // Calcula o tamanho correto do carro
        const carWidth = Math.floor(this.width * 0.10);
        const carHeight = Math.floor(carWidth * 1.65);
        
        // Define centros das vias
        const leftLaneCenter = this.road.left + (this.road.width * 0.25) - (carWidth / 2);
        
        // Posiciona o carro na via esquerda
        this.player.x = leftLaneCenter;
        this.player.y = this.height - carHeight - 5; // Posiciona o carro mais próximo ao fundo da tela
        this.player.width = carWidth;
        this.player.height = carHeight;
        this.obstacles = [];
        this.collectibles = [];
        this.score = 0;
        this.coins = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.lastObstacleSpawnTime = 0;
        this.lastCollectibleSpawnTime = 0;
        this.lastScoreUpdateTime = 0;
        this.logCounter = 0;
        this.onScoreUpdate(this.score, this.coins);
        
        console.log('🎮 NOVO JOGO INICIADO! Estado inicial:', 
                    '\n - Posição do jogador:', Math.round(this.player.x), 'x', Math.round(this.player.y),
                    '\n - Debug mode:', this.isDebugMode ? 'ON' : 'OFF');
    }
    
    // Este método já está definido acima. Removido para evitar duplicação.
    
    // Método para logs controlados para evitar sobrecarga do console
    private debugLog(message: string, ...args: any[]): void {
        // Verifica se devemos imprimir o log (limita por segundo)
        const now = Date.now();
        if (now - this.lastLogTime > 1000 / this.maxLogsPerSecond) {
            this.logCounter++;
            console.log(`[LOG #${this.logCounter}] ${message}`, ...args);
            this.lastLogTime = now;
        }
    }

    private async spawnObstacle(): Promise<void> {
        // Ajustado para 10% da largura da tela
        const carWidth = Math.floor(this.width * 0.10);
        // Mantém proporção do SVG original (34x56 = ~1:1.65)
        const carHeight = Math.floor(carWidth * 1.65);
        
        // Define os centros exatos das vias
        const leftLaneCenter = this.road.left + (this.road.width * 0.25);
        const rightLaneCenter = this.road.left + (this.road.width * 0.75);
        
        // Verifica se há carros muito próximos na tela
        const hasRecentObstacles = this.obstacles.some(obstacle => 
            obstacle.y > -carHeight * 2 && obstacle.y < this.height * 0.3
        );
        
        // Se houver carros muito próximos, não cria um novo
        if (hasRecentObstacles) {
            return;
        }
        
        // Escolhe aleatoriamente uma das duas vias
        const laneCenter = Math.random() < 0.5 ? leftLaneCenter : rightLaneCenter;
        
        // Posiciona o carro exatamente no centro da via
        const x = laneCenter - (carWidth / 2);
        
        // Velocidade aumenta gradualmente com a pontuação
        const baseSpeed = 2 + Math.random() * 1.5; // Velocidade base
        const speedMultiplier = 1 + (this.score / 3000); // Aumento gradual
        const speed = baseSpeed * speedMultiplier;
        
        // Escolhe uma cor aleatória para o carro oponente
        const randomColor = OPPONENT_COLORS[Math.floor(Math.random() * OPPONENT_COLORS.length)];
        
        try {
            // Cria a imagem do carro a partir do SVG
            const obstacleImage = await createImageFromSVG(createCarSVG(randomColor));
            const newObstacle = {
                x: x,
                y: -carHeight, // Começa acima da área visível
                width: carWidth,
                height: carHeight,
                speed: speed,
                image: obstacleImage
            };
            
            // Log da criação de novo obstáculo
            this.logCounter++;
            console.log(`[LOG #${this.logCounter}] 🚙 NOVO OBSTÁCULO CRIADO:`, 
                        'x:', Math.round(x), 
                        'y:', Math.round(-carHeight),
                        'largura:', Math.round(carWidth),
                        'altura:', Math.round(carHeight),
                        'velocidade:', Math.round(speed),
                        'pista:', x < this.width/2 ? 'ESQUERDA' : 'DIREITA');
            
            this.obstacles.push(newObstacle);
        } catch (error) {
            console.error('Falha ao criar carro oponente:', error);
            // Cria com retângulo de fallback
            const fallbackImage = new Image();
            this.obstacles.push({
                x: x,
                y: -carHeight,
                width: carWidth,
                height: carHeight,
                speed: speed,
                image: fallbackImage
            });
        }
    }
    
    private spawnCollectible(): void {
        // Define os centros exatos das vias
        const leftLaneCenter = this.road.left + (this.road.width * 0.25);
        const rightLaneCenter = this.road.left + (this.road.width * 0.75);
        
        // Escolhe aleatoriamente uma das duas vias
        const laneCenter = Math.random() < 0.5 ? leftLaneCenter : rightLaneCenter;
        
        // Tamanho do coletável
        const collectibleSize = Math.floor(this.width * 0.03);
        
        // Posiciona no centro da via
        const x = laneCenter - (collectibleSize / 2);
        
        // Define o tipo (90% moeda, 10% boost)
        const type = Math.random() < 0.9 ? "coin" : "boost";
        
        this.collectibles.push({
            x,
            y: -collectibleSize,
            width: collectibleSize,
            height: collectibleSize,
            speed: 2,
            type
        });
    }

    private update(deltaTime: number): void {
        if (this.gameOver || !this.gameStarted) return;
        
        // Define lane centers
        const leftLaneCenter = this.road.left + (this.road.width * 0.25) - (this.player.width / 2);
        const rightLaneCenter = this.road.left + (this.road.width * 0.75) - (this.player.width / 2);
        
        // Atualizar a pontuação a cada 500ms enquanto o jogador se move
        this.lastScoreUpdateTime += deltaTime;
        if (this.lastScoreUpdateTime > 500) { // A cada 500ms
            this.score += 1; // Incrementa 1 ponto
            this.onScoreUpdate(this.score, this.coins); // Atualiza a interface
            this.lastScoreUpdateTime = 0;
        }
        
        // Determinar a via alvo com base nas teclas pressionadas
        // Se nenhuma tecla estiver pressionada, mantenha a posição atual
        let targetLane = null;
        
        if (this.keys["ArrowLeft"]) {
            targetLane = "left";
        } else if (this.keys["ArrowRight"]) {
            targetLane = "right";
        }
        
        // Se uma via alvo foi definida, calcule a posição correspondente
        if (targetLane !== null) {
            const targetX = targetLane === "left" ? leftLaneCenter : rightLaneCenter;
            const currentLane = Math.abs(this.player.x - leftLaneCenter) < Math.abs(this.player.x - rightLaneCenter) ? "left" : "right";
            
            // Log quando o jogador muda de pista
            if (targetLane !== currentLane) {
                this.logCounter++;
                console.log(`[LOG #${this.logCounter}] 🚗 MUDANÇA DE PISTA:`, 
                            'De:', currentLane.toUpperCase(), 
                            'Para:', targetLane.toUpperCase(),
                            'Posição atual X:', Math.round(this.player.x),
                            'Posição alvo X:', Math.round(targetX));
            }
            
            // Transição suave entre vias
            if (Math.abs(this.player.x - targetX) > 2) {
                const moveSpeed = Math.min(this.player.speed * (deltaTime / 16), Math.abs(this.player.x - targetX) / 3);
                
                if (this.player.x < targetX) {
                    this.player.x += moveSpeed;
                } else if (this.player.x > targetX) {
                    this.player.x -= moveSpeed;
                }
            } else {
                // Quando estiver próximo o suficiente, ajuste exatamente para a posição da via
                this.player.x = targetX;
            }
        }
        
        // Road lines animation - speed increases with game progress
        const baseSpeed = 5;
        const speedMultiplier = 1 + (this.score / 1000); // Gradually increase speed
        this.road.lineOffset = (this.road.lineOffset + (baseSpeed * speedMultiplier)) % 80;

        // Spawn obstacles
        this.lastObstacleSpawnTime += deltaTime;
        if (this.lastObstacleSpawnTime > this.obstacleSpawnInterval) {
            this.spawnObstacle();
            this.lastObstacleSpawnTime = 0;
            
            // Progressive difficulty: gradually reduce spawn interval, mas mantém um mínimo maior
            this.obstacleSpawnInterval = Math.max(2000, this.obstacleSpawnInterval - 10);
        }

        // Update and check collisions for obstacles
        // Spawn collectibles
        this.lastCollectibleSpawnTime += deltaTime;
        if (this.lastCollectibleSpawnTime > 2000) { // Every 2 seconds
            this.spawnCollectible();
            this.lastCollectibleSpawnTime = 0;
        }
        
        this.obstacles.forEach((obstacle, index) => {
            obstacle.y += obstacle.speed;
            
            // Colisão mais precisa considerando apenas as partes sólidas dos carros
            // Ignorar obstáculos que estão muito longe (acima da tela ou só começando a entrar)
            // Calculamos a sobreposição vertical entre os carros para verificação preliminar
            const verticalOverlap = Math.min(this.player.y + this.player.height, obstacle.y + obstacle.height) - 
                                  Math.max(this.player.y, obstacle.y);
            
            // Verificamos colisão somente quando há uma sobreposição vertical significativa
            const minVerticalOverlapRequired = Math.min(this.player.height, obstacle.height) * 0.25; // 25% da altura (era 15%)
            const obstacleInPlayerRange = verticalOverlap > minVerticalOverlapRequired;
            
            // Se o obstáculo estiver fora da área de colisão potencial, ignore
            if (!obstacleInPlayerRange) {
                // Continue para o próximo obstáculo
                return;
            }
            
            // Ignorar obstáculos que acabaram de aparecer na tela (muito próximos ao topo)
            if (obstacle.y < 20) {
                return;
            }
            
            // Calculamos as áreas da carroceria principal, excluindo os espaços vazios
            const playerCarBody = {
                x: this.player.x + this.player.width * (8/34),  // Início da carroceria principal (sem as rodas)
                y: this.player.y,
                width: this.player.width * (18/34),  // Largura da carroceria principal
                height: this.player.height
            };
            
            const obstacleCarBody = {
                x: obstacle.x + obstacle.width * (8/34),
                y: obstacle.y,
                width: obstacle.width * (18/34),
                height: obstacle.height
            };
            
            // Calculamos a área de sobreposição
            const overlapX = Math.min(playerCarBody.x + playerCarBody.width, obstacleCarBody.x + obstacleCarBody.width) - 
                            Math.max(playerCarBody.x, obstacleCarBody.x);
            const overlapY = Math.min(playerCarBody.y + playerCarBody.height, obstacleCarBody.y + obstacleCarBody.height) - 
                            Math.max(playerCarBody.y, obstacleCarBody.y);
            
            // Consideramos colisão apenas se houver uma sobreposição significativa
            const minOverlapRequired = Math.min(playerCarBody.width, obstacleCarBody.width) * 0.65; // 65% da largura para uma colisão mais real (era 50%)
            const minOverlapHeightRequired = Math.min(playerCarBody.height, obstacleCarBody.height) * 0.3; // 30% da altura (era 20%)
            
            // Calcular a porcentagem de sobreposição em relação à largura menor
            const overlapWidthPercentage = overlapX / Math.min(playerCarBody.width, obstacleCarBody.width) * 100;
            
            // Calcular também a porcentagem de sobreposição em altura
            const overlapHeightPercentage = overlapY / Math.min(playerCarBody.height, obstacleCarBody.height) * 100;
            
            // Logar informações de depuração para TODAS as verificações de colisão
            this.debugLog('📏 VERIFICANDO COLISÃO CORPO:', 
                'Dist X:', Math.round(Math.abs(playerCarBody.x - obstacleCarBody.x)), 
                'Dist Y:', Math.round(Math.abs(playerCarBody.y - obstacleCarBody.y)),
                'Overlap X:', Math.round(overlapX), 
                'Overlap Y:', Math.round(overlapY),
                'X%:', Math.round(overlapWidthPercentage) + '%',
                'Y%:', Math.round(overlapHeightPercentage) + '%',
                'Min X:', Math.round(minOverlapRequired),
                'Min Y:', Math.round(minOverlapHeightRequired));
                
            // Log especial quando houver alguma sobreposição
            if (overlapX > 0 && overlapY > 0) {
                this.logCounter++;
                console.log(`[LOG #${this.logCounter}] 👀 SOBREPOSIÇÃO DETECTADA:`, 
                    'X:', Math.round(overlapX), 
                    'Y:', Math.round(overlapY),
                    'Largura %:', Math.round(overlapWidthPercentage) + '%',
                    'Altura %:', Math.round(overlapHeightPercentage) + '%',
                    'Mínimo largura:', Math.round(minOverlapRequired),
                    'Mínimo altura:', Math.round(minOverlapHeightRequired));
            }
            
            const bodyCollision = 
                overlapX > minOverlapRequired && 
                overlapY > minOverlapHeightRequired &&
                playerCarBody.x < obstacleCarBody.x + obstacleCarBody.width &&
                playerCarBody.x + playerCarBody.width > obstacleCarBody.x &&
                playerCarBody.y < obstacleCarBody.y + obstacleCarBody.height &&
                playerCarBody.y + playerCarBody.height > obstacleCarBody.y;
                
            // Verificamos colisão com as rodas dianteiras do jogador
            const playerFrontWheels = [
                { // Roda esquerda
                    x: this.player.x,
                    y: this.player.y + this.player.height * (8/56),
                    width: this.player.width * (8/34),
                    height: this.player.height * (16/56)
                },
                { // Roda direita
                    x: this.player.x + this.player.width * (26/34),
                    y: this.player.y + this.player.height * (8/56),
                    width: this.player.width * (8/34),
                    height: this.player.height * (16/56)
                }
            ];
            
            // Verificamos colisão com as rodas traseiras do jogador
            const playerRearWheels = [
                { // Roda esquerda
                    x: this.player.x,
                    y: this.player.y + this.player.height * (36/56),
                    width: this.player.width * (8/34),
                    height: this.player.height * (16/56)
                },
                { // Roda direita
                    x: this.player.x + this.player.width * (26/34),
                    y: this.player.y + this.player.height * (36/56),
                    width: this.player.width * (8/34),
                    height: this.player.height * (16/56)
                }
            ];
            
            // Verificamos se há colisão entre qualquer roda do jogador e a carroceria do obstáculo
            let wheelCollision = false;
            
            // Verificamos as rodas dianteiras
            for (const wheel of playerFrontWheels) {
                // Calculamos a área de sobreposição para as rodas
                const wheelOverlapX = Math.min(wheel.x + wheel.width, obstacleCarBody.x + obstacleCarBody.width) - 
                                    Math.max(wheel.x, obstacleCarBody.x);
                const wheelOverlapY = Math.min(wheel.y + wheel.height, obstacleCarBody.y + obstacleCarBody.height) - 
                                    Math.max(wheel.y, obstacleCarBody.y);
                
                // Consideramos colisão apenas se houver uma sobreposição significativa
                const minWheelOverlapRequired = wheel.width * 0.7; // 70% da largura da roda (era 50%)
                const overlapPercentX = (wheelOverlapX / wheel.width) * 100;
                
                // Log detalhado para todas as verificações de rodas dianteiras
                this.logCounter++;
                console.log(`[LOG #${this.logCounter}] 🚕 VERIFICANDO RODA DIANTEIRA:`, 
                            'Sobreposição X:', Math.round(wheelOverlapX),
                            'Sobreposição Y:', Math.round(wheelOverlapY),
                            'Porcentagem overlap:', Math.round(overlapPercentX) + '%',
                            'Mínimo necessário:', Math.round(minWheelOverlapRequired));
                
                if (
                    wheelOverlapX > minWheelOverlapRequired && 
                    wheelOverlapY > wheel.height * 0.3 && // Exigir pelo menos 30% de sobreposição vertical
                    wheel.x < obstacleCarBody.x + obstacleCarBody.width &&
                    wheel.x + wheel.width > obstacleCarBody.x &&
                    wheel.y < obstacleCarBody.y + obstacleCarBody.height &&
                    wheel.y + wheel.height > obstacleCarBody.y
                ) {
                    this.logCounter++;
                    console.log(`[LOG #${this.logCounter}] 🚨 COLISÃO com roda dianteira:`, 
                                'Sobreposição X:', Math.round(wheelOverlapX),
                                'Mínimo necessário:', Math.round(minWheelOverlapRequired),
                                'Porcentagem:', Math.round(overlapPercentX) + '%');
                    wheelCollision = true;
                    break;
                }
            }
            
            // Verificamos as rodas traseiras
            if (!wheelCollision) {
                for (const wheel of playerRearWheels) {
                    // Calculamos a área de sobreposição para as rodas
                    const wheelOverlapX = Math.min(wheel.x + wheel.width, obstacleCarBody.x + obstacleCarBody.width) - 
                                        Math.max(wheel.x, obstacleCarBody.x);
                    const wheelOverlapY = Math.min(wheel.y + wheel.height, obstacleCarBody.y + obstacleCarBody.height) - 
                                        Math.max(wheel.y, obstacleCarBody.y);
                    
                    // Consideramos colisão apenas se houver uma sobreposição significativa
                    const minWheelOverlapRequired = wheel.width * 0.7; // 70% da largura da roda (era 50%)
                    const overlapPercentX = (wheelOverlapX / wheel.width) * 100;
                    
                    // Log detalhado para todas as verificações de rodas traseiras
                    this.logCounter++;
                    console.log(`[LOG #${this.logCounter}] 🚓 VERIFICANDO RODA TRASEIRA:`, 
                                'Sobreposição X:', Math.round(wheelOverlapX),
                                'Sobreposição Y:', Math.round(wheelOverlapY),
                                'Porcentagem overlap:', Math.round(overlapPercentX) + '%',
                                'Mínimo necessário:', Math.round(minWheelOverlapRequired));
                    
                    if (
                        wheelOverlapX > minWheelOverlapRequired && 
                        wheelOverlapY > wheel.height * 0.3 && // Exigir pelo menos 30% de sobreposição vertical
                        wheel.x < obstacleCarBody.x + obstacleCarBody.width &&
                        wheel.x + wheel.width > obstacleCarBody.x &&
                        wheel.y < obstacleCarBody.y + obstacleCarBody.height &&
                        wheel.y + wheel.height > obstacleCarBody.y
                    ) {
                        this.logCounter++;
                        console.log(`[LOG #${this.logCounter}] 🚨 COLISÃO com roda traseira:`, 
                                    'Sobreposição X:', Math.round(wheelOverlapX),
                                    'Mínimo necessário:', Math.round(minWheelOverlapRequired),
                                    'Porcentagem:', Math.round(overlapPercentX) + '%');
                        wheelCollision = true;
                        break;
                    }
                }
            }
            
            // Se houver colisão entre carrocerias ou entre rodas e carroceria, é game over
            if (bodyCollision || wheelCollision) {
                this.logCounter++;
                console.log(`[LOG #${this.logCounter}] 🔴 COLISÃO CONFIRMADA!`, 
                    '💥 Tipo:', bodyCollision ? 'CARROCERIA' : 'RODAS',
                    '🚗 Posição jogador Y:', Math.round(this.player.y),
                    '🚙 Posição obstáculo Y:', Math.round(obstacle.y),
                    '↔️ Sobreposição X:', bodyCollision ? Math.round(overlapX) : 'N/A',
                    '↕️ Sobreposição Y:', bodyCollision ? Math.round(overlapY) : 'N/A',
                    '📊 Largura %:', bodyCollision ? Math.round(overlapWidthPercentage) + '%' : 'N/A',
                    '📊 Altura %:', bodyCollision ? Math.round(overlapHeightPercentage) + '%' : 'N/A',
                    '↕️ Distância Y entre carros:', Math.round(Math.abs(this.player.y - obstacle.y)));
                
                // Informações adicionais sobre a posição das carrocerias
                console.log('📋 DETALHES DA COLISÃO:');
                console.log('  🚗 Player corpo:', 
                    'x:', Math.round(playerCarBody.x), 
                    'y:', Math.round(playerCarBody.y),
                    'width:', Math.round(playerCarBody.width),
                    'height:', Math.round(playerCarBody.height));
                console.log('  🚙 Obstáculo corpo:', 
                    'x:', Math.round(obstacleCarBody.x), 
                    'y:', Math.round(obstacleCarBody.y),
                    'width:', Math.round(obstacleCarBody.width),
                    'height:', Math.round(obstacleCarBody.height));
                
                // Causa detalhada do Game Over
                const collisionCause = bodyCollision 
                    ? `colisão com carroceria (${Math.round(overlapWidthPercentage)}% de sobreposição horizontal)`
                    : `colisão com rodas (${wheelCollision ? 'dianteiras ou traseiras' : 'N/A'})`;
                    
                console.log(`⛔ GAME OVER! Causa: ${collisionCause}`);
                console.log(`📈 Desempenho: ${this.score} pontos`);
                console.log(`🎮 Pressione ESPAÇO ou toque na tela para reiniciar o jogo`);
                
                // Se estiver no modo debug, verifica se a colisão é legítima
                if (this.isDebugMode) {
                    const collisionIntensity = bodyCollision ? 
                        overlapWidthPercentage * overlapHeightPercentage / 100 : 
                        80; // Para colisão com rodas, assumimos uma intensidade alta
                    
                    if (collisionIntensity < 50) {
                        console.log(`⚠️ AVISO: Colisão com intensidade relativamente baixa (${Math.round(collisionIntensity)}%)`);
                    } else {
                        console.log(`✓ Colisão com alta intensidade (${Math.round(collisionIntensity)}%)`);
                    }
                }
                
                // Marca o estado como game over (sem animação)
                this.gameOver = true;
                // Garante que o estado seja atualizado visualmente
                this.draw(); // Força renderização imediata da tela de game over
                // Notifica o componente React sobre o game over (o componente decide o que fazer)
                console.log('🔴 Enviando evento de GAME OVER para o componente React');
                this.onGameOver(this.score, this.coins);
            }
            
            if (obstacle.y > this.height) {
                this.obstacles.splice(index, 1);
                this.score += 10; // Score for dodging
                console.log(`📊 Pontuação atualizada: ${this.score} (+10)`);
                this.onScoreUpdate(this.score, this.coins);
            }
        });
        
        // Update and check collisions for collectibles
        this.collectibles.forEach((collectible, index) => {
            collectible.y += collectible.speed;
            if (
                this.player.x < collectible.x + collectible.width &&
                this.player.x + this.player.width > collectible.x &&
                this.player.y < collectible.y + collectible.height &&
                this.player.y + this.player.height > collectible.y
            ) {
                if (collectible.type === "coin") {
                    this.coins += 1;
                    this.score += 5;
                } else if (collectible.type === "boost") {
                    this.score += 20;
                }
                this.collectibles.splice(index, 1);
                this.onScoreUpdate(this.score, this.coins);
            }
            if (collectible.y > this.height) {
                this.collectibles.splice(index, 1);
            }
        });
    }

    private draw(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw grass with texture pattern
        const grassPattern = this.createGrassPattern();
        this.ctx.fillStyle = grassPattern || "#009a17";
        this.ctx.fillRect(0, 0, this.road.left, this.height);
        this.ctx.fillRect(this.road.right, 0, this.width - this.road.right, this.height);

        // Draw road with asphalt texture
        this.ctx.fillStyle = "#444444";
        this.ctx.fillRect(this.road.left, 0, this.road.width, this.height);
        
        // Draw road edges - linhas brancas nas bordas
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(this.road.left - 4, 0, 4, this.height);
        this.ctx.fillRect(this.road.right, 0, 4, this.height);

        // Linha divisória entre as faixas (exatamente no centro da pista)
        this.ctx.fillStyle = "#FFFFFF";
        const laneCenter = this.road.left + this.road.width / 2;
        for (let i = -1; i < (this.height / 40) + 1; i++) {
            const lineY = (i * 80 + this.road.lineOffset) % (this.height + 80) - 80;
            // Draw center divider
            this.ctx.fillRect(laneCenter - 5, lineY, 10, 40);
        }
        
        // Opcionalmente, desenhamos marcas de via para tornar visualmente mais claro
        const leftLane = this.road.left + this.road.width * 0.25;
        const rightLane = this.road.left + this.road.width * 0.75;
        
        // Pequenos indicadores de via (opcional)
        this.ctx.fillStyle = "rgba(255,255,255,0.2)";
        this.ctx.fillRect(leftLane - 1, this.height - 40, 2, 20);
        this.ctx.fillRect(rightLane - 1, this.height - 40, 2, 20);

        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            if (obstacle.image.complete && obstacle.image.src) {
                this.ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            } else {
                // Fallback drawing using the SVG model layout - usando uma cor azul para inimigos
                const randomColor = '#4A90E2'; // Azul para inimigos
                
                // Car body - main rectangle
                this.ctx.fillStyle = randomColor;
                this.ctx.fillRect(
                    obstacle.x + obstacle.width * (8/34), 
                    obstacle.y, 
                    obstacle.width * (18/34), 
                    obstacle.height
                );
                
                // Windows - center stripe
                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.fillRect(
                    obstacle.x + obstacle.width * (14/34), 
                    obstacle.y, 
                    obstacle.width * (6/34), 
                    obstacle.height * (52/56)
                );
                
                // Front window
                this.ctx.fillStyle = "#222222";
                this.ctx.fillRect(
                    obstacle.x + obstacle.width * (11/34), 
                    obstacle.y + obstacle.height * (20/56), 
                    obstacle.width * (12/34), 
                    obstacle.height * (10/56)
                );
                
                // Wheels
                this.ctx.fillStyle = "#222222";
                // Left rear wheel
                this.ctx.fillRect(
                    obstacle.x, 
                    obstacle.y + obstacle.height * (36/56), 
                    obstacle.width * (8/34), 
                    obstacle.height * (16/56)
                );
                
                // Right rear wheel
                this.ctx.fillRect(
                    obstacle.x + obstacle.width * (26/34), 
                    obstacle.y + obstacle.height * (36/56), 
                    obstacle.width * (8/34), 
                    obstacle.height * (16/56)
                );
                
                // Hood
                this.ctx.fillStyle = "#444444";
                this.ctx.fillRect(
                    obstacle.x + obstacle.width * (4/34), 
                    obstacle.y + obstacle.height * (8/56), 
                    obstacle.width * (26/34), 
                    obstacle.height * (8/56)
                );
                
                // Trunk
                this.ctx.fillStyle = "#444444";
                this.ctx.fillRect(
                    obstacle.x + obstacle.width * (8/34), 
                    obstacle.y + obstacle.height * (44/56), 
                    obstacle.width * (18/34), 
                    obstacle.height * (8/56)
                );
                
                // Front wheels (retângulos como no SVG) - desenhados por último para ficarem sobre a carroceria
                this.ctx.fillStyle = "#222222";
                // Left front wheel
                this.ctx.fillRect(
                    obstacle.x, 
                    obstacle.y + obstacle.height * (8/56), 
                    obstacle.width * (8/34), 
                    obstacle.height * (16/56)
                );
                
                // Right front wheel
                this.ctx.fillRect(
                    obstacle.x + obstacle.width * (26/34), 
                    obstacle.y + obstacle.height * (8/56), 
                    obstacle.width * (8/34), 
                    obstacle.height * (16/56)
                );
            }
        });
        
        // Draw collectibles
        this.collectibles.forEach(collectible => {
            if (collectible.type === "coin") {
                this.ctx.fillStyle = "gold";
                this.ctx.beginPath();
                this.ctx.arc(collectible.x + collectible.width / 2, collectible.y + collectible.height / 2, collectible.width / 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (collectible.type === "boost") {
                this.ctx.fillStyle = "lime";
                this.ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
            }
        });

        // Draw player car
        if (this.player.image.complete && this.player.image.src) {
            this.ctx.drawImage(this.player.image, this.player.x, this.player.y, this.player.width, this.player.height);
        } else {
            // Fallback drawing using the SVG model layout
            // Car body - main rectangle
            this.ctx.fillStyle = '#D82C2C'; // Vermelho do jogador
            this.ctx.fillRect(
                this.player.x + this.player.width * (8/34), 
                this.player.y, 
                this.player.width * (18/34), 
                this.player.height
            );
            
            // Windows - center stripe
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.fillRect(
                this.player.x + this.player.width * (14/34), 
                this.player.y, 
                this.player.width * (6/34), 
                this.player.height * (52/56)
            );
            
            // Front window
            this.ctx.fillStyle = "#222222";
            this.ctx.fillRect(
                this.player.x + this.player.width * (11/34), 
                this.player.y + this.player.height * (20/56), 
                this.player.width * (12/34), 
                this.player.height * (10/56)
            );
            
            // Wheels
            this.ctx.fillStyle = "#222222";
            // Left rear wheel
            this.ctx.fillRect(
                this.player.x, 
                this.player.y + this.player.height * (36/56), 
                this.player.width * (8/34), 
                this.player.height * (16/56)
            );
            
            // Right rear wheel
            this.ctx.fillRect(
                this.player.x + this.player.width * (26/34), 
                this.player.y + this.player.height * (36/56), 
                this.player.width * (8/34), 
                this.player.height * (16/56)
            );
            
            // Hood
            this.ctx.fillStyle = "#444444";
            this.ctx.fillRect(
                this.player.x + this.player.width * (4/34), 
                this.player.y + this.player.height * (8/56), 
                this.player.width * (26/34), 
                this.player.height * (8/56)
            );
            
            // Trunk
            this.ctx.fillStyle = "#444444";
            this.ctx.fillRect(
                this.player.x + this.player.width * (8/34), 
                this.player.y + this.player.height * (44/56), 
                this.player.width * (18/34), 
                this.player.height * (8/56)
            );
            
            // Front wheels (retângulos como no SVG) - desenhados por último para ficarem sobre a carroceria
            this.ctx.fillStyle = "#222222";
            // Left front wheel
            this.ctx.fillRect(
                this.player.x, 
                this.player.y + this.player.height * (8/56), 
                this.player.width * (8/34), 
                this.player.height * (16/56)
            );
            
            // Right front wheel
            this.ctx.fillRect(
                this.player.x + this.player.width * (26/34), 
                this.player.y + this.player.height * (8/56), 
                this.player.width * (8/34), 
                this.player.height * (16/56)
            );
        }

        // Desenha áreas de colisão se o modo de depuração estiver ativado
        if (this.isDebugMode) {
            this.drawCollisionAreas();
        }
        
        if (this.gameOver) {
            // Overlay escuro semitransparente
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            // Adiciona um retângulo vermelho para destacar o game over
            this.ctx.fillStyle = "rgba(220, 20, 20, 0.8)";
            const boxWidth = Math.min(this.width * 0.8, 400);
            const boxHeight = this.height * 0.4;
            this.ctx.fillRect((this.width - boxWidth) / 2, (this.height - boxHeight) / 2, boxWidth, boxHeight);
            
            // Borda do retângulo
            this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect((this.width - boxWidth) / 2, (this.height - boxHeight) / 2, boxWidth, boxHeight);
            
            // Texto "Game Over"
            this.ctx.fillStyle = "white";
            this.ctx.font = `bold ${Math.max(24, Math.floor(this.width / 16))}px Arial`;
            this.ctx.textAlign = "center";
            this.ctx.fillText("VOCÊ COLIDIU!", this.width / 2, this.height / 2 - this.height * 0.1);
            
            // Texto de pontuação e moedas
            this.ctx.font = `${Math.max(18, Math.floor(this.width / 25))}px Arial`;
            this.ctx.fillText(`Pontuação: ${this.score}  |  Moedas: ${this.coins}`, this.width / 2, this.height / 2);
            
            // Instruções para reiniciar
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            this.ctx.font = `${Math.max(16, Math.floor(this.width / 30))}px Arial`;
            const isMobile = 'ontouchstart' in window;
            const restartText = isMobile ? "Toque para jogar novamente" : "Pressione ESPAÇO para jogar novamente";
            this.ctx.fillText(restartText, this.width / 2, this.height / 2 + this.height * 0.1);
            this.ctx.textAlign = "start";
        }

        if (!this.gameStarted) {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = "white";
            this.ctx.font = `${Math.max(16, Math.floor(this.width / 25))}px Arial`;
            this.ctx.textAlign = "center";
            
            // Different text for mobile vs desktop
            const isMobile = 'ontouchstart' in window;
            const startText = isMobile ? "Toque para começar" : "Use as setas para começar";
            this.ctx.fillText(startText, this.width / 2, this.height / 2);
            this.ctx.textAlign = "start";
        }
    }
    
    // Helper to create a grass texture pattern
    private createGrassPattern(): CanvasPattern | null {
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = 20;
        patternCanvas.height = 20;
        const patternCtx = patternCanvas.getContext('2d');
        
        if (!patternCtx) return null;
        
        // Base green
        patternCtx.fillStyle = '#009a17';
        patternCtx.fillRect(0, 0, 20, 20);
        
        // Add texture details
        patternCtx.fillStyle = '#007a10';
        
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * 20;
            const y = Math.random() * 20;
            const size = 1 + Math.random() * 3;
            patternCtx.fillRect(x, y, size, size);
        }
        
        // Create pattern
        try {
            return this.ctx.createPattern(patternCanvas, 'repeat');
        } catch (e) {
            return null;
        }
    }
    
    // Método para depuração visual das áreas de colisão
    private drawCollisionAreas(): void {
        if (this.isDebugMode) {
            // Desenha área de colisão da carroceria do jogador
            // Preenche com cor semitransparente para melhor visualização
            this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            this.ctx.fillRect(
                this.player.x + this.player.width * (8/34),
                this.player.y,
                this.player.width * (18/34),
                this.player.height
            );
            
            this.ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                this.player.x + this.player.width * (8/34),
                this.player.y,
                this.player.width * (18/34),
                this.player.height
            );
            
            // Desenha área de colisão das rodas dianteiras
            this.ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
            // Roda dianteira esquerda
            this.ctx.fillRect(
                this.player.x,
                this.player.y + this.player.height * (8/56),
                this.player.width * (8/34),
                this.player.height * (16/56)
            );
            // Roda dianteira direita
            this.ctx.fillRect(
                this.player.x + this.player.width * (26/34),
                this.player.y + this.player.height * (8/56),
                this.player.width * (8/34),
                this.player.height * (16/56)
            );
            
            this.ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
            // Roda dianteira esquerda
            this.ctx.strokeRect(
                this.player.x,
                this.player.y + this.player.height * (8/56),
                this.player.width * (8/34),
                this.player.height * (16/56)
            );
            // Roda dianteira direita
            this.ctx.strokeRect(
                this.player.x + this.player.width * (26/34),
                this.player.y + this.player.height * (8/56),
                this.player.width * (8/34),
                this.player.height * (16/56)
            );
            
            // Desenha área de colisão das rodas traseiras
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
            // Roda traseira esquerda
            this.ctx.fillRect(
                this.player.x,
                this.player.y + this.player.height * (36/56),
                this.player.width * (8/34),
                this.player.height * (16/56)
            );
            // Roda traseira direita
            this.ctx.fillRect(
                this.player.x + this.player.width * (26/34),
                this.player.y + this.player.height * (36/56),
                this.player.width * (8/34),
                this.player.height * (16/56)
            );
            
            this.ctx.strokeStyle = "rgba(0, 0, 255, 0.8)";
            // Roda traseira esquerda
            this.ctx.strokeRect(
                this.player.x,
                this.player.y + this.player.height * (36/56),
                this.player.width * (8/34),
                this.player.height * (16/56)
            );
            // Roda traseira direita
            this.ctx.strokeRect(
                this.player.x + this.player.width * (26/34),
                this.player.y + this.player.height * (36/56),
                this.player.width * (8/34),
                this.player.height * (16/56)
            );
            
            // Desenha áreas de colisão dos obstáculos
            this.obstacles.forEach(obstacle => {
                // Corpo do obstáculo
                this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
                this.ctx.fillRect(
                    obstacle.x + obstacle.width * (8/34),
                    obstacle.y,
                    obstacle.width * (18/34),
                    obstacle.height
                );
                
                this.ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
                this.ctx.strokeRect(
                    obstacle.x + obstacle.width * (8/34),
                    obstacle.y,
                    obstacle.width * (18/34),
                    obstacle.height
                );
                
                // Rodas do obstáculo (opcional)
                this.ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
                // Rodas dianteiras
                this.ctx.fillRect(
                    obstacle.x,
                    obstacle.y + obstacle.height * (8/56),
                    obstacle.width * (8/34),
                    obstacle.height * (16/56)
                );
                this.ctx.fillRect(
                    obstacle.x + obstacle.width * (26/34),
                    obstacle.y + obstacle.height * (8/56),
                    obstacle.width * (8/34),
                    obstacle.height * (16/56)
                );
                
                // Rodas traseiras
                this.ctx.fillRect(
                    obstacle.x,
                    obstacle.y + obstacle.height * (36/56),
                    obstacle.width * (8/34),
                    obstacle.height * (16/56)
                );
                this.ctx.fillRect(
                    obstacle.x + obstacle.width * (26/34),
                    obstacle.y + obstacle.height * (36/56),
                    obstacle.width * (8/34),
                    obstacle.height * (16/56)
                );
            });
            
            // Mostrar informações de debug na tela
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            this.ctx.fillRect(5, 5, 200, 75);
            this.ctx.strokeStyle = "rgba(255, 255, 0, 0.8)";
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(5, 5, 200, 75);
            
            this.ctx.fillStyle = "yellow";
            this.ctx.font = "bold 14px Arial";
            this.ctx.fillText(`🐞 DEBUG MODE: ON`, 10, 25);
            
            this.ctx.fillStyle = "white";
            this.ctx.font = "12px Arial";
            this.ctx.fillText(`Score: ${this.score}`, 10, 45);
            this.ctx.fillText(`Log Count: ${this.logCounter}`, 10, 60);
        }
    }

    private loop = (currentTime: number): void => {
        const deltaTime = currentTime - (this.lastTime || currentTime);
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    public destroy(): void {
        console.log('🚮 Destruindo instância de CarRacingGame...');
        
        try {
            // Remove event listeners
            if (this.keyDownHandler) {
                window.removeEventListener("keydown", this.keyDownHandler);
            }
            if (this.keyUpHandler) {
                window.removeEventListener("keyup", this.keyUpHandler);
            }
            
            // Remove touch event listeners
            if (this.canvas) {
                try {
                    this.canvas.removeEventListener("touchstart", this.handleTouchStart);
                    this.canvas.removeEventListener("touchend", this.handleTouchEnd);
                } catch (e) {
                    console.warn('⚠️ Erro ao remover event listeners de touch:', e);
                }
            }
            
            // Remove resize listener
            try {
                window.removeEventListener('resize', this.resizeCanvas);
            } catch (e) {
                console.warn('⚠️ Erro ao remover event listener de resize:', e);
            }
            
            // Cancel animation frame if needed
            if (this.animationFrameId) {
                console.log('🛑 Cancelando frame de animação:', this.animationFrameId);
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = 0;
            }
            
            // Limpar referências a arrays de objetos
            this.obstacles = [];
            
            // Limpa variáveis de estado
            this.gameStarted = false;
            this.gameOver = false;
            
            console.log('✅ Recursos do jogo liberados com sucesso');
        } catch (err) {
            console.error('❌ Erro ao destruir jogo:', err);
        }
    }
    
    // Cria uma animação visual quando o carro colide
    private animateCollision(callback: () => void) {
        console.log('💥 Iniciando animação de colisão');
        const originalX = this.player.x;
        const originalY = this.player.y;
        const frames = 8; // Número de quadros da animação
        let currentFrame = 0;
        
        // Efeito sonoro de colisão (opcional)
        try {
            const audio = new Audio();
            audio.volume = 0.5;
            audio.src = "data:audio/wav;base64,UklGRnQHAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU8HAACA/4r/oP+y/8b/0v/X/+P/6v/r/+v/5//X/8z/vP+r/53/i/97/2z/Yf9Z/1X/Vf9a/2L/bf97/5H/qf/E/97/+/8ZAC8APgBKAFQAWgBhAGEAWgBVAE0AQgA4AC0AHgALAPv/6//a/8j/vP+y/6j/nv+W/5T/lP+W/5z/p/+y/7//y//Y/+j/9/8IABYAIgAxAD0ASABRAFgAYABgAGIAYABcAFkAUQBMAEUAPAA0ACwAIQAYAAoAAQDz/+v/4P/a/9L/zf/K/8n/yP/K/8r/0P/U/9r/4P/n/+7/9v/8/wQACgAOABIAFgAZAB0AHgAhACEAIQAgAB4AHAAYABUAFAAOAA0ACgAFAAQAAgD//wEA/v/+//z//P/8//v//P/8//7///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAA/v/+//3//f/9//3//f/9//3//f/9//3//f/9//3//f/+//7//v/+//7//v8AAP//AAAAAAAAAAAAAAAAAAAAAAAA///6//X/8f/q/+X/4//e/9v/2P/T/9P/0v/Q/8//zv/N/83/zP/N/8z/zf/M/87/zv/Q/9D/0f/S/9P/1v/X/9n/2f/b/97/3//h/+H/4//k/+X/5v/o/+j/6f/r/+z/7P/s/+7/7//w//H/8f/y//T/9P/2//f/9//4//r/+//9//3//v8AAP//AAD///3//P/+//v/+v/7//r/+P/2//X/8//y//D/7//u/+3/7P/q/+r/6P/o/+f/5v/l/+X/5P/k/+P/4//j/+P/4//k/+T/5P/j/+T/5P/l/+X/5v/n/+j/6f/q/+r/6//s/+3/7v/v//D/8P/y//P/9P/1//f/+P/5//n/+//8//z//v/+/wAAAAAAAAAAAAD/////AAD///7//f/9//z/+v/6//j/+P/1//X/8//z//H/8f/w/+7/7f/s/+r/6f/o/+f/5v/l/+X/5P/j/+P/4v/i/+L/4v/j/+T/5f/l/+b/5//o/+r/6//t/+3/7//x//L/9P/1//f/+f/7//z//f////7/AAAAAAAAAAAAAP///v/+//7//f/8//v/+v/5//j/9v/1//T/8//y//H/7//v/+7/7f/s/+v/6v/p/+n/6f/o/+j/6P/o/+j/6f/p/+r/6v/r/+z/7f/u/+//7//w//L/8//0//X/9v/3//j/+f/6//v//P/9//3//v/+/wAAAAAAAAAAAAAAAAEAAgABAAIAAwACAAMAAwADAAMAAwADAAMAAwADAAMAAgACAAIAAQABAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v/9//z/+//6//n/+P/3//b/9f/1//T/9P/z//L/8v/y//H/8f/x//H/8f/x//L/8v/z//P/9P/1//b/9v/3//j/+f/6//v//P/9//7//v8AAAEAAAADAAQABAAGAAQABQAGAAUABQAFAAUABQAFAAQABQAEAAQABAADAAQABAADAAMABAADAAQABAADAAMABAADAAQABAAEAAQABQAFAAUABQAGAAYABQAGAAYABQAGAAUABQAFAAQABQAEAAQABAADAAQABAADAAQABAAAAAAAAAAAAAAAAAAA//8AAP///v/+//3//P/8//v/+v/6//n/+P/4//j/+P/3//f/+P/3//j/+P/4//n/+v/6//v//P/9//3//v/+//7//v8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////AAD+//7//f/9//3//f/9//z//P/8//z//P/8//z//P/8//z//P/8//z//f/9//3//v/+//7//v8AAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
            audio.play();
        } catch (e) {
            console.warn('⚠️ Não foi possível reproduzir som de colisão', e);
        }
        
        const animateFrame = () => {
            if (currentFrame >= frames) {
                // Restaura o estado original
                this.player.x = originalX;
                this.player.y = originalY;
                
                // Executa o callback após a animação
                callback();
                return;
            }
            
            // Efeito de tremor - movemos o carro aleatoriamente
            const shakeAmount = 10 * (1 - currentFrame/frames); // Diminui gradualmente
            this.player.x = originalX + (Math.random() * shakeAmount - shakeAmount/2);
            this.player.y = originalY + (Math.random() * shakeAmount - shakeAmount/2);
            
            // Efeito de flash vermelho
            if (currentFrame % 2 === 0) {
                this.ctx.fillStyle = 'rgba(255,0,0,0.3)';
                this.ctx.fillRect(0, 0, this.width, this.height);
            }
            
            // Desenha o frame
            this.draw();
            
            // Próximo quadro
            currentFrame++;
            requestAnimationFrame(animateFrame);
        };
        
        // Inicia a animação
        requestAnimationFrame(animateFrame);
    }

    // Manipuladores de eventos de toque
    private handleTouchStart = (e: TouchEvent) => {
        const touchX = e.touches[0].clientX;
        const centerX = this.width / 2;
        
        // Para determinar a via alvo, verificamos a posição atual do carro
        // e a posição do toque
        const leftLaneCenter = this.road.left + (this.road.width * 0.25);
        const rightLaneCenter = this.road.left + (this.road.width * 0.75);
        
        // Verifica qual via o jogador está mais próximo
        const isPlayerInLeftLane = Math.abs(this.player.x + this.player.width/2 - leftLaneCenter) < 
                                  Math.abs(this.player.x + this.player.width/2 - rightLaneCenter);
        
        // Se o toque for na metade oposta da tela em relação à via atual, mude de via
        if (touchX < centerX && !isPlayerInLeftLane) {
            // Mudar para a via esquerda
            this.keys["ArrowLeft"] = true;
            this.keys["ArrowRight"] = false;
        } else if (touchX >= centerX && isPlayerInLeftLane) {
            // Mudar para a via direita
            this.keys["ArrowLeft"] = false;
            this.keys["ArrowRight"] = true;
        } else {
            // Manter na mesma via se o toque for no mesmo lado
            this.keys["ArrowLeft"] = isPlayerInLeftLane;
            this.keys["ArrowRight"] = !isPlayerInLeftLane;
        }
        
        // Inicia o jogo se ainda não começou
        if (!this.gameStarted) {
            console.log('🏁 JOGO INICIADO via toque na tela!');
            this.gameStarted = true;
        }
        
        // Reinicia o jogo após Game Over
        if (this.gameOver) {
            console.log('🎮 Reiniciando jogo via toque na tela');
            this.resetGame();
        }
        
        e.preventDefault(); // Previne comportamentos padrão como scroll
    };
    
    // Quando o toque termina, mantenha o carro na via atual
    // Isso facilita a experiência em dispositivos móveis
    private handleTouchEnd = () => {
        // Mantemos o estado atual das teclas para que o carro termine
        // o movimento para a via desejada
    };
}

export default CarRacingGame;