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
const speedSelect = document.getElementById('speedSelect');
const algoSelect = document.getElementById('algoSelect');
const visitedCountEl = document.getElementById('visitedCount');
const pathLengthEl = document.getElementById('pathLength');

const generateBtn = document.getElementById('generateBtn');

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
      }

      gridElement.appendChild(cell);
    }
  }
}

function getCell(x, y) {
  return document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
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
    // Sort frontier queue by closest distance to end if Greedy BFS is chosen
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
}

function resetVisuals() {
  if (isRunning) return;
  visitedCountEl.textContent = '0';
  pathLengthEl.textContent = '0';
  startBtn.disabled = false;
  createGrid();
}

startBtn.addEventListener('click', visualizeBFS);
resetBtn.addEventListener('click', resetVisuals);

// generate maze 

function toggleWall(x, y) {
  // Prevent editing while an algorithm is running or on Start/End points
  if (isRunning) return;
  if ((x === start[0] && y === start[1]) || (x === end[0] && y === end[1])) return;

  // Toggle state in the 2D matrix (1 = wall, 0 = path)
  maze[y][x] = maze[y][x] === 1 ? 0 : 1;

  // Update the UI cell class directly
  const cell = getCell(x, y);
  if (maze[y][x] === 1) {
    cell.classList.remove('path');
    cell.classList.add('wall');
  } else {
    cell.classList.remove('wall');
    cell.classList.add('path');
  }
}

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
        // Allow user to click to toggle walls manually
        cell.addEventListener('click', () => toggleWall(x, y));
      }

      gridElement.appendChild(cell);
    }
  }
}

function generateMaze() {
  if (isRunning) return;

  const height = maze.length;
  const width = maze[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      maze[y][x] = 1;
    }
  }
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
generateBtn.addEventListener('click', generateMaze);
// Render initial grid on page load
createGrid();