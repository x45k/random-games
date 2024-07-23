let resources = 0;
let resourcePerClick = 1;

const upgrades = [
    { name: 'Upgrade 1', baseCost: 10, cost: 10, effect: () => resourcePerClick += 1, level: 1 },
    { name: 'Upgrade 2', baseCost: 50, cost: 50, effect: () => resourcePerClick += 5, level: 1 },
    { name: 'Upgrade 3', baseCost: 100, cost: 100, effect: () => resourcePerClick += 10, level: 1 },
    { name: 'Auto Clicker', baseCost: 200, cost: 200, effect: () => setInterval(() => clickResource(), 1000), level: 1 },
];

function updateUI() {
    document.getElementById('resources').innerText = resources;
    const upgradeList = document.getElementById('upgradeList');
    upgradeList.innerHTML = '';
    upgrades.forEach((upgrade, index) => {
        const upgradeButton = document.createElement('button');
        upgradeButton.innerText = `${upgrade.name} (Level: ${upgrade.level}, Cost: ${upgrade.cost})`;
        upgradeButton.onclick = () => buyUpgrade(index);
        if (resources < upgrade.cost) {
            upgradeButton.disabled = true;
        }
        upgradeList.appendChild(upgradeButton);
    });
}

function clickResource() {
    resources += resourcePerClick;
    updateUI();
    saveProgress();
}

function buyUpgrade(index) {
    const upgrade = upgrades[index];
    if (resources >= upgrade.cost) {
        resources -= upgrade.cost;
        upgrade.effect();
        upgrade.level++;
        upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level - 1));  // Increase cost for next level
        updateUI();
        saveProgress();
    }
}

function saveProgress() {
    const gameState = {
        resources,
        resourcePerClick,
        upgrades
    };
    localStorage.setItem('idleClickerGameState', JSON.stringify(gameState));
}

function loadProgress() {
    const savedState = localStorage.getItem('idleClickerGameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        resources = gameState.resources;
        resourcePerClick = gameState.resourcePerClick;
        gameState.upgrades.forEach((savedUpgrade, index) => {
            upgrades[index].cost = savedUpgrade.cost;
            upgrades[index].level = savedUpgrade.level;
        });
        updateUI();
    }
}

// Initial UI update
loadProgress();

// Passive income (optional, if you want to have base passive income)
setInterval(() => {
    resources += resourcePerClick;
    updateUI();
    saveProgress();
}, 1000);  // Increase resources every second
