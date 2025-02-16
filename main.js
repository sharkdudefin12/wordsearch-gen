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
        displayPuzzle(puzzle, 'puzzle-grid', size);
        displaySolution(solution, 'solution-grid', wordPositions);
        displayWords(words);
        document.querySelector('.solution-section').style.display = 'block';
    } catch (error) {
        alert(error.message);
    }

});

function displayPuzzle(grid, elementId, size = 10) {
    const table = document.getElementById(elementId);
    table.innerHTML = '';

    for (let i = 0; i < grid.length; i++) {
        const row = table.insertRow();
        for (let j = 0; j < grid[i].length; j++) {
            const cell = row.insertCell();
            cell.textContent = grid[i][j] || '';
            // Adjust width based on grid size
            cell.style.width = `${350 / size}px`;
            cell.style.height = `${350 / size}px`;
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
        wordItem.textContent = word;
        wordListDiv.appendChild(wordItem);
    });
}

document.getElementById('download-puzzle').addEventListener('click', () => {
    const puzzleContainer = document.getElementById('puzzle-container'); // Target the container
    // Temporarily change background color to white
    puzzleContainer.style.backgroundColor = 'white';
    const cells = puzzleContainer.querySelectorAll('#puzzle-grid td');
    const originalBackgrounds = Array.from(cells).map(cell => cell.style.backgroundColor); // Store original backgrounds
    cells.forEach(cell => {
        cell.style.backgroundColor = 'white';
    });

    downloadSection(puzzleContainer, 'word-search-puzzle.png', () => {
        // Revert background color to transparent after download
        puzzleContainer.style.backgroundColor = '';
        cells.forEach((cell, index) => {
            cell.style.backgroundColor = originalBackgrounds[index] || ''; // Revert to original or default
        });
    });
});

document.getElementById('download-solution').addEventListener('click', () => {
    const solutionSection = document.querySelector('.solution-section');
    const downloadButton = solutionSection.querySelector('.download-section');
    downloadButton.style.display = 'none'; // Hide the download button

    downloadSection(solutionSection, 'word-search-solution.png', () => {
        downloadButton.style.display = 'block'; // Show the download button again
    });
});

function downloadSection(section, filename, callback) {
    domtoimage.toPng(section)
        .then(function (dataUrl) {
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            link.click();
            if (callback) {
                callback();
            }
        })
        .catch(function (error) {
            console.error('Error generating image:', error);
        });
}
