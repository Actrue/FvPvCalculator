"use client";
import { useState, useEffect, useRef } from 'react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState([{x: 10, y: 10}]);]);
  const [food, setFood] = useState({x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)});
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(100);

  // 游戏逻辑
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = setInterval(() => {
      moveSnake();
      drawGame();
    }, gameSpeed);

    return () => clearInterval(gameLoop);
  }, [snake, direction, gameSpeed]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case 'F5':
          resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // 蛇移动逻辑
  const moveSnake = () => {
    const head = {...snake[0]};
    switch (direction) {
      case 'UP': head.y--; break;
      case 'DOWN': head.y++; break;
      case 'LEFT': head.x--; break;
      case 'RIGHT': head.x++; break;
    }

    // 碰撞检测
    if (
      head.x < 0 || head.x >= 20 ||
      head.y < 0 || head.y >= 20 ||
      snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    // 食物碰撞检测
    if (head.x === food.x && head.y === food.y) {
      setScore(prev => prev + 10);
      setFood({x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20});
      setSnake([head, ...snake]);
    } else {
      setSnake([head, ...snake.slice(0, -1)];
    }
  };

  // 游戏渲染
  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制食物
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);

    // 绘制蛇
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
      ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });
  };

  // 游戏重置函数
  const resetGame = () => {
    setSnake([{x: 10, y: 10}]);
    setFood({x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20});
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setGameSpeed(100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1 style={{ marginBottom: '20px' }}>贪吃蛇游戏</h1>
      <canvas 
        id="gameCanvas"
        width="400"
        height="400"
        ref={canvasRef}
        style={{ border: "1px solid #000", backgroundColor: "black" }}
      ></canvas>
      {gameOver && <p style={{ marginTop: '20px' }}>游戏结束！按F5重新开始</p>}
      <p style={{ marginTop: '10px' }}>得分: {score}</p>
    </div>
  );
}