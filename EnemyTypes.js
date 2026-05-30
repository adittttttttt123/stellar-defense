/**
 * EnemyTypes.js - Specific Enemy Classes
 */

// UFO - Horizontal movement with rotation
class UFO extends Enemy {
    constructor(x, y) {
        super(x, y, 30, 20);
        this.vx = -150 + Math.random() * 100; // Horizontal movement
        this.vy = 50 + Math.random() * 50; // Slight downward drift
        this.points = 10;
        this.rotationSpeed = 5;
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        super.update(deltaTime, canvasWidth, canvasHeight);
        this.rotation += this.rotationSpeed * deltaTime;

        // Bounce off sides
        if (this.x < 0 || this.x + this.width > canvasWidth) {
            this.vx *= -1;
        }
        this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        // UFO body (circle with antenna)
        ctx.fillStyle = '#ff00ff';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        // Window
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(-5, -5, 10, 8);

        ctx.restore();
    }
}

// Meteor - Falling diagonally from top
class Meteor extends Enemy {
    constructor(x, y) {
        super(x, y, 25, 25);
        this.vx = -200 + Math.random() * 400; // Random horizontal
        this.vy = 200 + Math.random() * 100; // Falling speed
        this.points = 15;
        this.rotationSpeed = 8;
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        super.update(deltaTime, canvasWidth, canvasHeight);
        this.rotation += this.rotationSpeed * deltaTime;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        // Meteor (brown/orange rocky)
        ctx.fillStyle = '#ff9900';
        ctx.beginPath();
        // Irregular asteroid shape
        ctx.moveTo(0, -12);
        ctx.lineTo(10, -5);
        ctx.lineTo(12, 5);
        ctx.lineTo(5, 12);
        ctx.lineTo(-5, 12);
        ctx.lineTo(-12, 5);
        ctx.lineTo(-10, -5);
        ctx.closePath();
        ctx.fill();

        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    }
}

// Alien Tentacle - Moves with occasional teleportation
class AlienTentacle extends Enemy {
    constructor(x, y) {
        super(x, y, 28, 35);
        this.vx = -100 + Math.random() * 200;
        this.vy = 100 + Math.random() * 80;
        this.points = 25;
        this.teleportCooldown = 0;
        this.teleportInterval = 3; // Teleport every 3 seconds
        this.waveOffset = 0;
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        this.waveOffset += 5 * deltaTime;
        this.teleportCooldown += deltaTime;

        // Teleport randomly
        if (this.teleportCooldown >= this.teleportInterval) {
            this.teleportCooldown = 0;
            // 50% chance to teleport
            if (Math.random() < 0.5) {
                this.x = Math.random() * (canvasWidth - this.width);
                this.y = Math.random() * (canvasHeight / 2);
            }
        }

        super.update(deltaTime, canvasWidth, canvasHeight);

        // Bounce off sides
        if (this.x < 0 || this.x + this.width > canvasWidth) {
            this.vx *= -1;
        }
        this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        // Body (cyan blob)
        ctx.fillStyle = '#00ffff';
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;

        // Tentacles (wavy lines)
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            const startX = -8 + i * 8;
            const amp = 3 + i;
            for (let y = 0; y < 15; y++) {
                const wave = Math.sin((y + this.waveOffset) * 0.3) * amp;
                if (y === 0) {
                    ctx.moveTo(startX + wave, y);
                } else {
                    ctx.lineTo(startX + wave, y);
                }
            }
            ctx.stroke();
        }

        // Eyes
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(-4, -3, 2, 2);
        ctx.fillRect(2, -3, 2, 2);

        ctx.restore();
    }
}
