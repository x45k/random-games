document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const player = {
        x: 50,
        y: 50,
        width: 50,
        height: 50,
        color: 'blue',
        speed: 5,
        health: 100,
    };

    const weapons = {
        basicGun: { name: 'Basic Gun', damage: 10, cost: 0 },
        advancedGun: { name: 'Advanced Gun', damage: 20, cost: 100 },
        powerfulGun: { name: 'Powerful Gun', damage: 50, cost: 500 },
        ultimateGun: { name: 'Ultimate Gun', damage: 100, cost: 2000 } // New gun
    };

    let playerCoins = 0;
    let currentWeapon = weapons.basicGun;
    let lastBulletDirection = { x: 0, y: -1 }; // Default direction for initial shot
    let enemy = null;
    let enemies = [];
    let bullets = [];
    let enemyBullets = [];
    const bulletSpeed = 10;
    const bulletSize = { width: 5, height: 10 };
    let enemySpawnInterval = null;
    const difficultyLevel = 1; // Set difficulty level

    const playerImage = new Image();
    playerImage.src = './images/player.png';

    const enemyImage = new Image();
    enemyImage.src = './images/shelter.png';

    function getRandomPosition() {
        return {
            x: Math.random() * (canvas.width - 50),
            y: Math.random() * (canvas.height - 50)
        };
    }

    function getEnemySize() {
        return 50 + (difficultyLevel * 10); // Example formula for size increase
    }

    function drawPlayer() {
        if (playerImage.complete) {
            ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }
    }

    function drawEnemy(enemy) {
        if (enemyImage.complete) {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.size, enemy.size);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
        }

        ctx.fillStyle = 'black';
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.size, 5);
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y - 10, (enemy.health / (50 + difficultyLevel * 10)) * enemy.size, 5);
    }

    function drawBullets() {
        ctx.fillStyle = 'black';
        for (let bullet of bullets) {
            ctx.fillRect(bullet.x, bullet.y, bulletSize.width, bulletSize.height);
        }
    }

    function drawEnemyBullets() {
        ctx.fillStyle = 'red';
        for (let bullet of enemyBullets) {
            ctx.fillRect(bullet.x, bullet.y, bulletSize.width, bulletSize.height);
        }
    }

    function drawPlayerStats() {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`Health: ${player.health}`, canvas.width - 10, 30);
        ctx.fillText(`Coins: ${playerCoins}`, canvas.width - 10, 60);
        ctx.fillText(`Current Weapon: ${currentWeapon.name}`, 10, 30);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(canvas.width - 150, 10, 140, 60);
    }

    function updateBullets() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            let bullet = bullets[i];
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;

            if (enemy && bullet.x < enemy.x + enemy.size && bullet.x + bulletSize.width > enemy.x &&
                bullet.y < enemy.y + enemy.size && bullet.y + bulletSize.height > enemy.y) {
                enemy.health -= currentWeapon.damage;
                bullets.splice(i, 1);

                if (enemy.health <= 0) {
                    playerCoins += Math.max(100, enemy.size / 2); // Example coin drop amount
                    enemy = null;
                    spawnEnemy(); // Spawn a new enemy
                }
            }

            if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
                bullets.splice(i, 1);
            }
        }
    }

    function updateEnemyBullets() {
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            let bullet = enemyBullets[i];
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;

            if (bullet.x < player.x + player.width && bullet.x + bulletSize.width > player.x &&
                bullet.y < player.y + player.height && bullet.y + bulletSize.height > player.y) {
                player.health -= 10;
                enemyBullets.splice(i, 1);

                if (player.health <= 0) {
                    alert("Game Over! You were defeated by the enemy.");
                    resetGame();
                }
            }

            if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
                enemyBullets.splice(i, 1);
            }
        }
    }

    function enemyAttack() {
        setInterval(() => {
            if (enemy && player.health > 0) {
                let dx = player.x + player.width / 2 - (enemy.x + enemy.size / 2);
                let dy = player.y + player.height / 2 - (enemy.y + enemy.size / 2);
                let length = Math.sqrt(dx * dx + dy * dy);
                dx /= length;
                dy /= length;

                let bullet = {
                    x: enemy.x + enemy.size / 2 - bulletSize.width / 2,
                    y: enemy.y + enemy.size / 2 - bulletSize.height / 2,
                    dx: dx * bulletSpeed,
                    dy: dy * bulletSpeed
                };

                enemyBullets.push(bullet);
            }
        }, 2000);
    }

    function spawnEnemy() {
        let maxDistance = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));
        let distance = 0;

        do {
            enemy = {
                x: getRandomPosition().x,
                y: getRandomPosition().y,
                size: getEnemySize(),
                health: 50 + difficultyLevel * 10
            };

            distance = Math.sqrt(Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2));
        } while (distance > maxDistance / 2);

        enemyAttack();
    }

    function resetGame() {
        player.x = 50;
        player.y = 50;
        player.health = 100;
        playerCoins = 0;
        currentWeapon = weapons.basicGun;
        bullets = [];
        enemyBullets = [];
        enemy = null;
        spawnEnemy();
    }

    function handleGunPurchase(gun) {
        if (playerCoins >= gun.cost) {
            currentWeapon = gun;
            playerCoins -= gun.cost;
            document.getElementById('currentWeapon').textContent = `Current Weapon: ${currentWeapon.name}`;
        } else {
            alert("You don't have enough coins to buy this gun.");
        }
    }

    function handleMouseClick(e) {
        // Disable shooting with left click for gun purchasing
        if (e.button === 0) {
            e.preventDefault(); // Prevent default behavior
        }
    }

    document.getElementById('basicGunBtn').addEventListener('click', () => handleGunPurchase(weapons.basicGun));
    document.getElementById('advancedGunBtn').addEventListener('click', () => handleGunPurchase(weapons.advancedGun));
    document.getElementById('powerfulGunBtn').addEventListener('click', () => handleGunPurchase(weapons.powerfulGun));
    document.getElementById('ultimateGunBtn').addEventListener('click', () => handleGunPurchase(weapons.ultimateGun));

    let playerMovement = { x: 0, y: 0 };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') playerMovement.y = -1;
        if (e.key === 'ArrowDown') playerMovement.y = 1;
        if (e.key === 'ArrowLeft') playerMovement.x = -1;
        if (e.key === 'ArrowRight') playerMovement.x = 1;
        if (e.key === ' ') shoot();
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') playerMovement.y = 0;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') playerMovement.x = 0;
    });

    function shoot() {
        let bullet = {
            x: player.x + player.width / 2 - bulletSize.width / 2,
            y: player.y + player.height / 2 - bulletSize.height / 2,
            dx: lastBulletDirection.x * bulletSpeed,
            dy: lastBulletDirection.y * bulletSpeed
        };

        bullets.push(bullet);
    }

    function updatePlayerMovement() {
        player.x += playerMovement.x * player.speed;
        player.y += playerMovement.y * player.speed;
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!enemy) {
            spawnEnemy();
        }

        updatePlayerMovement();
        updateBullets();
        updateEnemyBullets();

        drawPlayer();
        if (enemy) drawEnemy(enemy);
        drawBullets();
        drawEnemyBullets();
        drawPlayerStats();

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
