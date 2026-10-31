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

const start = [1, 1];
const end = [9, 9];
let isRunning = false;

const gridElement = document.getElementById('grid');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const generateBtn = document.getElementById('generateBtn');
const speedSelect = document.getElementById('speedSelect');
const algoSelect = document.getElementById('algoSelect');
const visitedCountEl = document.getElementById('visitedCount');
const pathLengthEl = document.getElementById('pathLength');

const mainTitleEl = document.getElementById('mainTitle');

// Helper: Fisher-Yates Array Shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Render grid based on maze array
function createGrid() {
  gridElement.innerHTML = '';
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;

      if (maze[y][x] === 1) {
        cell.classList.add('wall');
      } else {
        cell.classList.add('path');
      }

      if (x === start[0] && y === start[1]) {
        cell.classList.add('start');
        cell.textContent = 'S';
      } else if (x === end[0] && y === end[1]) {
        cell.classList.add('end');
        cell.textContent = 'E';
      } else {
        // Toggle wall on click when visualization is inactive
        cell.addEventListener('click', () => toggleWall(x, y));
      }

      gridElement.appendChild(cell);
    }
  }
}

function getCell(x, y) {
  return document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

function toggleWall(x, y) {
  if (isRunning) return;
  if ((x === start[0] && y === start[1]) || (x === end[0] && y === end[1])) return;

  maze[y][x] = maze[y][x] === 1 ? 0 : 1;

  const cell = getCell(x, y);
  if (maze[y][x] === 1) {
    cell.classList.remove('path');
    cell.classList.add('wall');
  } else {
    cell.classList.remove('wall');
    cell.classList.add('path');
  }
}

// Manhattan distance heuristic for Greedy BFS
function getDistance(x, y, targetX, targetY) {
  return Math.abs(x - targetX) + Math.abs(y - targetY);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function visualizeBFS() {
  if (isRunning) return;
  isRunning = true;
  startBtn.disabled = true;
  generateBtn.disabled = true;
  resetBtn.disabled = true;

  const height = maze.length;
  const width = maze[0].length;
  const [startX, startY] = start;
  const [endX, endY] = end;

  const queue = [[startX, startY]];
  const parentMap = new Map();
  parentMap.set(`${startX},${startY}`, null);

  const directions = [
    [0, -1], // Up
    [1, 0],  // Right
    [0, 1],  // Down
    [-1, 0]  // Left
  ];

  let visitedCount = 0;
  let pathFound = false;

  while (queue.length > 0) {
    // Sort frontier queue by distance to target if Greedy BFS is chosen
    if (algoSelect && algoSelect.value === 'greedy') {
      queue.sort((a, b) => {
        const distA = getDistance(a[0], a[1], endX, endY);
        const distB = getDistance(b[0], b[1], endX, endY);
        return distA - distB;
      });
    }

    const delay = parseInt(speedSelect.value);
    const [x, y] = queue.shift();

    if (!(x === startX && y === startY) && !(x === endX && y === endY)) {
      const cell = getCell(x, y);
      cell.classList.add('visited');
      visitedCount++;
      visitedCountEl.textContent = visitedCount;
      await sleep(delay);
    }

    if (x === endX && y === endY) {
      pathFound = true;
      break;
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 && nx < width &&
        ny >= 0 && ny < height &&
        maze[ny][nx] === 0
      ) {
        const neighborKey = `${nx},${ny}`;
        if (!parentMap.has(neighborKey)) {
          parentMap.set(neighborKey, `${x},${y}`);
          queue.push([nx, ny]);
        }
      }
    }
  }

  if (pathFound) {
    let currKey = `${endX},${endY}`;
    const path = [];

    while (currKey !== null) {
      const [px, py] = currKey.split(',').map(Number);
      path.push([px, py]);
      currKey = parentMap.get(currKey);
    }

    pathLengthEl.textContent = path.length;

    for (const [px, py] of path.reverse()) {
      if (!(px === startX && py === startY) && !(px === endX && py === endY)) {
        const cell = getCell(px, py);
        cell.classList.remove('visited');
        cell.classList.add('solution');
        await sleep(40);
      }
    }
  }

  isRunning = false;
  startBtn.disabled = false;
  generateBtn.disabled = false;
  resetBtn.disabled = false;
}

function generateMaze() {
  if (isRunning) return;

  const height = maze.length;
  const width = maze[0].length;

  // Fill grid with walls
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      maze[y][x] = 1;
    }
  }

  // Recursive Backtracking carve function
  function carvePath(x, y) {
    maze[y][x] = 0;

    const dirs = shuffle([
      [0, -2],
      [2, 0],
      [0, 2],
      [-2, 0]
    ]);

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1) {
        if (maze[ny][nx] === 1) {
          maze[y + dy / 2][x + dx / 2] = 0;
          carvePath(nx, ny);
        }
      }
    }
  }

  // Start carving from [1, 1] and ensure start/end are reachable paths
  carvePath(1, 1);
  maze[start[1]][start[0]] = 0;
  maze[end[1]][end[0]] = 0;

  resetVisuals();
}

function resetVisuals() {
  if (isRunning) return;
  visitedCountEl.textContent = '0';
  pathLengthEl.textContent = '0';
  startBtn.disabled = false;
  generateBtn.disabled = false;
  resetBtn.disabled = false;
  createGrid();
}

// Event Listeners
startBtn.addEventListener('click', visualizeBFS);
resetBtn.addEventListener('click', resetVisuals);
generateBtn.addEventListener('click', generateMaze);

algoSelect.addEventListener('change', (e) => {
  if (e.target.value === 'greedy') {
    mainTitleEl.textContent = 'Greedy BFS Maze Solver Visualizer';
    startBtn.textContent = 'Start Greedy BFS';
  } else {
    mainTitleEl.textContent = 'BFS Maze Solver Visualizer';
    startBtn.textContent = 'Start BFS';
  }
});

// Initial grid render on load
createGrid();