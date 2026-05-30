/**
 * UI.js - User Interface and HUD Rendering
 */

class UI {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;
        this.fontSize = 12;
        this.fontFamily = '"Press Start 2P", cursive';
    }

    update() {
        // Update DOM elements
        document.getElementById('score-display').textContent = this.game.score.toString().padStart(6, '0');
        document.getElementById('combo-display').textContent = `x${this.game.combo}`;
        document.getElementById('time-display').textContent = this.formatTime(this.game.elapsedTime);
        document.getElementById('wave-display').textContent = this.game.wave.toString();
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    renderGameOver() {
        document.getElementById('final-score').textContent = this.game.score.toString().padStart(6, '0');
        document.getElementById('final-time').textContent = this.formatTime(this.game.elapsedTime);
        document.getElementById('final-combo').textContent = `x${this.game.maxCombo}`;
    }

    // Optional: Canvas-based UI elements (for future enhancements)
    renderCanvasElements(ctx) {
        // Draw any screen-space UI that needs to be on canvas
        // Currently using DOM HUD instead
    }
}
