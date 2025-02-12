import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Grid size
const ROWS = 10;
const COLS = 10;

// Helper function to calculate heuristic (Euclidean distance)
const heuristic = (a, b) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

// A* Algorithm Implementation
const aStar = (grid, start, end) => {
  const openSet = [];
  const closedSet = new Set();
  const cameFrom = new Map();

  const gScore = new Map();
  const fScore = new Map();

  openSet.push(start);
  gScore.set(start, 0);
  fScore.set(start, heuristic(start, end));

  while (openSet.length > 0) {
    // Sort openSet by fScore
    openSet.sort((a, b) => fScore.get(a) - fScore.get(b));

    const current = openSet.shift();
    closedSet.add(current);

    if (current.x === end.x && current.y === end.y) {
      // Path found, reconstruct
      const path = [];
      let temp = current;
      while (temp) {
        path.push(temp);
        temp = cameFrom.get(temp);
      }
      return path.reverse();
    }

    // Neighbor directions
    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];

    for (const dir of directions) {
      const neighbor = {
        x: current.x + dir.x,
        y: current.y + dir.y,
      };

      // Check if the neighbor is within the grid bounds and not an obstacle
      if (
        neighbor.x >= 0 &&
        neighbor.x < COLS &&
        neighbor.y >= 0 &&
        neighbor.y < ROWS &&
        !grid[neighbor.y][neighbor.x].isObstacle &&
        !closedSet.has(neighbor)
      ) {
        const tentativeG = (gScore.get(current) || Infinity) + 1;

        if (!gScore.has(neighbor) || tentativeG < gScore.get(neighbor)) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeG);
          fScore.set(neighbor, tentativeG + heuristic(neighbor, end));

          if (!openSet.some((node) => node.x === neighbor.x && node.y === neighbor.y)) {
            openSet.push(neighbor);
          }
        }
      }
    }
  }

  return []; // No path found
};

const AStarVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [end, setEnd] = useState({ x: 9, y: 9 });
  const [path, setPath] = useState([]);

  useEffect(() => {
    resetGrid();
  }, []);

  // Reset the grid
  const resetGrid = () => {
    const newGrid = Array.from({ length: ROWS }, (_, y) =>
      Array.from({ length: COLS }, (_, x) => ({
        x,
        y,
        isObstacle: Math.random() < 0.2, // 20% chance of obstacle
      }))
    );
    setGrid(newGrid);
    setPath([]);
  };

  // Run the A* algorithm
  const handleFindPath = () => {
    const foundPath = aStar(grid, start, end);
    setPath(foundPath);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">A* Pathfinding - GPS Navigation</h1>
      
      {/* Grid display */}
      <div className="grid grid-cols-10 gap-1 border p-2">
        {grid.flat().map((cell) => {
          let bgColor = "bg-gray-200"; // Default color

          if (cell.x === start.x && cell.y === start.y) bgColor = "bg-blue-500"; // Start Point
          else if (cell.x === end.x && cell.y === end.y) bgColor = "bg-green-500"; // End Point
          else if (path.some((p) => p.x === cell.x && p.y === cell.y)) bgColor = "bg-yellow-500"; // Path
          else if (cell.isObstacle) bgColor = "bg-red-500"; // Obstacles

          return (
            <motion.div
              key={`${cell.x}-${cell.y}`}
              className={`w-8 h-8 ${bgColor} border border-gray-300`}
              whileHover={{ scale: 1.1 }}
              onClick={() => setEnd({ x: cell.x, y: cell.y })} // Change destination on click
            />
          );
        })}
      </div>

      {/* Buttons */}
      <div className="mt-4 flex space-x-4">
        <button onClick={handleFindPath} className="px-4 py-2 bg-blue-600 text-white rounded">
          Find Path
        </button>
        <button onClick={resetGrid} className="px-4 py-2 bg-red-600 text-white rounded">
          Reset
        </button>
      </div>
    </div>
  );
};

export default AStarVisualizer;
