const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let gameActive = false;
let player = { x: canvas.width/2, y: canvas.height - 100, w: 50, h: 50 };
let enemies = [];

// Handle Start
startBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    score = 0;
    enemies = [];
    gameActive = true;
    animate();
});

// Touch Control
window.addEventListener("touchmove", (e) => {
    let touch = e.touches[0];
    player.x = touch.clientX - player.w/2;
}, { passive: false });

function animate() {
    if (!gameActive) return;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Enemy Spawn
    if (Math.random() < 0.04) {
        enemies.push({ x: Math.random() * (canvas.width-40), y: -50, w: 40, h: 40 });
    }

    enemies.forEach((en, i) => {
        en.y += 5;
        ctx.fillStyle = "#0052ff"; // Base Blue Color
        ctx.fillRect(en.x, en.y, en.w, en.h);

        // Collision
        if (player.x < en.x + en.w && player.x + player.w > en.x && player.y < en.y + en.h) {
            gameActive = false;
            overlay.style.display = "flex";
            overlay.innerHTML = `<h1>GAME OVER</h1><p>Skor: ${score}</p><button onclick="location.reload()">COBA LAGI</button>`;
        }

        if (en.y > canvas.height) {
            enemies.splice(i, 1);
            score++;
            scoreEl.innerText = score;
        }
    });

    ctx.fillStyle = "#fff";
    ctx.fillRect(player.x, player.y, player.w, player.h);
    requestAnimationFrame(animate);
}