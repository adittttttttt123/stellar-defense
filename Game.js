/**
 * Game.js - Main Game Engine
 */

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        // Game state
        this.state = 'menu'; // menu, playing, paused, gameover
        this.running = false;
        this.paused = false;
        this.lastFrameTime = 0;

        // Game variables
        this.score = 0;
        this.maxCombo = 0;
        this.combo = 1;
        this.comboTimer = 0;
        this.comboDuration = 2; // Reset combo after 2 seconds of no kills

        this.health = 3;
        this.maxHealth = 3;
        this.elapsedTime = 0;
        this.wave = 1;

        // Entities
        this.enemies = [];
        this.particles = [];
        this.mouseX = canvas.width / 2;
        this.mouseY = canvas.height / 2;

        // Dimension Portal
        this.portal = null;
        this.portalSpawned = false;
        this.portalSpawnTime = 20; // Spawn at 20 seconds
        this.inDimension = false; // Are we in boss dimension?
        this.boss = null;
        this.transitionAlpha = 0; // For screen flash effect
        this.transitionActive = false;

        // Spawning
        this.spawnTimer = 0;
        this.spawnRate = 1.5; // Seconds between spawns
        this.spawnTimer2 = 0;
        this.spawnRate2 = 2.5;
        this.spawnTimer3 = 0;
        this.spawnRate3 = 3.5;

        // Background
        this.stars = this.initStars();

        // UI
        this.ui = new UI(canvas, this);
    }

    initStars() {
        const stars = [];
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: -50 + Math.random() * 100, // Parallax effect
                vy: 20 + Math.random() * 40,
                size: Math.random() * 1.5,
                brightness: 0.5 + Math.random() * 0.5
            });
        }
        return stars;
    }

    start() {
        this.state = 'playing';
        this.running = true;
        this.paused = false;
        this.score = 0;
        this.combo = 1;
        this.maxCombo = 1;
        this.health = this.maxHealth;
        this.elapsedTime = 0;
        this.wave = 1;
        this.enemies = [];
        this.particles = [];
        this.spawnTimer = 0;
        this.spawnTimer2 = 0;
        this.spawnTimer3 = 0;
        this.comboTimer = 0;
        this.portal = null;
        this.portalSpawned = false;
        this.inDimension = false;
        this.boss = null;
        this.transitionAlpha = 0;
        this.transitionActive = false;
    }

    pause() {
        this.paused = !this.paused;
    }

    reset() {
        this.start();
    }

    update(deltaTime) {
        if (this.paused) return;

        this.elapsedTime += deltaTime;

        // Increase difficulty (spawn rate increases)
        const difficultyMultiplier = 1 + this.elapsedTime / 60;

        // Spawn portal at 20 seconds
        if (!this.portalSpawned && this.elapsedTime >= this.portalSpawnTime && !this.inDimension) {
            this.spawnPortal();
            this.portalSpawned = true;
        }

        // Handle transition effect
        if (this.transitionActive) {
            this.transitionAlpha -= deltaTime * 3; // Fade out
            if (this.transitionAlpha <= 0) {
                this.transitionAlpha = 0;
                this.transitionActive = false;
            }
        }

        // Update based on game mode
        if (!this.inDimension) {
            // Normal dimension
            this.updateNormalDimension(deltaTime, difficultyMultiplier);
        } else {
            // Boss dimension
            this.updateBossDimension(deltaTime);
        }

        // Update UI
        this.ui.update();
    }

    updateNormalDimension(deltaTime, difficultyMultiplier) {
        // Update stars (parallax)
        for (let star of this.stars) {
            star.y += star.vy * deltaTime;
            if (star.y > this.height) {
                star.y = 0;
                star.x = Math.random() * this.width;
            }
        }

        // Spawn enemies
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnRate / difficultyMultiplier) {
            this.spawnEnemy('ufo');
            this.spawnTimer = 0;
        }

        this.spawnTimer2 += deltaTime;
        if (this.spawnTimer2 >= this.spawnRate2 / difficultyMultiplier) {
            this.spawnEnemy('meteor');
            this.spawnTimer2 = 0;
        }

        this.spawnTimer3 += deltaTime;
        if (this.spawnTimer3 >= this.spawnRate3 / difficultyMultiplier) {
            this.spawnEnemy('alien');
            this.spawnTimer3 = 0;
        }

        // Update enemies
        for (let enemy of this.enemies) {
            enemy.update(deltaTime, this.width, this.height);
        }

        // Update portal
        if (this.portal && this.portal.alive) {
            this.portal.update(deltaTime, this.width, this.height);
        }

        // Update particles
        for (let particle of this.particles) {
            particle.update(deltaTime);
        }

        // Remove dead entities
        this.enemies = this.enemies.filter(e => e.alive);
        this.particles = this.particles.filter(p => p.alive);
        if (this.portal && !this.portal.alive) {
            this.triggerDimensionShift();
        }

        // Update combo
        this.comboTimer += deltaTime;
        if (this.comboTimer >= this.comboDuration) {
            this.combo = 1;
            this.comboTimer = 0;
        }

        // Update wave
        this.wave = Math.floor(this.elapsedTime / 20) + 1;
    }

    updateBossDimension(deltaTime) {
        // Update stars
        for (let star of this.stars) {
            star.y += star.vy * deltaTime;
            if (star.y > this.height) {
                star.y = 0;
                star.x = Math.random() * this.width;
            }
        }

        // Update boss
        if (this.boss && this.boss.alive) {
            this.boss.update(deltaTime, this.width, this.height);
        } else if (this.boss && !this.boss.alive) {
            // Boss defeated
            this.returnFromDimension();
        }

        // Update particles
        for (let particle of this.particles) {
            particle.update(deltaTime);
        }

        this.particles = this.particles.filter(p => p.alive);

        // Update combo
        this.comboTimer += deltaTime;
        if (this.comboTimer >= this.comboDuration) {
            this.combo = 1;
            this.comboTimer = 0;
        }
    }

    render() {
        // Clear canvas
        if (!this.inDimension) {
            this.ctx.fillStyle = '#0a0e27';
        } else {
            // Boss dimension - darker, different color
            this.ctx.fillStyle = '#1a0033';
        }
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw starfield
        this.renderStars();

        // Draw entities based on dimension
        if (!this.inDimension) {
            // Normal dimension
            for (let enemy of this.enemies) {
                enemy.render(this.ctx);
            }
            
            if (this.portal && this.portal.alive) {
                this.portal.render(this.ctx);
            }
        } else {
            // Boss dimension
            if (this.boss && this.boss.alive) {
                this.boss.render(this.ctx);
            }
        }

        // Draw particles
        for (let particle of this.particles) {
            particle.render(this.ctx);
        }

        // Draw crosshair
        this.renderCrosshair();

        // Draw transition effect
        if (this.transitionActive && this.transitionAlpha > 0) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.transitionAlpha})`;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    renderStars() {
        for (let star of this.stars) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        }
    }

    renderCrosshair() {
        const size = 15;
        const thickness = 2;

        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = thickness;

        // Vertical line
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouseX, this.mouseY - size);
        this.ctx.lineTo(this.mouseX, this.mouseY + size);
        this.ctx.stroke();

        // Horizontal line
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouseX - size, this.mouseY);
        this.ctx.lineTo(this.mouseX + size, this.mouseY);
        this.ctx.stroke();

        // Center dot
        this.ctx.fillStyle = '#ff0000';
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    spawnEnemy(type) {
        let enemy;
        const x = Math.random() * (this.width - 40);
        const y = -40;

        if (type === 'ufo') {
            enemy = new UFO(x, y);
        } else if (type === 'meteor') {
            enemy = new Meteor(x, y);
        } else if (type === 'alien') {
            enemy = new AlienTentacle(x, y);
        }

        if (enemy) {
            this.enemies.push(enemy);
        }
    }

    handleClick(mouseX, mouseY) {
        if (this.paused || !this.running) return;

        let destroyed = false;

        if (!this.inDimension) {
            // Normal dimension - click enemies and portal
            
            // Check portal first (highest priority)
            if (this.portal && this.portal.alive && this.portal.isClicked(mouseX, mouseY)) {
                if (this.portal.hit()) {
                    destroyed = true;
                    this.addScore(this.portal.hp + 200); // Extra points for portal
                    this.comboTimer = 0;
                    this.combo = Math.min(this.combo + 1, 5);
                    this.maxCombo = Math.max(this.maxCombo, this.combo);
                    this.createExplosion(mouseX, mouseY);
                    this.playSound('laser');
                    // Portal destroyed - trigger dimension shift
                } else {
                    // Portal hit but not destroyed
                    this.createExplosion(mouseX, mouseY);
                    this.playSound('laser');
                    destroyed = true;
                }
                return;
            }

            // Check enemies
            for (let enemy of this.enemies) {
                if (enemy.isClicked(mouseX, mouseY)) {
                    if (enemy.hit()) {
                        destroyed = true;
                        this.addScore(enemy.points * this.combo);
                        this.comboTimer = 0;
                        this.combo = Math.min(this.combo + 1, 5);
                        this.maxCombo = Math.max(this.maxCombo, this.combo);
                        this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                        this.playSound('laser');
                    }
                    break;
                }
            }
        } else {
            // Boss dimension - click boss
            if (this.boss && this.boss.alive && this.boss.isClicked(mouseX, mouseY)) {
                if (this.boss.hit()) {
                    destroyed = true;
                    this.addScore(this.boss.points * this.combo);
                    this.comboTimer = 0;
                    this.combo = Math.min(this.combo + 1, 5);
                    this.maxCombo = Math.max(this.maxCombo, this.combo);
                    this.createExplosion(mouseX, mouseY);
                    this.playSound('laser');
                } else {
                    this.createExplosion(mouseX, mouseY);
                    this.playSound('laser');
                    destroyed = true;
                }
            }
        }

        return destroyed;
    }

    createExplosion(x, y) {
        const particleCount = 8;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 150 + Math.random() * 100;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0.5,
                maxLife: 0.5,
                size: 3 + Math.random() * 3,
                color: Math.random() < 0.5 ? '#ff6600' : '#ffcc00',
                alive: true,
                update: function(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.life -= dt;
                    if (this.life <= 0) this.alive = false;
                },
                render: function(ctx) {
                    const alpha = this.life / this.maxLife;
                    ctx.fillStyle = this.color;
                    ctx.globalAlpha = alpha;
                    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
                    ctx.globalAlpha = 1;
                }
            });
        }
    }

    addScore(points) {
        this.score += points;
    }

    loseHealth() {
        this.health--;
        // No game over - game continues indefinitely
    }

    gameOver() {
        this.running = false;
        this.state = 'gameover';
        this.ui.renderGameOver();
    }

    setMousePosition(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }

    playSound(type) {
        // Audio support can be added here
        // For now, just a placeholder
    }

    spawnPortal() {
        const x = Math.random() * (this.width - 50);
        const y = -50;
        this.portal = new DimensionPortal(x, y);
    }

    triggerDimensionShift() {
        // Portal destroyed - trigger transition
        this.transitionActive = true;
        this.transitionAlpha = 1;
        this.inDimension = true;
        
        // Spawn boss
        const bossX = this.width / 2 - 40;
        const bossY = 100;
        this.boss = new Boss(bossX, bossY);
        
        // Clear normal enemies
        this.enemies = [];
        this.particles = [];
    }

    returnFromDimension() {
        // Boss defeated - return to normal dimension
        this.transitionActive = true;
        this.transitionAlpha = 1;
        this.inDimension = false;
        
        // Reset for normal dimension
        this.boss = null;
        this.portal = null;
        this.portalSpawned = false;
        this.enemies = [];
        this.particles = [];
        
        // Add major score bonus for boss defeat
        this.addScore(500);
    }
}
