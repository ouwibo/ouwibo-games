// Pastikan DOM sudah siap
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreEl = document.getElementById("score");
    const overlay = document.getElementById("overlay");
    const startBtn = document.getElementById("startBtn");

    // Atur Ukuran Canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - document.querySelector('.header').offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    let score = 0;
    let gameActive = false;
    let player = { x: canvas.width / 2, y: canvas.height - 100, w: 50, h: 50 };
    let enemies = [];
    let keys = {};
    let mouseX = canvas.width / 2;
    let gameSpeed = 5;
    let spawnRate = 0.04;

    // Fungsi Mulai
    startBtn.onclick = () => {
        overlay.style.display = "none";
        score = 0;
        enemies = [];
        gameActive = true;
        gameSpeed = 5;
        spawnRate = 0.04;
        player.x = canvas.width / 2;
        animate();
    };

    function animate() {
        if (!gameActive) return;
        
        // Background
        ctx.fillStyle = "#0d0208";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update Pemain dengan Keyboard
        const moveSpeed = 6;
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= moveSpeed;
        if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += moveSpeed;
        if (keys['w'] || keys['W']) player.y -= moveSpeed;
        if (keys['s'] || keys['S']) player.y += moveSpeed;

        // Update Pemain dengan Mouse
        player.x = Math.max(0, Math.min(mouseX - player.w / 2, canvas.width - player.w));
        player.y = Math.max(0, Math.min(player.y, canvas.height - player.h));

        // Batasan Pemain
        if (player.x < 0) player.x = 0;
        if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

        // Spawn Musuh
        if (Math.random() < spawnRate) {
            enemies.push({ x: Math.random() * (canvas.width - 40), y: -50, w: 40, h: 40 });
        }

        // Update & Gambar Musuh
        enemies.forEach((en, i) => {
            en.y += gameSpeed;
            ctx.fillStyle = "#0052ff";
            ctx.fillRect(en.x, en.y, en.w, en.h);
            ctx.strokeStyle = "#00ff00";
            ctx.lineWidth = 2;
            ctx.strokeRect(en.x, en.y, en.w, en.h);

            // Cek Tabrakan
            if (player.x < en.x + en.w && player.x + player.w > en.x && 
                player.y < en.y + en.h && player.y + player.h > en.y) {
                gameActive = false;
                overlay.style.display = "flex";
                overlay.innerHTML = `<h1>GAME OVER</h1><p>Skor: ${score}</p><button id="reloadBtn">RETRY</button>`;
                document.getElementById("reloadBtn").onclick = () => location.reload();
            }

            if (en.y > canvas.height) {
                enemies.splice(i, 1);
                score++;
                scoreEl.innerText = score;
                // Kesulitan bertambah setiap 5 poin
                if (score % 5 === 0) {
                    gameSpeed = Math.min(gameSpeed + 0.5, 12);
                    spawnRate = Math.min(spawnRate + 0.01, 0.08);
                }
            }
        });

        // Gambar Player (Persegi dengan glow)
        ctx.fillStyle = "#fff";
        ctx.fillRect(player.x, player.y, player.w, player.h);
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 3;
        ctx.strokeRect(player.x, player.y, player.w, player.h);
        
        // Glow effect
        ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
        ctx.fillRect(player.x - 5, player.y - 5, player.w + 10, player.h + 10);

        requestAnimationFrame(animate);
    }
    
    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
    
    // Mouse Controls
    window.addEventListener('mousemove', (e) => {
        const headerHeight = document.querySelector('.header').offsetHeight;
        mouseX = e.clientX;
    });
    
    // Touch Controls (Mobile)
    window.addEventListener('touchmove', (e) => {
        if (gameActive) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            player.x = e.touches[0].clientX - player.w / 2;
            player.y = e.touches[0].clientY - headerHeight - player.h / 2;
        }
    }, { passive: false });
});