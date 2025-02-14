import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BOARD_SIZE = 8;
const DELAY = 200;

const knightMoves = [
  { x: 2, y: 1 }, { x: 2, y: -1 }, { x: -2, y: 1 }, { x: -2, y: -1 },
  { x: 1, y: 2 }, { x: 1, y: -2 }, { x: -1, y: 2 }, { x: -1, y: -2 },
];

// Helper function: Count available moves from a position
const countOnwardMoves = (x, y, visited) => {
  return knightMoves.filter(({ x: dx, y: dy }) => {
    const newX = x + dx, newY = y + dy;
    return (
      newX >= 0 && newX < BOARD_SIZE &&
      newY >= 0 && newY < BOARD_SIZE &&
      !visited.has(`${newX}-${newY}`)
    );
  }).length;
};

// Warnsdorff's Heuristic Tour Solver
const knightsTour = (start, setPath) => {
  const visited = new Set();
  const path = [];

  const solve = (x, y, moveCount) => {
    if (moveCount === BOARD_SIZE * BOARD_SIZE) {
      return true; // Found a complete tour
    }

    let moves = knightMoves
      .map(({ x: dx, y: dy }) => ({ x: x + dx, y: y + dy }))
      .filter(({ x, y }) => 
        x >= 0 && x < BOARD_SIZE &&
        y >= 0 && y < BOARD_SIZE &&
        !visited.has(`${x}-${y}`)
      )
      .sort((a, b) => 
        countOnwardMoves(a.x, a.y, visited) - countOnwardMoves(b.x, b.y, visited)
      );

    for (let { x: nextX, y: nextY } of moves) {
      visited.add(`${nextX}-${nextY}`);
      path.push({ x: nextX, y: nextY });

      if (solve(nextX, nextY, moveCount + 1)) return true;

      // Backtrack
      visited.delete(`${nextX}-${nextY}`);
      path.pop();
    }
    return false;
  };

  visited.add(`${start.x}-${start.y}`);
  path.push(start);

  if (!solve(start.x, start.y, 1)) {
    alert("No complete tour found from this position.");
    setPath([]);
    return;
  }

  animatePath(path, setPath);
};

// Animate the path
const animatePath = (path, setPath) => {
  path.forEach((cell, index) => {
    setTimeout(() => {
      setPath((prev) => [...prev, cell]);
    }, index * DELAY);
  });
};

const KnightsTourVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [path, setPath] = useState([]);

  useEffect(() => {
    resetGrid();
  }, []);

  const resetGrid = () => {
    setGrid(Array.from({ length: BOARD_SIZE }, (_, y) =>
      Array.from({ length: BOARD_SIZE }, (_, x) => ({ x, y }))
    ));
    setPath([]);
  };

  const handleFindTour = () => {
    setPath([]);
    knightsTour(start, setPath);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Knight's Tour (Warnsdorff's Heuristic)</h1>

      <div
        className="grid gap-1 bg-gray-800 p-2 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(40px, 1fr))`,
        }}
      >
        {grid.flat().map((cell) => {
          let bgColor = "bg-gray-700";
          if (cell.x === start.x && cell.y === start.y) bgColor = "bg-blue-500";
          else if (path.some((p) => p.x === cell.x && p.y === cell.y)) bgColor = "bg-yellow-400";

          return (
            <motion.div
              key={`${cell.x}-${cell.y}`}
              className={`w-10 h-10 border border-gray-600 rounded-md ${bgColor}`}
              onClick={() => setStart({ x: cell.x, y: cell.y })}
            />
          );
        })}
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={handleFindTour}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Start Tour
        </button>
        <button
          onClick={resetGrid}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default KnightsTourVisualizer;
