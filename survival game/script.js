// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 32;
const PLAYER_SIZE = 32;
const GRAVITY = 0.2;

// Game variables
let player = { x: canvas.width / 2, y: canvas.height / 2, width: PLAYER_SIZE, height: PLAYER_SIZE, speed: 5 };
let trees = [];
let animals = [];
let shelterAreas = [];
let wood = 0;
let food = 0;
let isBuilding = false;

// Load images
const images = {
    player: new Image(),
    tree: new Image(),
    animal: new Image(),
    shelter: new Image(),
    grass: new Image()
};

images.player.src = 'images/player.png';
images.tree.src = 'images/tree.png';
images.animal.src = 'images/animal.png';
images.shelter.src = 'images/shelter.png';
images.grass.src = 'images/grass.png';

// Image onload events
const imagePromises = Object.values(images).map(img => {
    return new Promise((resolve) => {
        img.onload = () => resolve(img);
    });
});

Promise.all(imagePromises).then(() => {
    init();
    gameLoop();
});

// Key states
const keys = {};

// Listen for keydown and keyup events
window.addEventListener('keydown', (e) => { keys[e.code] = true; });
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

// Initialize the game
function init() {
    // Generate some trees and animals
    for (let i = 0; i < 10; i++) {
        trees.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
        animals.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
    }
}

// Draw everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player
    ctx.drawImage(images.player, player.x, player.y, player.width, player.height);

    // Draw trees
    trees.forEach(tree => {
        ctx.drawImage(images.tree, tree.x, tree.y, TILE_SIZE, TILE_SIZE);
    });

    // Draw animals
    animals.forEach(animal => {
        ctx.drawImage(images.animal, animal.x, animal.y, TILE_SIZE, TILE_SIZE);
    });

    // Draw shelter areas (if any)
    shelterAreas.forEach(shelter => {
        ctx.drawImage(images.shelter, shelter.x, shelter.y, TILE_SIZE, TILE_SIZE);
    });

    // Draw UI or stats (if needed)
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Wood: ${wood}`, 10, 20);
    ctx.fillText(`Food: ${food}`, 10, 40);
}

function update() {
    // Player movement
    if (keys['ArrowUp'] || keys['KeyW']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['KeyS']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['KeyA']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['KeyD']) player.x += player.speed;

    // Collision with trees (for gathering wood)
    trees.forEach(tree => {
        if (collision(player, { x: tree.x, y: tree.y, width: TILE_SIZE, height: TILE_SIZE })) {
            wood += 1;
            tree.x = -100; // Remove tree from the screen
        }
    });

    // Collision with animals (for gathering food)
    animals.forEach(animal => {
        if (collision(player, { x: animal.x, y: animal.y, width: TILE_SIZE, height: TILE_SIZE })) {
            food += 1;
            animal.x = -100; // Remove animal from the screen
        }
    });

    // Building shelter
    if (isBuilding) {
        shelterAreas.push({ x: player.x, y: player.y });
        isBuilding = false;
    }

    draw();
}

// Check collision between player and objects
function collision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Start the game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Start the game
init();
gameLoop();

// Listen for building command (e.g., press 'B' to build)
window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyB') {
        isBuilding = true;
    }
});
