function canPlaceWord(grid, word, row, col, direction) {
    const size = grid.length;
    const wordLength = word.length;

    if (direction === 0) { // Horizontal
        if (col + wordLength > size) return false;
        for (let i = 0; i < wordLength; i++) {
            if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) {
                return false;
            }
        }
    } else if (direction === 1) { // Vertical
        if (row + wordLength > size) return false;
        for (let i = 0; i < wordLength; i++) {
            if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) {
                return false;
            }
        }
    } else { // Diagonal
        if (row + wordLength > size || col + wordLength > size) return false;
        for (let i = 0; i < wordLength; i++) {
            if (grid[row + i][col + i] !== '' && grid[row + i][col + i] !== word[i]) {
                return false;
            }
        }
    }

    return true;
}

function placeWord(grid, word, row, col, direction) {
    const wordLength = word.length;
    const solution = JSON.parse(JSON.stringify(grid)); // Deep copy for solution
    const positions = [];

    if (direction === 0) { // Horizontal
        for (let i = 0; i < wordLength; i++) {
            grid[row][col + i] = word[i];
            solution[row][col + i] = word[i];
            positions.push({ row: row, col: col + i });
        }
    } else if (direction === 1) { // Vertical
        for (let i = 0; i < wordLength; i++) {
            grid[row + i][col] = word[i];
            solution[row + i][col] = word[i];
            positions.push({ row: row + i, col: col });
        }
    } else { // Diagonal
        for (let i = 0; i < wordLength; i++) {
            grid[row + i][col + i] = word[i];
            solution[row + i][col + i] = word[i];
            positions.push({ row: row + i, col: col + i });
        }
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
    const maxAttempts = 100;
    const wordPositions = {};

    for (const word of words) {
        let placed = false;
        attempts = 0;

        while (!placed && attempts < maxAttempts) {
            const direction = Math.floor(Math.random() * 3);
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);

            if (canPlaceWord(grid, word, row, col, direction)) {
                const result = placeWord(grid, word, row, col, direction);
                solution = result.solution;
                wordPositions[word] = result.positions; // Store positions
                placed = true;
            }
            attempts++;
        }
        if (!placed) {
            throw new Error(`Could not place word "${word}" in the grid after ${maxAttempts} attempts. Please try reducing the number of words or increasing the grid size.`);
        }
    }

    const puzzle = JSON.parse(JSON.stringify(grid));
    fillEmptySpaces(puzzle);

    return { puzzle, solution, wordPositions };
}
