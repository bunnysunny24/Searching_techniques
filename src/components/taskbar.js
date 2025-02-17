import React from "react";
import { motion } from "framer-motion";

const Taskbar = ({ onSelect }) => {
  return (
    <motion.div
      className="fixed top-4 right-4 bg-gray-800 p-3 rounded-lg shadow-lg flex space-x-4 border border-gray-600 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-md shadow-md hover:bg-yellow-600 transition"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onSelect("Pacman")}
      >
        Pacman
      </motion.button>
      <motion.button
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onSelect("AStar")}
      >
        A* Visualizer
      </motion.button>
    </motion.div>
  );
};

export default Taskbar;
