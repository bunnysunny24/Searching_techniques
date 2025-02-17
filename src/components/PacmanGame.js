import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 12;
const MOVE_SPEED = 300; // Ghosts' movement speed
const PACMAN_MOVE_SPEED = 300; // Pac-Man's movement speed to match ghosts
const GHOST_COUNT = 2;
const PELLET_COUNT = 5;

const moves = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
];

const bfsFindPath = (start, target) => {
  const queue = [{ ...start, path: [] }];
  const visited = new Set();
  visited.add(`${start.x}-${start.y}`);

  while (queue.length > 0) {
    const { x, y, path } = queue.shift();
    if (x === target.x && y === target.y) return path;
    for (const move of moves) {
      const newX = x + move.x;
      const newY = y + move.y;
      const key = `${newX}-${newY}`;
      if (
        newX >= 0 && newX < BOARD_WIDTH &&
        newY >= 0 && newY < BOARD_HEIGHT &&
        !visited.has(key)
      ) {
        visited.add(key);
        queue.push({ x: newX, y: newY, path: [...path, { x: newX, y: newY }] });
      }
    }
  }
  return [];
};

const PacManGame = () => {
  const [pacman, setPacman] = useState({ x: 0, y: 0 });
  const [ghosts, setGhosts] = useState(
    Array.from({ length: GHOST_COUNT }, () => ({
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT),
    }))
  );
  const [pellets, setPellets] = useState(
    Array.from({ length: PELLET_COUNT }, () => ({
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT),
    }))
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const resetGame = () => {
    setPacman({ x: 0, y: 0 });
    setGhosts(
      Array.from({ length: GHOST_COUNT }, () => ({
        x: Math.floor(Math.random() * BOARD_WIDTH),
        y: Math.floor(Math.random() * BOARD_HEIGHT),
      }))
    );
    setPellets(
      Array.from({ length: PELLET_COUNT }, () => ({
        x: Math.floor(Math.random() * BOARD_WIDTH),
        y: Math.floor(Math.random() * BOARD_HEIGHT),
      }))
    );
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver || won) return;
      e.preventDefault(); // Prevent page scrolling
      const move = moves.find((m, i) => e.key === ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"][i]);
      if (move) {
        const newX = pacman.x + move.x;
        const newY = pacman.y + move.y;
        if (newX >= 0 && newX < BOARD_WIDTH && newY >= 0 && newY < BOARD_HEIGHT) {
          setPacman({ x: newX, y: newY });
          setPellets((prev) => prev.filter((p) => p.x !== newX || p.y !== newY));
          setScore((prev) => (pellets.some((p) => p.x === newX && p.y === newY) ? prev + 1 : prev));
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [pacman, pellets, gameOver, won]);

  useEffect(() => {
    if (pellets.length === 0) setWon(true);
  }, [pellets]);

  useEffect(() => {
    const moveGhosts = () => {
      if (gameOver || won) return;
      setGhosts((prevGhosts) =>
        prevGhosts.map((ghost) => {
          const path = bfsFindPath(ghost, pacman);
          return path.length > 0 ? path[0] : ghost;
        })
      );
    };

    const interval = setInterval(moveGhosts, MOVE_SPEED);
    return () => clearInterval(interval);
  }, [pacman, gameOver, won]);

  useEffect(() => {
    if (ghosts.some((g) => g.x === pacman.x && g.y === pacman.y)) {
      setGameOver(true);
    }
  }, [pacman, ghosts]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Pac-Man BFS AI</h1>
      {gameOver ? <h2 className="text-red-500 text-xl">Game Over!</h2> : won ? <h2 className="text-green-500 text-xl">You Won!</h2> : <p>Score: {score}</p>}
      <button onClick={resetGame} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Reset</button>
      <div className="grid gap-1 bg-gray-800 p-2 rounded-lg mt-4" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(40px, 1fr))` }}>
        {Array.from({ length: BOARD_WIDTH * BOARD_HEIGHT }, (_, i) => {
          const x = i % BOARD_WIDTH;
          const y = Math.floor(i / BOARD_WIDTH);
          let bgColor = "bg-gray-700";
          if (pacman.x === x && pacman.y === y) bgColor = "bg-yellow-400";
          else if (ghosts.some((g) => g.x === x && g.y === y)) bgColor = "bg-red-500";
          else if (pellets.some((p) => p.x === x && p.y === y)) bgColor = "bg-green-500";
          return <motion.div key={`${x}-${y}`} className={`w-10 h-10 border border-gray-600 rounded-md ${bgColor}`} />;
        })}
      </div>
      <div className="mt-6 text-center max-w-lg">
        <h2 className="text-lg font-bold">How BFS Works in This Game</h2>
        <p>BFS (Breadth-First Search) is an algorithm used in this game to help the ghosts find the shortest path towards Pac-Man. It works by exploring all possible paths level by level, ensuring that the ghosts move in a predictable, yet efficient way.</p>
        <p>In BFS, the ghosts start at their current position and explore all available directions in each move. It checks each cell surrounding the ghost’s current location in all four cardinal directions (up, down, left, right). For every new move, the ghost keeps track of the path that led to it, and the algorithm continues until it reaches Pac-Man.</p>
        <p>Unlike A* search, BFS does not use any heuristics to prioritize certain paths, which makes it simple but reliable. As a result, the ghosts are guaranteed to find Pac-Man but may not take the most optimal route in all cases. This means that the ghosts will always pursue Pac-Man but without the intelligence of a more advanced pathfinding algorithm.</p>
        <p>This game uses BFS in real time to dynamically adjust the ghosts' behavior. Every time the ghosts are about to move, they recalculate their path using BFS to ensure they’re always moving toward the current position of Pac-Man. This creates a challenging, but fair gameplay experience where players can anticipate the ghosts' movements based on their distance from Pac-Man.</p>
      </div>
    </div>
  );
};

export default PacManGame;
