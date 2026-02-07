'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayContent, setOverlayContent] = useState({ title: 'CYBER DODGE', button: 'MAIN SEKARANG' });
  
  const gameStateRef = useRef({
    score: 0,
    gameActive: false,
    player: { x: 0, y: 0, w: 50, h: 50 },
    enemies: [] as Array<{ x: number; y: number; w: number; h: number }>,
    keys: {} as Record<string, boolean>,
    mouseX: 0,
    gameSpeed: 5,
    spawnRate: 0.04,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;
    let animationId: number;

    // Atur ukuran canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - (document.querySelector('.header')?.clientHeight || 0);
      gameState.player.x = canvas.width / 2;
    };

    window.addEventListener('resize', resize);
    resize();

    // Fungsi Mulai Game
    const startGame = () => {
      setShowOverlay(false);
      gameState.score = 0;
      gameState.enemies = [];
      gameState.gameActive = true;
      gameState.gameSpeed = 5;
      gameState.spawnRate = 0.04;
      gameState.player.x = canvas.width / 2;
      gameState.player.y = canvas.height - 100;
      setScore(0);
      setGameActive(true);
      animate();
    };

    (window as any).startGame = startGame;

    const animate = () => {
      if (!gameState.gameActive) return;

      // Background
      ctx.fillStyle = '#0d0208';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update pemain dengan keyboard
      const moveSpeed = 6;
      if (gameState.keys['ArrowLeft'] || gameState.keys['a'] || gameState.keys['A']) gameState.player.x -= moveSpeed;
      if (gameState.keys['ArrowRight'] || gameState.keys['d'] || gameState.keys['D']) gameState.player.x += moveSpeed;
      if (gameState.keys['w'] || gameState.keys['W']) gameState.player.y -= moveSpeed;
      if (gameState.keys['s'] || gameState.keys['S']) gameState.player.y += moveSpeed;

      // Update pemain dengan mouse
      gameState.player.x = Math.max(0, Math.min(gameState.mouseX - gameState.player.w / 2, canvas.width - gameState.player.w));
      gameState.player.y = Math.max(0, Math.min(gameState.player.y, canvas.height - gameState.player.h));

      // Batasan pemain
      if (gameState.player.x < 0) gameState.player.x = 0;
      if (gameState.player.x + gameState.player.w > canvas.width) gameState.player.x = canvas.width - gameState.player.w;

      // Spawn musuh
      if (Math.random() < gameState.spawnRate) {
        gameState.enemies.push({ x: Math.random() * (canvas.width - 40), y: -50, w: 40, h: 40 });
      }

      // Update & gambar musuh
      gameState.enemies.forEach((en, i) => {
        en.y += gameState.gameSpeed;
        ctx.fillStyle = '#0052ff';
        ctx.fillRect(en.x, en.y, en.w, en.h);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(en.x, en.y, en.w, en.h);

        // Cek tabrakan
        if (
          gameState.player.x < en.x + en.w &&
          gameState.player.x + gameState.player.w > en.x &&
          gameState.player.y < en.y + en.h &&
          gameState.player.y + gameState.player.h > en.y
        ) {
          gameState.gameActive = false;
          setGameActive(false);
          setOverlayContent({ title: `GAME OVER!\nScore: ${gameState.score}`, button: 'MAIN LAGI' });
          setShowOverlay(true);
          return;
        }

        // Hapus musuh jika keluar layar
        if (en.y > canvas.height) {
          gameState.enemies.splice(i, 1);
          gameState.score++;
          setScore(gameState.score);

          // Tingkat kesulitan
          if (gameState.score % 10 === 0) {
            gameState.gameSpeed += 0.5;
            gameState.spawnRate += 0.005;
          }
        }
      });

      // Gambar pemain
      ctx.fillStyle = '#ff0080';
      ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.w, gameState.player.h);
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 3;
      ctx.strokeRect(gameState.player.x, gameState.player.y, gameState.player.w, gameState.player.h);

      animationId = requestAnimationFrame(animate);
    };

    // Keyboard
    const handleKeyDown = (e: KeyboardEvent) => {
      gameState.keys[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameState.keys[e.key] = false;
    };

    // Mouse event
    const handleMouseMove = (e: MouseEvent) => {
      gameState.mouseX = e.clientX;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);

    // Start animasi jika game aktif
    if (gameState.gameActive) animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="container">
      <div className="header"></div>
      <canvas ref={canvasRef} id="gameCanvas" />
      {showOverlay && (
        <div id="overlay">
          <div className="overlay-content">
            <h1>{overlayContent.title}</h1>
            <button onClick={() => (window as any).startGame()}>
              {overlayContent.button}
            </button>
          </div>
        </div>
      )}
      <div id="ui">{score}</div>
    </div>
  );
}
