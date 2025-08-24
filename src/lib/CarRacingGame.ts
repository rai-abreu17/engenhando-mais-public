import playerCarImg from '@/assets/player_car.png';
import opponentCarImg from '@/assets/opponent_car.png';

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

interface Collectible {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    type: 'coin' | 'boost';
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
    private collectibles: Collectible[];
    
    private score: number;
    private coins: number;
    private gameOver: boolean;
    private gameStarted: boolean;
    
    private road: Road;
    private obstacleSpawnInterval: number;
    private collectibleSpawnInterval: number;
    private lastObstacleSpawnTime: number;
    private lastCollectibleSpawnTime: number;
    private lastTime?: number;
    
    private keys: { [key: string]: boolean };
    private keyDownHandler?: (e: KeyboardEvent) => void;
    private keyUpHandler?: (e: KeyboardEvent) => void;

    constructor(canvas: HTMLCanvasElement, onGameOver: (score: number, coins: number) => void, onScoreUpdate: (score: number, coins: number) => void) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.onGameOver = onGameOver;
        this.onScoreUpdate = onScoreUpdate;

        this.width = canvas.width;
        this.height = canvas.height;

        this.player = {
            x: this.width / 2 - 25,
            y: this.height - 100,
            width: 50,
            height: 80,
            speed: 5,
            image: new Image()
        };
        this.player.image.src = playerCarImg;
        
        this.obstacles = [];
        this.collectibles = [];

        this.score = 0;
        this.coins = 0;
        this.gameOver = false;
        this.gameStarted = false;

        this.road = {
            left: this.width * 0.2,
            right: this.width * 0.8,
            width: this.width * 0.6,
            lineOffset: 0
        };

        this.obstacleSpawnInterval = 1000; // ms
        this.collectibleSpawnInterval = 2000; // ms
        this.lastObstacleSpawnTime = 0;
        this.lastCollectibleSpawnTime = 0;

        this.keys = {};

