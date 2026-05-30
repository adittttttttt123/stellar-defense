/**
 * Enemy.js - Base Enemy Class
 */

class Enemy {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vx = 0;
        this.vy = 0;
        this.hp = 1;
        this.maxHp = 1;
        this.points = 10;
        this.alive = true;
        this.rotation = 0;
    }

    update(deltaTime, canvasWidth, canvasHeight) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // Remove if off-screen
        if (this.y > canvasHeight + this.height) {
            this.alive = false;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        // Draw enemy rectangle (placeholder)
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Draw border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.restore();
    }

    isClicked(mouseX, mouseY) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        );
    }

    hit() {
        this.hp--;
        if (this.hp <= 0) {
            this.alive = false;
            return true; // Enemy destroyed
        }
        return false;
    }

    getDistance(px, py) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        return Math.hypot(px - cx, py - cy);
    }
}
