# Stellar Defense: Cosmic Clicker

A retro 8-bit arcade space shooter game built with Vanilla JavaScript and Canvas API.

## 🎮 Game Features

- **Three Enemy Types:**
  - UFO: Horizontal flying saucer that bounces off screen edges
  - Meteor: Diagonal falling asteroids
  - Alien Tentacle: Mysterious creatures that can teleport

- **Game Mechanics:**
  - Click enemies to destroy them
  - Earn points (10pts UFO, 15pts Meteor, 25pts Alien)
  - Build combo multipliers (up to 5x) for quick consecutive kills
  - 3 health hearts - lose one when enemy reaches bottom
  - Difficulty increases over time

- **Visual Style:**
  - Retro 8-bit pixel aesthetic
  - Parallax scrolling starfield
  - Pixelated explosion particle effects
  - Glowing green crosshair targeting
  - Neon cyberpunk color scheme

## 🚀 How to Play

1. **Open the game:**
   - Open `index.html` in a web browser
   - Or run a local server: `python -m http.server 8080` then visit `http://localhost:8080`

2. **Click "PLAY GAME"** to start

3. **Gameplay:**
   - Move your mouse to aim the crosshair
   - Click on enemies to destroy them
   - Don't let enemies reach the bottom
   - Build combos by killing enemies quickly
   - Last as long as possible!

4. **Controls:**
   - **Mouse/Touch:** Aim and click to destroy enemies
   - **SPACE:** Pause/Resume game
   - **ESC:** Quit to menu

## 📁 Project Structure

```
stellar-defense/
├── index.html           # Main HTML file with canvas and UI
├── style.css            # Retro pixel styling and animations
├── Enemy.js             # Base Enemy class
├── EnemyTypes.js        # UFO, Meteor, AlienTentacle classes
├── Game.js              # Main game engine and loop
├── UI.js                # UI/HUD management
├── main.js              # Game initialization and event handling
└── README.md            # This file
```

## 🛠 Technical Details

- **Language:** Vanilla JavaScript (ES6+)
- **Graphics:** HTML5 Canvas API
- **Animation:** requestAnimationFrame (60 FPS)
- **Architecture:** Object-Oriented Programming with Classes
- **Rendering:** Pixel-perfect with crisp-edges image scaling

## 🎨 Customization

You can customize the game by editing:

- **Colors:** Change RGB/HEX values in CSS (`:root` variables) or JS files
- **Difficulty:** Adjust `spawnRate` values in `Game.js`
- **Enemy Properties:** Modify velocity, size, and points in `EnemyTypes.js`
- **Health/Scoring:** Edit values in `Game.js` class

## 🎵 Audio (Coming Soon)

Audio support structure is in place. To add sounds:
1. Create `.ogg` files in `assets/audio/`
2. Update `playSound()` method in `Game.js`

## 📊 Scoring System

- UFO: 10 points × combo multiplier
- Meteor: 15 points × combo multiplier
- Alien Tentacle: 25 points × combo multiplier
- Combo resets after 2 seconds of no kills
- Combo can build up to 5x multiplier

## 🐛 Known Issues / Future Features

- Audio system ready for implementation
- High score persistence (localStorage) can be added
- Mobile performance optimizations
- Enemy wave patterns
- Power-ups system

## ✨ Credits

Designed and built as a retro arcade tribute to classic Space Invaders-style games.

Enjoy! 🚀👽
