/**
 * Portal.js - Dimension Portal (Anomaly)
 */

class DimensionPortal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.vx = 0;
        this.vy = 100; // Slow downward drift
        this.hp = 5; // Requires 5 clicks to destroy
        this.maxHp = 5;
        this.alive = true;
        this.pulseAmount = 0;
        this.pulseSpeed = 8;
        this.rotation = 0;
        this.color = '#b300ff'; // Neon purple
        this.glitchIntensity = 0;
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        
        // Keep in bounds horizontally
        if (this.x < 0 || this.x + this.width > canvasWidth) {
            this.vx *= -1;
        }
        this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));

        // Rotation animation
        this.rotation += 5 * deltaTime;
        
        // Pulsing effect
        this.pulseAmount = Math.sin(this.pulseSpeed * Date.now() / 1000) * 5;
        
        // Glitch effect increases as health decreases
        this.glitchIntensity = (this.maxHp - this.hp) / this.maxHp;

        // Remove if off-screen
        if (this.y > canvasHeight + this.height) {
            this.alive = false;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        // Main portal circle with glow
        const baseSize = 20 + this.pulseAmount;
        
        // Outer glow
        ctx.fillStyle = `rgba(179, 0, 255, 0.3)`;
        ctx.beginPath();
        ctx.arc(0, 0, baseSize + 15, 0, Math.PI * 2);
        ctx.fill();

        // Mid glow
        ctx.fillStyle = `rgba(179, 0, 255, 0.5)`;
        ctx.beginPath();
        ctx.arc(0, 0, baseSize + 8, 0, Math.PI * 2);
        ctx.fill();

        // Inner portal
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, baseSize, 0, Math.PI * 2);
        ctx.fill();

        // Glitch effect (more intense if damaged)
        if (this.glitchIntensity > 0) {
            ctx.fillStyle = `rgba(255, 0, 255, ${this.glitchIntensity * 0.7})`;
            const glitchOffset = (Math.random() - 0.5) * this.glitchIntensity * 10;
            ctx.fillRect(-baseSize + glitchOffset, -baseSize + glitchOffset, baseSize * 2, baseSize * 2);
        }

        // Center dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, baseSize / 3, 0, Math.PI * 2);
        ctx.fill();

        // HP indicator
        ctx.strokeStyle = `rgba(179, 0, 255, ${0.5 + this.hp / this.maxHp * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, baseSize + 3, 0, (this.hp / this.maxHp) * Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    isClicked(mouseX, mouseY) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const distance = Math.hypot(mouseX - cx, mouseY - cy);
        return distance < 35; // Larger click radius
    }

    hit() {
        this.hp--;
        if (this.hp <= 0) {
            this.alive = false;
            return true; // Portal destroyed
        }
        return false;
    }
}
