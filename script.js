const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], // Start at [1, 1]
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1], // End at [9, 9]
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function solveMazeBFS(grid, start, end) {
  const height = grid.length;
  const width = grid[0].length;
  
  const queue = [[start]]; // Store paths in queue
  const visited = new Set();

  // 11x11 Grid Matrix (0 = path, 1 = wall)


  visited.add(`${start[0]},${start[1]}`);

  const directions = [
    [0, -1], // Up
    [1, 0],  // Right
    [0, 1],  // Down
    [-1, 0]  // Left
  ];

  while (queue.length > 0) {
    const path = queue.shift();
    const [x, y] = path[path.length - 1];

    // Check if reached destination
    if (x === end[0] && y === end[1]) {
      return path; // Return coordinates array of path
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 && nx < width &&
        ny >= 0 && ny < height &&
        grid[ny][nx] === 0 &&
        !visited.has(`${nx},${ny}`)
      ) {
        visited.add(`${nx},${ny}`);
        queue.push([...path, [nx, ny]]);
      }
    }
  }

  return null; // No path found
}

// Example Usage (Solves the generated maze above):
const start = [1, 1];
const end = [9, 9];
const solutionPath = solveMazeBFS(maze, start, end);

console.log("Path coordinates:", solutionPath);