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

/**
 * Solves a 2D maze using BFS and backtracks the shortest path.
 * @param {number[][]} grid - 2D matrix (0 = path, 1 = wall)
 * @param {[number, number]} start - Starting [x, y] coordinates
 * @param {[number, number]} end - Ending [x, y] coordinates
 * @returns {[number, number][] | null} - Array of [x, y] coordinates or null
 */
function solveMazeBFS(grid, start, end) {
  if (!grid || !grid.length || !grid[0].length) return null;

  const height = grid.length;
  const width = grid[0].length;
  const [startX, startY] = start;
  const [endX, endY] = end;

  // Validate start and end positions
  if (
    startX < 0 || startX >= width || startY < 0 || startY >= height ||
    endX < 0 || endX >= width || endY < 0 || endY >= height ||
    grid[startY][startX] === 1 || grid[endY][endX] === 1
  ) {
    return null;
  }

  // Queue stores single coordinate pairs [x, y] rather than full arrays
  const queue = [[startX, startY]];
  
  // Track visited nodes and parent pointers for path reconstruction
  const parentMap = new Map();
  const startKey = `${startX},${startY}`;
  parentMap.set(startKey, null);

  const directions = [
    [0, -1], // Up
    [1, 0],  // Right
    [0, 1],  // Down
    [-1, 0]  // Left
  ];

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    // Reached destination: Reconstruct path backwards
    if (x === endX && y === endY) {
      const path = [];
      let currKey = `${endX},${endY}`;

      while (currKey !== null) {
        const [px, py] = currKey.split(',').map(Number);
        path.push([px, py]);
        currKey = parentMap.get(currKey);
      }

      return path.reverse();
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 && nx < width &&
        ny >= 0 && ny < height &&
        grid[ny][nx] === 0
      ) {
        const neighborKey = `${nx},${ny}`;

        if (!parentMap.has(neighborKey)) {
          parentMap.set(neighborKey, `${x},${y}`);
          queue.push([nx, ny]);
        }
      }
    }
  }

  return null; // No path found
}

// Example Usage:
const start = [1, 1];
const end = [9, 9];
const solutionPath = solveMazeBFS(maze, start, end);

console.log("Path coordinates:", solutionPath);