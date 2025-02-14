# Pac-Man BFS AI & A* Pathfinding Visualizer

## Pac-Man BFS AI

### Description
Pac-Man BFS AI is a grid-based game where the player controls Pac-Man, avoiding ghosts while collecting pellets. The ghosts use a Breadth-First Search (BFS) algorithm to find the shortest path to Pac-Man.

### Features
- **Grid-Based Movement**: Pac-Man moves using arrow keys within a 20x12 grid.
- **BFS AI for Ghosts**: Ghosts dynamically find the shortest path to Pac-Man using the BFS algorithm.
- **Scoring System**: Players gain points by collecting pellets placed randomly on the grid.
- **Game Over Mechanic**: The game ends if a ghost reaches Pac-Man.
- **Reset Functionality**: Players can reset the game anytime to start fresh.

### Controls
- **Arrow Keys**: Move Pac-Man up, down, left, or right.
- **Reset Button**: Restart the game.

### Technologies Used
- **React.js**: UI framework
- **Framer Motion**: Animations
- **JavaScript**: Game logic and state management

### How BFS Works in the Game
- BFS explores all possible moves level by level.
- Guarantees the shortest path from the ghost to Pac-Man.
- Ghosts update their position every 300ms based on the BFS pathfinding.

---

## A* Pathfinding Visualizer

### Description
A grid-based visualizer demonstrating the A* pathfinding algorithm. Users can set a start and end point, and the algorithm finds the shortest path while avoiding obstacles.

### Features
- **Dynamic Grid**: A 25x60 grid where users can define obstacles.
- **A* Algorithm Implementation**: Uses heuristics (Manhattan Distance) for optimal pathfinding.
- **Step-by-Step Visualization**: Animates the pathfinding process in real-time.
- **Diagonal Movement Support**: Allows both cardinal and diagonal movements.

### How A* Algorithm Works
- Calculates `g(n)` (distance from start node) and `h(n)` (estimated distance to target).
- Uses `f(n) = g(n) + h(n)` to determine the best path.
- Explores nodes in order of lowest `f(n)` value, ensuring optimal path selection.

### Technologies Used
- **React.js**: UI framework
- **Framer Motion**: Smooth animations
- **JavaScript**: Algorithm implementation and state handling

---

## Installation & Usage
1. Clone the repository:
   ```sh
   git clone https://github.com/bunnysunny24/Searching_techniques.git
   ```
2. Navigate to the project directory:
   ```sh
   cd your-project-folder
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Run the application:
   ```sh
   npm start
   ```
5. Open `http://localhost:3000/` in your browser.

---

## Future Enhancements
- **Improved AI for Ghosts**: Implement A* for more dynamic ghost movement.
- **Customizable Grid Size**: Allow users to modify the grid dimensions.
- **Obstacle Placement in Pac-Man**: Add walls for more complex paths.

---

## License
This project is open-source and available under the MIT License.

