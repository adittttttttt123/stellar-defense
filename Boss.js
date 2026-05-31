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
        
        // Animation states
        this.pulseTimer = 0;
        this.wobbleTimer = 0;
        this.tentacleWave = 0;
        this.blinkTimer = 0;
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Bounce off sides
        if (this.x < 0 || this.x + this.width > canvasWidth) {
            this.vx *= -1;
        }
        this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));

        // Wobble/tilt instead of continuous rotation
        this.wobbleTimer += 3 * deltaTime;
        this.rotation = Math.sin(this.wobbleTimer) * 0.15;

        this.pulseTimer += 5 * deltaTime;
        this.tentacleWave += 7 * deltaTime;

        // Eye blink timer logic
        this.blinkTimer += deltaTime;
        if (this.blinkTimer > 4.15) {
            this.blinkTimer = 0;
        }

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

        // --- 1. NEON GLOW EFFECTS ---
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 15;

        // --- 2. FLOATING TENTACLES (Drawn behind body) ---
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            let startX = -24 + i * 16;
            let startY = 15;
            ctx.moveTo(startX, startY);
            
            let cp1x = startX + Math.sin(this.tentacleWave + i * 1.5) * 12;
            let cp1y = startY + 12;
            let cp2x = startX + Math.cos(this.tentacleWave - i * 1.2) * 15;
            let cp2y = startY + 25;
            let endX = startX + Math.sin(this.tentacleWave + i * 1.8) * 18;
            let endY = startY + 38;
            
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
            ctx.stroke();

            // Glowing light nodes at tentacle tips
            ctx.save();
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(endX, endY, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // --- 3. ALIEN OUTER SHELL / CARAPACE ---
        ctx.fillStyle = '#2b0054'; // Deep dark purple alien shell
        ctx.strokeStyle = '#ff00ff'; // Neon pink highlights
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.moveTo(0, -32); // Top head horn
        ctx.quadraticCurveTo(25, -35, 38, -15); // Right crown
        ctx.quadraticCurveTo(42, 5, 25, 20); // Right jaw
        ctx.lineTo(8, 25); // Right mandible
        ctx.lineTo(12, 35); // Right fang
        ctx.lineTo(0, 22); // Chin split
        ctx.lineTo(-12, 35); // Left fang
        ctx.lineTo(-8, 25); // Left mandible
        ctx.lineTo(-25, 20); // Left jaw
        ctx.quadraticCurveTo(-42, 5, -38, -15); // Left crown
        ctx.quadraticCurveTo(-25, -35, 0, -32);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // --- 4. GLOWING CENTRAL BRAIN CORE ---
        const brainRadius = 13 + Math.sin(this.pulseTimer) * 1.5;
        
        // Translucent Dome
        ctx.fillStyle = 'rgba(0, 255, 255, 0.08)';
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -10, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Brain Fill with Radial Gradient
        let brainGrad = ctx.createRadialGradient(0, -10, 2, 0, -10, brainRadius);
        brainGrad.addColorStop(0, '#39ff14'); // Glowing green core
        brainGrad.addColorStop(0.7, '#00aa00');
        brainGrad.addColorStop(1, '#003300');

        ctx.save();
        ctx.fillStyle = brainGrad;
        ctx.shadowColor = '#39ff14';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, -10, brainRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Brain wrinkle details (gyri)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-5, -12);
        ctx.quadraticCurveTo(-2, -15, 2, -12);
        ctx.quadraticCurveTo(5, -9, 0, -6);
        ctx.moveTo(-8, -8);
        ctx.quadraticCurveTo(-4, -6, -2, -9);
        ctx.moveTo(8, -8);
        ctx.quadraticCurveTo(4, -6, 2, -9);
        ctx.stroke();

        // Glass reflection shine
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -10, 15, -Math.PI * 0.75, -Math.PI * 0.4);
        ctx.stroke();

        // --- 5. SINISTER GLOWING EYES (with blinking) ---
        const isBlinking = this.blinkTimer > 4.0;

        ctx.save();
        if (isBlinking) {
            ctx.strokeStyle = '#ff0033';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-25, 3);
            ctx.lineTo(-7, 7);
            ctx.moveTo(25, 3);
            ctx.lineTo(7, 7);
            ctx.stroke();
        } else {
            ctx.fillStyle = '#ff0033'; // Deep crimson alien eyes
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.shadowColor = '#ff0033';
            ctx.shadowBlur = 10;

            // Left Eye shape
            ctx.beginPath();
            ctx.moveTo(-26, 3);
            ctx.quadraticCurveTo(-15, -8, -6, 7);
            ctx.quadraticCurveTo(-16, 12, -26, 3);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Right Eye shape
            ctx.beginPath();
            ctx.moveTo(26, 3);
            ctx.quadraticCurveTo(15, -8, 6, 7);
            ctx.quadraticCurveTo(16, 12, 26, 3);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Pupil reflections
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(-14, 2, 1.8, 0, Math.PI * 2);
            ctx.arc(14, 2, 1.8, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // --- 6. SHIELD / ENERGY ORBIT SYSTEM ---
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, 48, 22, this.rotation * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#00ffff';
        const orbitalX1 = Math.cos(this.pulseTimer * 0.5) * 48;
        const orbitalY1 = Math.sin(this.pulseTimer * 0.5) * 22;
        ctx.beginPath();
        ctx.arc(orbitalX1, orbitalY1, 2.5, 0, Math.PI * 2);
        ctx.fill();

        const orbitalX2 = Math.cos(this.pulseTimer * 0.5 + Math.PI) * 48;
        const orbitalY2 = Math.sin(this.pulseTimer * 0.5 + Math.PI) * 22;
        ctx.beginPath();
        ctx.arc(orbitalX2, orbitalY2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // --- 7. HP BAR (Centered & Stylized) ---
        const barWidth = 60;
        const barHeight = 6;
        const barY = -52;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);
        ctx.strokeRect(-barWidth / 2, barY, barWidth, barHeight);
        
        const healthPercent = this.hp / this.maxHp;
        let hpGrad = ctx.createLinearGradient(-barWidth / 2, barY, barWidth / 2, barY);
        
        if (healthPercent > 0.5) {
            hpGrad.addColorStop(0, '#00ffcc');
            hpGrad.addColorStop(1, '#39ff14');
        } else if (healthPercent > 0.25) {
            hpGrad.addColorStop(0, '#ffaa00');
            hpGrad.addColorStop(1, '#ffff00');
        } else {
            hpGrad.addColorStop(0, '#ff0033');
            hpGrad.addColorStop(1, '#ff0055');
        }
        
        ctx.fillStyle = hpGrad;
        ctx.fillRect(-barWidth / 2, barY, barWidth * healthPercent, barHeight);

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
