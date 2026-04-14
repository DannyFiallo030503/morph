import { Morph } from '../core/Morph.js';
import { Rect } from '../core/utils/math.js';

// ── Initialize the engine ────────────────────────────────────────────────────
const game = new Morph({
    canvasId: 'game-canvas',
    width: 800,
    height: 600,
    backgroundColor: '#1a2a3a'
});

game.enableDefaultRenderer();

// ── Game state ───────────────────────────────────────────────────────────────
let playerId;
let score = 0;
const stars = new Set();
const enemies = new Set();
let gameActive = true;

const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

// ── Create player ────────────────────────────────────────────────────────────
playerId = game.entities.createEntity({
    x: 400, y: 300, w: 30, h: 30,
    color: '#3498db',
    speed: 300,
    type: 'player'
});

// ── Spawn functions ──────────────────────────────────────────────────────────
function spawnStar() {
    const margin = 20;
    const x = margin + Math.random() * (game.config.width  - margin * 2 - 20);
    const y = margin + Math.random() * (game.config.height - margin * 2 - 20);
    const starId = game.entities.createEntity({
        x, y, w: 20, h: 20,
        color: '#e74c3c',
        type: 'star',
        text: '★'
    });
    stars.add(starId);
}

function spawnEnemy() {
    const margin = 20;
    const x = margin + Math.random() * (game.config.width  - margin * 2 - 30);
    const y = margin + Math.random() * (game.config.height - margin * 2 - 30);
    
    // Random normalized direction vector
    const angle = Math.random() * Math.PI * 2;
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    
    const enemyId = game.entities.createEntity({
        x, y, w: 30, h: 30,
        color: '#e67e22',
        type: 'enemy',
        text: '👾',
        speed: 180,       // 60% of player speed (300)
        dirX, dirY        // movement direction
    });
    enemies.add(enemyId);
}

// Create initial entities
for (let i = 0; i < 5; i++) spawnStar();
for (let i = 0; i < 3; i++) spawnEnemy();

// ── Game over handler ────────────────────────────────────────────────────────
function gameOver() {
    if (!gameActive) return;
    gameActive = false;
    game.stop();
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}

// ── Reset game ───────────────────────────────────────────────────────────────
function resetGame() {
    const allEntities = game.entities.getAll();
    for (const e of allEntities) {
        game.entities.removeEntity(e.id);
    }
    stars.clear();
    enemies.clear();
    
    score = 0;
    scoreElement.textContent = '0';
    gameActive = true;
    gameOverElement.style.display = 'none';
    
    playerId = game.entities.createEntity({
        x: 400, y: 300, w: 30, h: 30,
        color: '#3498db',
        speed: 300,
        type: 'player'
    });
    
    for (let i = 0; i < 5; i++) spawnStar();
    for (let i = 0; i < 3; i++) spawnEnemy();
    
    game.start();
}

// ── Player movement system ───────────────────────────────────────────────────
game.addSystem({
    update(dt, engine) {
        if (!gameActive) return;
        const player = engine.entities.getEntity(playerId);
        if (!player) return;

        let moveX = 0, moveY = 0;
        if (engine.input.isKeyDown('ArrowUp')    || engine.input.isKeyDown('w')) moveY -= 1;
        if (engine.input.isKeyDown('ArrowDown')  || engine.input.isKeyDown('s')) moveY += 1;
        if (engine.input.isKeyDown('ArrowLeft')  || engine.input.isKeyDown('a')) moveX -= 1;
        if (engine.input.isKeyDown('ArrowRight') || engine.input.isKeyDown('d')) moveX += 1;

        // Normalize diagonal movement
        if (moveX !== 0 || moveY !== 0) {
            const len = Math.hypot(moveX, moveY);
            moveX /= len;
            moveY /= len;
        }

        player.x += moveX * player.speed * dt;
        player.y += moveY * player.speed * dt;

        // Clamp to canvas bounds
        player.x = Math.max(0, Math.min(player.x, engine.config.width  - player.w));
        player.y = Math.max(0, Math.min(player.y, engine.config.height - player.h));
    }
});

// ── Enemy movement system (bounce off walls) ─────────────────────────────────
game.addSystem({
    update(dt, engine) {
        if (!gameActive) return;
        
        for (const enemyId of enemies) {
            const enemy = engine.entities.getEntity(enemyId);
            if (!enemy) {
                enemies.delete(enemyId);
                continue;
            }
            
            // Move in current direction
            enemy.x += enemy.dirX * enemy.speed * dt;
            enemy.y += enemy.dirY * enemy.speed * dt;
            
            // Bounce off horizontal edges
            if (enemy.x < 0) {
                enemy.x = 0;
                enemy.dirX *= -1;
            } else if (enemy.x + enemy.w > engine.config.width) {
                enemy.x = engine.config.width - enemy.w;
                enemy.dirX *= -1;
            }
            
            // Bounce off vertical edges
            if (enemy.y < 0) {
                enemy.y = 0;
                enemy.dirY *= -1;
            } else if (enemy.y + enemy.h > engine.config.height) {
                enemy.y = engine.config.height - enemy.h;
                enemy.dirY *= -1;
            }
        }
    }
});

// ── Collision system ─────────────────────────────────────────────────────────
game.addSystem({
    update(dt, engine) {
        if (!gameActive) return;
        
        const player = engine.entities.getEntity(playerId);
        if (!player) return;
        const playerRect = new Rect(player.x, player.y, player.w, player.h);

        // Star collisions
        for (const starId of [...stars]) {
            const star = engine.entities.getEntity(starId);
            if (!star) { stars.delete(starId); continue; }
            const starRect = new Rect(star.x, star.y, star.w, star.h);
            if (playerRect.intersects(starRect)) {
                engine.entities.removeEntity(starId);
                stars.delete(starId);
                score++;
                scoreElement.textContent = score;
                spawnStar();
                engine.events.emit('starCollected', { score });
            }
        }
        
        // Enemy collisions
        for (const enemyId of enemies) {
            const enemy = engine.entities.getEntity(enemyId);
            if (!enemy) continue;
            const enemyRect = new Rect(enemy.x, enemy.y, enemy.w, enemy.h);
            if (playerRect.intersects(enemyRect)) {
                gameOver();
                break;
            }
        }
    }
});

// ── Restart with R key ───────────────────────────────────────────────────────
window.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetGame();
    }
});

// ── FPS counter (console) ────────────────────────────────────────────────────
let frameCount = 0;
setInterval(() => {
    console.log(`FPS: ${frameCount}`);
    frameCount = 0;
}, 1000);
game.addSystem({ update() { if (gameActive) frameCount++; } });

// ── Start the game ───────────────────────────────────────────────────────────
game.start();

game.events.on('starCollected', ({ score }) => {
    console.log(`Star collected! Score: ${score}`);
});