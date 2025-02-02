// Pegando o contexto do canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Definindo as dimensões do canvas
canvas.width = 800;
canvas.height = 600;

// Carregar imagens
const playerImage = new Image();
const enemyImage = new Image();
playerImage.src = 'assets/ship.png';  // Substitua pelo caminho correto
enemyImage.src = 'assets/enemy.png';  // Substitua pelo caminho correto

// Carregar efeitos sonoros
const shootSound = new Audio('assets/shot.mp3');  // Som do disparo
const explosionSound = new Audio('assets/explosion.mp3');  // Som da explosão
const backgroundSound = new Audio('assets/background.mp3');

// Variáveis do jogador
const playerWidth = 50;
const playerHeight = 50;
let playerX = canvas.width / 2 - playerWidth / 2;
const playerY = canvas.height - playerHeight - 10;
const playerSpeed = 5;

// Variáveis do inimigo
const enemyWidth = 40;
const enemyHeight = 40;
let enemies = [];
const enemySpeed = 1;
const enemyRows = 5;
const enemyCols = 10;

// Variáveis do tiro
const bulletWidth = 5;
const bulletHeight = 10;
let bullets = [];
const bulletSpeed = 4;

// Função para desenhar o jogador
function drawPlayer() {
    ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
}

// Função para desenhar os inimigos
function drawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemyWidth, enemyHeight);
    }
}

// Função para desenhar os tiros
function drawBullets() {
    ctx.fillStyle = "#FFFF00";  // Cor amarela para os tiros
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    }
}

// Função para atualizar os tiros
function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bulletSpeed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

// Função para mover os inimigos
function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemySpeed;
        if (enemies[i].y > canvas.height - enemyHeight) {
            endGame();
            return;
        }
    }
}

// Função para gerar inimigos
function generateEnemies() {
    for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
            enemies.push({
                x: col * (enemyWidth + 10) + 150,
                y: row * (enemyHeight + 10) + 10
            });
        }
    }
}

// Função para detectar colisões entre tiros e inimigos
function detectCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            const bullet = bullets[i];
            const enemy = enemies[j];
            if (
                bullet.x < enemy.x + enemyWidth &&
                bullet.x + bulletWidth > enemy.x &&
                bullet.y < enemy.y + enemyHeight &&
                bullet.y + bulletHeight > enemy.y
            ) {
                explosionSound.play();  // Tocar som de explosão
                enemies.splice(j, 1);  // Remove o inimigo
                bullets.splice(i, 1);  // Remove o tiro
                i--;
                break;
            }
        }
    }
}

// Função para desenhar o jogo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpa o canvas
    drawPlayer();
    drawEnemies();
    drawBullets();
}

// Função de atualização do jogo
function update() {
    updateBullets();
    moveEnemies();
    detectCollisions();
    draw();
}

// Função de controle do movimento do jogador
let moveLeft = false;
let moveRight = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        moveLeft = true;
    }
    if (e.key === "ArrowRight") {
        moveRight = true;
    }
    if (e.key === " ") {
        shootSound.play();  // Tocar som de disparo
        bullets.push({
            x: playerX + playerWidth / 2 - bulletWidth / 2,
            y: playerY
        });
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") {
        moveLeft = false;
    }
    if (e.key === "ArrowRight") {
        moveRight = false;
    }
});

// Função para movimentar o jogador
function movePlayer() {
    if (moveLeft && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (moveRight && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }
}

// Função para finalizar o jogo
function endGame() {
    backgroundSound.pause();
    // alert("Game Over!");

    // document.location.reload();
}

// Função principal para o loop do jogo
function gameLoop() {
    backgroundSound.play();
    movePlayer();
    update();
    requestAnimationFrame(gameLoop);
}

// Inicializando o jogo
generateEnemies();
gameLoop();
