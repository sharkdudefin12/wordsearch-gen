function canPlaceWord(grid, word, row, col, direction) {
  const size = grid.length;
  const wordLength = word.length;

  let rowIncrement = 0;
  let colIncrement = 0;

  switch (direction) {
    case 0: // Horizontal
      colIncrement = 1;
      break;
    case 1: // Vertical
      rowIncrement = 1;
      break;
    case 2: // Diagonal
      rowIncrement = 1;
      colIncrement = 1;
      break;
    case 3: // Backwards Horizontal
      colIncrement = -1;
      break;
    case 4: // Backwards Vertical
      rowIncrement = -1;
      break;
    case 5: // Backwards Diagonal
      rowIncrement = -1;
      colIncrement = -1;
      break;
  }

  if (row + rowIncrement * wordLength > size || row + rowIncrement * wordLength < 0 ||
    col + colIncrement * wordLength > size || col + colIncrement * wordLength < 0) {
    return false;
  }

  for (let i = 0; i < wordLength; i++) {
    const currentRow = row + rowIncrement * i;
    const currentCol = col + colIncrement * i;

    if (grid[currentRow][currentCol] !== '' && grid[currentRow][currentCol] !== word[i]) {
      return false;
    }
  }

  return true;
}

function placeWord(grid, word, row, col, direction) {
  const wordLength = word.length;
  const solution = JSON.parse(JSON.stringify(grid));
  const positions = [];

  let rowIncrement = 0;
  let colIncrement = 0;

  switch (direction) {
    case 0: // Horizontal
      colIncrement = 1;
      break;
    case 1: // Vertical
      rowIncrement = 1;
      break;
    case 2: // Diagonal
      rowIncrement = 1;
      colIncrement = 1;
      break;
    case 3: // Backwards Horizontal
      colIncrement = -1;
      break;
    case 4: // Backwards Vertical
      rowIncrement = -1;
      break;
    case 5: // Backwards Diagonal
      rowIncrement = -1;
      colIncrement = -1;
      break;
  }

  for (let i = 0; i < wordLength; i++) {
    const currentRow = row + rowIncrement * i;
    const currentCol = col + colIncrement * i;

    grid[currentRow][currentCol] = word[i];
    solution[currentRow][currentCol] = word[i];
    positions.push({ row: currentRow, col: currentCol });
  }

  return { solution, positions };
}

function fillEmptySpaces(grid) {
  const size = grid.length;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
}

export function generateWordSearch(words, size) {
  let grid = Array(size).fill(null).map(() => Array(size).fill(''));
  let solution = Array(size).fill(null).map(() => Array(size).fill(''));
  let attempts = 0;
  const maxAttempts = 200; // Increased max attempts
  const wordPositions = {};

  for (const word of words) {
    let placed = false;
    attempts = 0;

    while (!placed && attempts < maxAttempts) {
      const direction = Math.floor(Math.random() * 6); // 6 directions
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (canPlaceWord(grid, word, row, col, direction)) {
        const result = placeWord(grid, word, row, col, direction);
        solution = result.solution;
        wordPositions[word] = result.positions;
        placed = true;
      }
      attempts++;
    }

    if (!placed) {
      console.warn(`Could not place word "${word}" in the grid after ${maxAttempts} attempts.`);
    }
  }

  const puzzle = JSON.parse(JSON.stringify(grid));
  fillEmptySpaces(puzzle);

  return { puzzle, solution, wordPositions };
}
