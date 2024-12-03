const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 40,
    height: 40,
    speed: 5,
    health: 100,
    shield: 50,
};

const weapons = {
    pistol: { damage: 10, fireRate: 300, bulletSpeed: 8, ammo: 30, maxAmmo: 30 },
};

let bullets = [];
let enemies = [];
let ammoBoxes = [];
let lastShot = 0;
let killStreak = 0;

// Input
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Shooting
function shoot() {
    const weapon = weapons.pistol;
    if (weapon.ammo > 0 && Date.now() - lastShot > weapon.fireRate) {
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 5,
            speed: weapon.bulletSpeed,
            damage: weapon.damage,
        });
        weapon.ammo--;
        lastShot = Date.now();
    }
}

// Spawn enemies
function spawnEnemy() {
    const size = 30;
    enemies.push({
        x: Math.random() * canvas.width,
        y: 0,
        width: size,
        height: size,
        speed: 1,
        health: 50,
        damage: 10,
    });
}

// Spawn ammo boxes
function spawnAmmoBox() {
    ammoBoxes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 30,
        height: 30,
    });
}

// Update the game state
function update() {
    // Player movement
    if (keys["w"]) player.y -= player.speed;
    if (keys["s"]) player.y += player.speed;
    if (keys["a"]) player.x -= player.speed;
    if (keys["d"]) player.x += player.speed;

    // Shooting
    if (keys[" "]) shoot();

    // Bullets movement
    bullets = bullets.filter((bullet) => {
        bullet.y -= bullet.speed;
        return bullet.y > 0;
    });

    // Drawing
    draw();
    if (player.health > 0) {
        requestAnimationFrame(update);
    } else {
        alert("Game Over!");
        window.location.reload();
    }
}

// Drawing everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    if (playerImage.complete) {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    } else {
        ctx.fillStyle = "green";
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // Draw enemies
    enemies.forEach((enemy) => {
        if (enemyImage.complete) {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        } else {
            ctx.fillStyle = "red";
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });

    // Draw bullets
    bullets.forEach((bullet) => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw ammo boxes
    ammoBoxes.forEach((box) => {
        ctx.fillStyle = "blue";
        ctx.fillRect(box.x, box.y, box.width, box.height);
    });
}

// Start the game loop
update();
setInterval(spawnEnemy, 2000);
setInterval(spawnAmmoBox, 10000);
