/**
 * Boss.js - Boss Enemy (Appears after portal destroyed)
 */

class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        this.vx = -100 + Math.random() * 200;
        this.vy = 30;
        this.hp = 20; // 20 clicks to destroy
        this.maxHp = 20;
        this.alive = true;
        this.rotation = 0;
        this.points = 100; // High reward
        this.attackTimer = 0;
        this.attackInterval = 3; // Attack every 3 seconds
        this.shootCount = 0;
        this.color = '#ff00ff'; // Bright magenta
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Bounce off sides
        if (this.x < 0 || this.x + this.width > canvasWidth) {
            this.vx *= -1;
        }
        this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));

        // Rotation animation
        this.rotation += 3 * deltaTime;

        // Attack timer
        this.attackTimer += deltaTime;
        if (this.attackTimer >= this.attackInterval) {
            this.shootCount = (this.shootCount + 1) % 3;
            this.attackTimer = 0;
        }

        // Remove if off-screen
        if (this.y > canvasHeight + this.height) {
            this.alive = false;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        // Boss body (large star/spiky shape)
        ctx.fillStyle = this.color;
        const size = 30;
        const spikes = 6;
        ctx.beginPath();
        for (let i = 0; i < spikes; i++) {
            const angle = (Math.PI * 2 * i) / spikes;
            const isPoint = i % 2 === 0;
            const rad = isPoint ? size : size * 0.6;
            const x = Math.cos(angle) * rad;
            const y = Math.sin(angle) * rad;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();

        // Glow aura
        ctx.strokeStyle = `rgba(255, 0, 255, 0.6)`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(-15, -10, 8, 8);
        ctx.fillRect(7, -10, 8, 8);

        // HP bar
        const barWidth = 50;
        const barHeight = 5;
        ctx.fillStyle = `rgba(255, 0, 0, 0.3)`;
        ctx.fillRect(-barWidth / 2, -size - 15, barWidth, barHeight);
        
        const healthPercent = this.hp / this.maxHp;
        ctx.fillStyle = `rgb(0, ${255 * healthPercent}, ${255 * (1 - healthPercent)})`;
        ctx.fillRect(-barWidth / 2, -size - 15, barWidth * healthPercent, barHeight);

        ctx.restore();
    }

    isClicked(mouseX, mouseY) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const distance = Math.hypot(mouseX - cx, mouseY - cy);
        return distance < 50; // Large click radius
    }

    hit() {
        this.hp--;
        if (this.hp <= 0) {
            this.alive = false;
            return true;
        }
        return false;
    }
}
