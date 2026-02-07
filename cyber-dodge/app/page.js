'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayContent, setOverlayContent] = useState({ title: 'CYBER DODGE', button: 'MAIN SEKARANG' });
  
  const gameStateRef = useRef({
    score: 0,
    gameActive: false,
    player: { x: 0, y: 0, w: 50, h: 50 },
    enemies: [],
    keys: {},
    mouseX: 0,
    gameSpeed: 5,
    spawnRate: 0.04,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const gameState = gameStateRef.current;
    let animationId;

    // Atur ukuran canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - (document.querySelector('.header')?.offsetHeight || 0);
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

    window.startGame = startGame; // Expose untuk button

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
          setOverlayContent({ title: 'GAME OVER', score: gameState.score, button: 'RETRY' });
          setShowOverlay(true);
        }

        if (en.y > canvas.height) {
          gameState.enemies.splice(i, 1);
          gameState.score++;
          setScore(gameState.score);

          // Kesulitan bertambah setiap 5 poin
          if (gameState.score % 5 === 0) {
            gameState.gameSpeed = Math.min(gameState.gameSpeed + 0.5, 12);
            gameState.spawnRate = Math.min(gameState.spawnRate + 0.01, 0.08);
          }
        }
      });

      // Gambar pemain
      ctx.fillStyle = '#fff';
      ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.w, gameState.player.h);
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.strokeRect(gameState.player.x, gameState.player.y, gameState.player.w, gameState.player.h);

      // Glow effect
      ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
      ctx.fillRect(gameState.player.x - 5, gameState.player.y - 5, gameState.player.w + 10, gameState.player.h + 10);

      animationId = requestAnimationFrame(animate);
    };

    // Keyboard controls
    const handleKeyDown = (e) => {
      gameState.keys[e.key] = true;
    };

    const handleKeyUp = (e) => {
      gameState.keys[e.key] = false;
    };

    // Mouse controls
    const handleMouseMove = (e) => {
      gameState.mouseX = e.clientX;
    };

    // Touch controls
    const handleTouchMove = (e) => {
      if (gameState.gameActive) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        gameState.player.x = e.touches[0].clientX - gameState.player.w / 2;
        gameState.player.y = e.touches[0].clientY - headerHeight - gameState.player.h / 2;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('Game siap dijalankan Offline!'))
        .catch((err) => console.log('Gagal daftar SW:', err));
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="container">
      <div className="header">
        <img src="https://docs.base.org/img/logo.svg" alt="Base" />
        <span>BASE CYBER DODGE</span>
      </div>
      <div id="ui">SKOR: <span id="score">{score}</span></div>
      <canvas ref={canvasRef} id="gameCanvas"></canvas>
      {showOverlay && (
        <div id="overlay">
          <h1>{overlayContent.title}</h1>
          {overlayContent.score !== undefined && <p>Skor: {overlayContent.score}</p>}
          <button 
            id="startBtn" 
            onClick={() => window.startGame()}
          >
            {overlayContent.button}
          </button>
        </div>
      )}
      <div id="wallet-container">
        <button id="connectBtn">Connect Wallet</button>
        <span id="walletAddress" style={{ display: 'none' }}></span>
      </div>
    </div>
  );
}