        this.initEventListeners();
        requestAnimationFrame(this.loop);
    }

    private initEventListeners(): void {
        const handleKeyDown = (e: KeyboardEvent) => {
            this.keys[e.key] = true;
            if (e.key === " " && this.gameOver) {
                this.resetGame();
            }
            if (!this.gameStarted && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
                this.gameStarted = true;
            }
        };
        
        const handleKeyUp = (e: KeyboardEvent) => {
            this.keys[e.key] = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        // Store references for cleanup
        this.keyDownHandler = handleKeyDown;
        this.keyUpHandler = handleKeyUp;
    }

    public resetGame(): void {
        this.player.x = this.width / 2 - 25;
        this.player.y = this.height - 100;
        this.obstacles = [];
        this.collectibles = [];
        this.score = 0;
        this.coins = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.lastObstacleSpawnTime = 0;
        this.lastCollectibleSpawnTime = 0;
        this.onScoreUpdate(this.score, this.coins);
    }

    private spawnObstacle(): void {
        const x = this.road.left + Math.random() * (this.road.width - 50);
        const speed = 2 + Math.random() * 3; // Varied speed
        const obstacleImage = new Image();
        obstacleImage.src = opponentCarImg;
        this.obstacles.push({
            x: x,
            y: -80,
            width: 50,
            height: 80,
            speed: speed,
            image: obstacleImage
        });
    }

    private spawnCollectible(): void {
        const x = this.road.left + Math.random() * (this.road.width - 30);
        const type = Math.random() < 0.7 ? "coin" : "boost"; // More coins
        this.collectibles.push({
            x: x,
            y: -30,
            width: 30,
            height: 30,
            speed: 3,
            type: type
        });
    }

    private update(deltaTime: number): void {
        if (this.gameOver || !this.gameStarted) return;

        // Player movement
        if (this.keys["ArrowLeft"] && this.player.x > this.road.left) {
            this.player.x -= this.player.speed;
        }
        if (this.keys["ArrowRight"] && this.player.x + this.player.width < this.road.right) {
            this.player.x += this.player.speed;
        }

        // Road lines animation
        this.road.lineOffset = (this.road.lineOffset + 5) % 80; // Adjust speed as needed

        // Spawn obstacles
        this.lastObstacleSpawnTime += deltaTime;
        if (this.lastObstacleSpawnTime > this.obstacleSpawnInterval) {
            this.spawnObstacle();
            this.lastObstacleSpawnTime = 0;
            this.obstacleSpawnInterval = Math.max(500, this.obstacleSpawnInterval - 10); // Increase difficulty
        }

        // Spawn collectibles
        this.lastCollectibleSpawnTime += deltaTime;
        if (this.lastCollectibleSpawnTime > this.collectibleSpawnInterval) {
            this.spawnCollectible();
            this.lastCollectibleSpawnTime = 0;
        }

        // Update and check collisions for obstacles
        this.obstacles.forEach((obstacle, index) => {
            obstacle.y += obstacle.speed;
            if (
                this.player.x < obstacle.x + obstacle.width &&
                this.player.x + this.player.width > obstacle.x &&
                this.player.y < obstacle.y + obstacle.height &&
                this.player.y + this.player.height > obstacle.y
            ) {
                this.gameOver = true;
                this.onGameOver(this.score, this.coins);
            }
            if (obstacle.y > this.height) {
                this.obstacles.splice(index, 1);
                this.score += 10; // Score for dodging
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

        // Draw grass
        this.ctx.fillStyle = "#009a17"; // Green
        this.ctx.fillRect(0, 0, this.road.left, this.height);
        this.ctx.fillRect(this.road.right, 0, this.width - this.road.right, this.height);

        // Draw road
        this.ctx.fillStyle = "#666666"; // Gray
        this.ctx.fillRect(this.road.left, 0, this.road.width, this.height);

        // Draw road lines
        this.ctx.fillStyle = "white";
        for (let i = 0; i < this.height / 80; i++) {
            this.ctx.fillRect(this.width / 2 - 5, (i * 80 + this.road.lineOffset) % (this.height + 80) - 80, 10, 40);
        }

        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            if (obstacle.image.complete) {
                this.ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            } else {
                this.ctx.fillStyle = "red"; // Fallback color
                this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
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
        if (this.player.image.complete) {
            this.ctx.drawImage(this.player.image, this.player.x, this.player.y, this.player.width, this.player.height);
        } else {
            this.ctx.fillStyle = "blue"; // Fallback color
            this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        }

        // Draw HUD
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        this.ctx.fillText(`Coins: ${this.coins}`, 10, 60);

        if (this.gameOver) {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = "white";
            this.ctx.font = "40px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText("Game Over!", this.width / 2, this.height / 2 - 40);
            this.ctx.font = "20px Arial";
            this.ctx.fillText(`Final Score: ${this.score}`, this.width / 2, this.height / 2);
            this.ctx.fillText(`Coins Collected: ${this.coins}`, this.width / 2, this.height / 2 + 30);
            this.ctx.fillText("Press SPACE to Restart", this.width / 2, this.height / 2 + 80);
            this.ctx.textAlign = "start";
        }

        if (!this.gameStarted) {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = "white";
            this.ctx.font = "30px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText("Use as setas para começar!", this.width / 2, this.height / 2);
            this.ctx.textAlign = "start";
        }
    }

    private loop = (currentTime: number): void => {
        const deltaTime = currentTime - (this.lastTime || currentTime);
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        if (!this.gameOver) {
            requestAnimationFrame(this.loop);
        }
    }

    public destroy(): void {
        // Remove event listeners
        if (this.keyDownHandler) {
            window.removeEventListener("keydown", this.keyDownHandler);
        }
        if (this.keyUpHandler) {
            window.removeEventListener("keyup", this.keyUpHandler);
        }
    }
}

export default CarRacingGame;