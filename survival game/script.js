// script.js
let day = 1;
let wood = 0;
let food = 0;
let health = 100;
let shelter = 0;
let hasShelter = false;

function updateStats() {
    document.getElementById('day').innerText = day;
    document.getElementById('wood').innerText = wood;
    document.getElementById('food').innerText = food;
    document.getElementById('health').innerText = health;
    document.getElementById('shelter').innerText = shelter;
}

function gatherWood() {
    wood += 1;
    updateStats();
}

function gatherFood() {
    food += 1;
    updateStats();
}

function buildShelter() {
    if (wood >= 5) {
        wood -= 5;
        shelter += 1;
        hasShelter = true;
        updateStats();
        alert('Shelter built!');
    } else {
        alert('Not enough wood to build shelter.');
    }
}

function craftTool() {
    if (wood >= 3 && food >= 2) {
        wood -= 3;
        food -= 2;
        updateStats();
        alert('Tool crafted!');
    } else {
        alert('Not enough resources to craft tool.');
    }
}

function updateDayNightCycle() {
    const timeElement = document.getElementById('time');
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 6 && hours < 18) {
        timeElement.innerText = 'Day';
    } else {
        timeElement.innerText = 'Night';
        if (hasShelter) {
            health += 1; // Recover health at night if there is shelter
        } else {
            health -= 1; // Lose health at night if there is no shelter
        }
    }

    // Health management
    if (health <= 0) {
        alert('Game Over! You have died.');
        resetGame();
    }

    updateStats();
}

function resetGame() {
    day = 1;
    wood = 0;
    food = 0;
    health = 100;
    shelter = 0;
    hasShelter = false;
    updateStats();
}

function gameLoop() {
    setInterval(() => {
        day += 1;
        updateDayNightCycle();
    }, 10000); // Simulate a day-night cycle every 10 seconds
}

// Initialize game
document.getElementById('gatherWood').addEventListener('click', gatherWood);
document.getElementById('gatherFood').addEventListener('click', gatherFood);
document.getElementById('buildShelter').addEventListener('click', buildShelter);
document.getElementById('craftTool').addEventListener('click', craftTool);

gameLoop();
