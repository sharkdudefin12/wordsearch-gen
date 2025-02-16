import { generateWordSearch } from './wordSearchGenerator.js';

// Dummy data for initial display
const dummyWords = ['OCEAN', 'TREE', 'FLOWER', 'FOREST', 'DESERT', 'RIVER', 'BEACH', 'MOUNTAIN', 'JUNGLE'];
const dummySize = 10;

// Colors for word highlighting in the solution
const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39'];

// Initial dummy puzzle and solution generation
const { puzzle: dummyPuzzle, solution: dummySolution, wordPositions: dummyWordPositions } = generateWordSearch(dummyWords, dummySize);

// Display dummy data on page load
displayPuzzle(dummyPuzzle, 'puzzle-grid');
displaySolution(dummySolution, 'solution-grid', dummyWordPositions);
displayWords(dummyWords);


document.getElementById('generate').addEventListener('click', () => {
    const wordsInput = document.getElementById('words').value;
    const size = parseInt(document.getElementById('size').value, 10);
    const words = wordsInput.split(',').map(word => word.trim().toUpperCase()).filter(word => word.length > 0);

    if (words.length === 0) {
        alert('Please enter some words.');
        return;
    }

    if (isNaN(size) || size < 5 || size > 20) {
        alert('Please enter a valid grid size between 5 and 20.');
        return;
    }
    try {
        const { puzzle, solution, wordPositions } = generateWordSearch(words, size);
        displayPuzzle(puzzle, 'puzzle-grid');
        displaySolution(solution, 'solution-grid', wordPositions);
        displayWords(words);
        document.querySelector('.solution-section').style.display = 'block';
    } catch (error) {
        alert(error.message);
    }

});

function displayPuzzle(grid, elementId) {
    const table = document.getElementById(elementId);
    table.innerHTML = '';

    for (let i = 0; i < grid.length; i++) {
        const row = table.insertRow();
        for (let j = 0; j < grid[i].length; j++) {
            const cell = row.insertCell();
            cell.textContent = grid[i][j] || '';
            cell.style.backgroundColor = ''; // Remove any highlighting
        }
    }
}

function displaySolution(grid, elementId, wordPositions) {
  const table = document.getElementById(elementId);
  table.innerHTML = '';

  for (let i = 0; i < grid.length; i++) {
    const row = table.insertRow();
    for (let j = 0; j < grid[i].length; j++) {
      const cell = row.insertCell();
      cell.textContent = grid[i][j] || '';

      // Apply styling for word positions
      for (const word in wordPositions) {
        if (wordPositions.hasOwnProperty(word)) {
          const positions = wordPositions[word];
          const colorIndex = Object.keys(wordPositions).indexOf(word) % colors.length;
          const cellColor = colors[colorIndex];

          for (const pos of positions) {
            if (pos.row === i && pos.col === j) {
              cell.style.backgroundColor = cellColor;
              cell.style.color = 'white';
            }
          }
        }
      }
    }
  }
}

function displayWords(words) {
    const wordListDiv = document.getElementById('word-list');
    wordListDiv.innerHTML = ''; // Clear previous words

    words.forEach(word => {
        const wordItem = document.createElement('div');
        wordItem.classList.add('word-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox-${word}`;

        const label = document.createElement('label');
        label.htmlFor = `checkbox-${word}`;
        label.textContent = word;

        wordItem.appendChild(checkbox);
        wordItem.appendChild(label);
        wordListDiv.appendChild(wordItem);
    });
}

document.getElementById('download-puzzle').addEventListener('click', () => {
    const puzzleContainer = document.getElementById('puzzle-container'); // Target the container
    downloadSection(puzzleContainer, 'word-search-puzzle.png');
});

document.getElementById('download-solution').addEventListener('click', () => {
    const solutionSection = document.querySelector('.solution-section');
    downloadSection(solutionSection, 'word-search-solution.png');
});

function downloadSection(section, filename) {
    domtoimage.toPng(section)
        .then(function (dataUrl) {
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            link.click();
        })
        .catch(function (error) {
            console.error('Error generating image:', error);
        });
}
