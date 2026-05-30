/**
 * main.js - Game Initialization and Event Handling
 */

let game = null;
let animationFrameId = null;

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const resumeButton = document.getElementById('resume-button');
    const quitButton = document.getElementById('quit-button');
    const restartButton = document.getElementById('restart-button');
    const pauseMenu = document.getElementById('pause-menu');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create game instance
    game = new Game(canvas);

    // Event listeners
    playButton.addEventListener('click', () => {
        startGame();
    });

    pauseButton.addEventListener('click', () => {
        if (game.state === 'playing') {
            game.pause();
            if (game.paused) {
                pauseMenu.classList.remove('hidden');
                pauseButton.textContent = '▶️';
            } else {
                pauseMenu.classList.add('hidden');
                pauseButton.textContent = '⏸';
            }
        }
    });

    resumeButton.addEventListener('click', () => {
        game.pause();
        pauseMenu.classList.add('hidden');
        pauseButton.textContent = '⏸';
    });

    quitButton.addEventListener('click', () => {
        quitGame();
    });

    // Canvas events
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        game.setMousePosition(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        game.handleClick(e.clientX - rect.left, e.clientY - rect.top);
    });

    // Touch support for mobile
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        game.setMousePosition(touch.clientX - rect.left, touch.clientY - rect.top);
    });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        game.handleClick(touch.clientX - rect.left, touch.clientY - rect.top);
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.width = canvas.width;
        game.height = canvas.height;
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && game.state === 'playing') {
            e.preventDefault();
            game.pause();
            if (game.paused) {
                pauseMenu.classList.remove('hidden');
            } else {
                pauseMenu.classList.add('hidden');
            }
        }
        if (e.code === 'Escape' && game.paused) {
            quitGame();
        }
    });

    // Game loop
    let lastTime = performance.now();
    const gameLoop = (currentTime) => {
        const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.016); // Cap at 60 FPS
        lastTime = currentTime;

        if (game.state === 'playing') {
            game.update(deltaTime);
            game.render();
        }

        animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
});

function startGame() {
    showScreen('game-screen');
    game.start();
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('pause-button').textContent = '⏸';
}

function quitGame() {
    game.pause();
    showScreen('menu-screen');
    document.getElementById('pause-menu').classList.add('hidden');
}

function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}
