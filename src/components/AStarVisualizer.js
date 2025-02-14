import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ROWS = 25;
const COLS = 60;
const DELAY = 50; // Delay in ms per step

const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const aStar = (grid, start, end, setPath) => {
  const openSet = [start];
  const closedSet = new Set();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();
  gScore.set(`${start.x}-${start.y}`, 0);
  fScore.set(`${start.x}-${start.y}`, heuristic(start, end));

  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore.get(`${a.x}-${a.y}`) - fScore.get(`${b.x}-${b.y}`));
    const current = openSet.shift();
    closedSet.add(`${current.x}-${current.y}`);

    if (current.x === end.x && current.y === end.y) {
      const path = [];
      let temp = current;
      while (temp) {
        path.push(temp);
        temp = cameFrom.get(`${temp.x}-${temp.y}`);
      }
      animatePath(path.reverse(), setPath);
      return;
    }

    const directions = [
      { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 },
      { x: -1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: 1, y: -1 },
    ];

    for (const dir of directions) {
      const neighbor = { x: current.x + dir.x, y: current.y + dir.y };
      const key = `${neighbor.x}-${neighbor.y}`;

      if (
        neighbor.x >= 0 && neighbor.x < COLS &&
        neighbor.y >= 0 && neighbor.y < ROWS &&
        !grid[neighbor.y][neighbor.x].isObstacle &&
        !closedSet.has(key)
      ) {
        const tentativeG = (gScore.get(`${current.x}-${current.y}`) || Infinity) + 1;
        if (!gScore.has(key) || tentativeG < gScore.get(key)) {
          cameFrom.set(key, current);
          gScore.set(key, tentativeG);
          fScore.set(key, tentativeG + heuristic(neighbor, end));
          if (!openSet.some((node) => node.x === neighbor.x && node.y === neighbor.y)) {
            openSet.push(neighbor);
          }
        }
      }
    }
  }
  setPath([]);
};

const animatePath = (path, setPath) => {
  path.forEach((cell, index) => {
    setTimeout(() => {
      setPath((prev) => [...prev, cell]);
    }, index * DELAY);
  });
};

const AStarVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [end, setEnd] = useState({ x: 19, y: 19 });
  const [path, setPath] = useState([]);

  useEffect(() => {
    resetGrid();
  }, []);

  const resetGrid = () => {
    const newGrid = Array.from({ length: ROWS }, (_, y) =>
      Array.from({ length: COLS }, (_, x) => ({
        x,
        y,
        isObstacle: Math.random() < 0.3,
      }))
    );
    setGrid(newGrid);
    setPath([]);
  };

  const handleFindPath = () => {
    setPath([]);
    aStar(grid, start, end, setPath);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">A* Pathfinding Visualizer</h1>
      
      <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-600 text-sm max-w-2xl">
        <p className="mb-2">This visualizer demonstrates how the A* algorithm finds the shortest path between a start and end point while avoiding obstacles.</p>
        <ul className="list-disc list-inside">
          <li><span className="text-blue-400">Blue:</span> Start point</li>
          <li><span className="text-green-400">Green:</span> End point</li>
          <li><span className="text-red-400">Red:</span> Obstacles</li>
          <li><span className="text-yellow-400">Yellow:</span> The computed shortest path</li>
        </ul>
      </div>

      <div
        className="overflow-auto p-2 bg-gray-800 rounded-lg shadow-lg border border-gray-600"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, minmax(10px, 1fr))`,
          maxWidth: "90vw",
        }}
      >
        {grid.flat().map((cell) => {
          let bgColor = "bg-gray-700";
          if (cell.x === start.x && cell.y === start.y) bgColor = "bg-blue-500";
          else if (cell.x === end.x && cell.y === end.y) bgColor = "bg-green-500";
          else if (path.some((p) => p.x === cell.x && p.y === cell.y)) bgColor = "bg-yellow-400";
          else if (cell.isObstacle) bgColor = "bg-red-500";

          return (
            <motion.div
              key={`${cell.x}-${cell.y}`}
              className={`border border-gray-600 rounded-md shadow-sm cursor-pointer 
                sm:w-6 sm:h-6 w-4 h-4 ${bgColor}`}
              whileHover={{ scale: 1.2 }}
              onClick={() => setEnd({ x: cell.x, y: cell.y })}
              onTouchStart={() => setEnd({ x: cell.x, y: cell.y })}
            />
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap justify-center space-x-2">
        <button
          onClick={handleFindPath}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Find Path
        </button>
        <button
          onClick={resetGrid}
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition text-sm sm:text-base"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default AStarVisualizer;
