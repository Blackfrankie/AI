import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const GameCanvas = forwardRef(({ gameState, onScoreUpdate, onGameEnd }, ref) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const gameObjectsRef = useRef({
    bird: {
      x: 100,
      y: 200,
      width: 40,
      height: 30,
      velocity: 0,
      gravity: 0.6,
      jumpStrength: -12,
      rotation: 0
    },
    pipes: [],
    score: 0,
    gameRunning: false
  });

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const PIPE_SPEED = 3;

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Initial render
    drawGame(ctx);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space' && gameState === 'playing') {
        event.preventDefault();
        jump();
      }
    };

    const handleClick = () => {
      if (gameState === 'playing') {
        jump();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    const canvas = canvasRef.current;
    canvas.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      canvas.removeEventListener('click', handleClick);
    };
  }, [gameState]);

  const jump = () => {
    if (gameObjectsRef.current.gameRunning) {
      gameObjectsRef.current.bird.velocity = gameObjectsRef.current.bird.jumpStrength;
    }
  };

  const createPipe = (x) => {
    const pipeHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
    return {
      x: x,
      topHeight: pipeHeight,
      bottomY: pipeHeight + PIPE_GAP,
      bottomHeight: CANVAS_HEIGHT - (pipeHeight + PIPE_GAP),
      passed: false
    };
  };

  const startGame = () => {
    const gameObjects = gameObjectsRef.current;
    gameObjects.bird = {
      x: 100,
      y: 200,
      width: 40,
      height: 30,
      velocity: 0,
      gravity: 0.6,
      jumpStrength: -12,
      rotation: 0
    };
    gameObjects.pipes = [createPipe(CANVAS_WIDTH)];
    gameObjects.score = 0;
    gameObjects.gameRunning = true;

    gameLoop();
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gameObjects = gameObjectsRef.current;

    if (!gameObjects.gameRunning) return;

    // Update bird physics
    gameObjects.bird.velocity += gameObjects.bird.gravity;
    gameObjects.bird.y += gameObjects.bird.velocity;

    // Bird rotation based on velocity
    gameObjects.bird.rotation = Math.min(Math.max(gameObjects.bird.velocity * 3, -30), 30);

    // Update pipes
    gameObjects.pipes = gameObjects.pipes.filter(pipe => pipe.x > -PIPE_WIDTH);
    
    gameObjects.pipes.forEach(pipe => {
      pipe.x -= PIPE_SPEED;

      // Check if bird passed pipe (scoring)
      if (!pipe.passed && pipe.x + PIPE_WIDTH < gameObjects.bird.x) {
        pipe.passed = true;
        gameObjects.score++;
        onScoreUpdate(gameObjects.score);
      }
    });

    // Add new pipes
    if (gameObjects.pipes.length === 0 || gameObjects.pipes[gameObjects.pipes.length - 1].x < CANVAS_WIDTH - 300) {
      gameObjects.pipes.push(createPipe(CANVAS_WIDTH));
    }

    // Collision detection
    if (checkCollisions(gameObjects)) {
      gameObjects.gameRunning = false;
      onGameEnd(gameObjects.score);
      return;
    }

    // Render
    drawGame(ctx);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const checkCollisions = (gameObjects) => {
    const bird = gameObjects.bird;

    // Ground and ceiling collision
    if (bird.y <= 0 || bird.y + bird.height >= CANVAS_HEIGHT) {
      return true;
    }

    // Pipe collision
    for (let pipe of gameObjects.pipes) {
      if (bird.x < pipe.x + PIPE_WIDTH &&
          bird.x + bird.width > pipe.x) {
        if (bird.y < pipe.topHeight || 
            bird.y + bird.height > pipe.bottomY) {
          return true;
        }
      }
    }

    return false;
  };

  const drawGame = (ctx) => {
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw clouds
    drawClouds(ctx);

    const gameObjects = gameObjectsRef.current;

    // Draw pipes
    gameObjects.pipes.forEach(pipe => {
      drawPipe(ctx, pipe);
    });

    // Draw bird
    drawBird(ctx, gameObjects.bird);

    // Draw ground
    drawGround(ctx);
  };

  const drawBird = (ctx, bird) => {
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate(bird.rotation * Math.PI / 180);
    
    // Bird body (gradient)
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, bird.width / 2);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(1, '#FFA500');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, bird.width / 2, bird.height / 2, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Bird wing
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.ellipse(-5, -5, 8, 12, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Bird eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(8, -5, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(10, -5, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Beak
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(25, -2);
    ctx.lineTo(25, 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  };

  const drawPipe = (ctx, pipe) => {
    // Pipe gradient
    const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
    gradient.addColorStop(0, '#228B22');
    gradient.addColorStop(0.5, '#32CD32');
    gradient.addColorStop(1, '#228B22');
    
    ctx.fillStyle = gradient;
    
    // Top pipe
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
    
    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, pipe.bottomHeight);
    
    // Pipe caps
    ctx.fillStyle = '#006400';
    ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
    ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 20);
  };

  const drawGround = (ctx) => {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);
    
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, CANVAS_HEIGHT - 25, CANVAS_WIDTH, 5);
  };

  const drawClouds = (ctx) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // Static clouds for background
    const clouds = [
      { x: 100, y: 50, size: 20 },
      { x: 300, y: 80, size: 15 },
      { x: 500, y: 60, size: 25 },
    ];
    
    clouds.forEach(cloud => {
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.size, 0, 2 * Math.PI);
      ctx.arc(cloud.x + 20, cloud.y, cloud.size * 0.8, 0, 2 * Math.PI);
      ctx.arc(cloud.x - 20, cloud.y, cloud.size * 0.6, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  useImperativeHandle(ref, () => ({
    startGame
  }));

  // Cleanup game loop on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="cursor-pointer select-none"
      style={{ display: 'block' }}
    />
  );
});

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;