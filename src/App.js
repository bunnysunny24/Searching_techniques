import React, { useState } from "react";
import "./App.css";
import Algo from "./components/AStarVisualizer";
import Bfs from "./components/PacmanGame";
import Taskbar from "./components/taskbar";

function App() {
  const [selectedComponent, setSelectedComponent] = useState("AStar"); // Default to A*

  return (
    <div>
      <Taskbar onSelect={setSelectedComponent} />
      {selectedComponent === "Pacman" ? <Bfs /> : <Algo />}
    </div>
  );
}

export default App;
