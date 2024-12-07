const { readFileSync } = require("fs");
const { makeGrid, scanGrid } = require("../lib");

const inputText = readFileSync("./input.txt").toString();
const grid = makeGrid(inputText);

const directions = [
  { row: 1, col: 0 }, // down
  { row: 1, col: 1 }, // down-right
  { row: 0, col: 1 }, // right
  { row: -1, col: 1 }, // up-right
  { row: -1, col: 0 }, // up
  { row: -1, col: -1 }, // up-left
  { row: 0, col: -1 }, // left
  { row: 1, col: -1 }, // down-left
];

function part1() {
  const targetWord = "XMAS";
  let count = 0;
  scanGrid(grid, ({ row, col, val, grid }) => {
    if (val === "X") {
      for (const direction of directions) {
        const word = getWordForDirection({
          position: { row, col },
          direction,
          length: targetWord.length,
          grid,
        });
        if (word === targetWord) {
          count++;
        }
      }
    }
  });

  return count;
}

function part2() {
  let count = 0;
  scanGrid(grid, ({ row, col, val, grid }) => {
    if (val === "A") {
      if (isXMAS({ position: { row, col }, grid })) {
        count++;
      }
    }
  });

  return count;
}

function getWordForDirection({ position, direction, length, grid }) {
  let word = "";
  for (let i = 0; i < length; i++) {
    const letter =
      grid[position.row + direction.row * i]?.[
        position.col + direction.col * i
      ];

    if (letter) {
      word += letter;
    } else {
      break;
    }
  }

  return word;
}

function isXMAS({ position, grid }) {
  const targetWord = "MAS";

  const diag1 = getWordForDirection({
    position: { row: position.row - 1, col: position.col - 1 }, // up-left
    direction: { row: 1, col: 1 }, // down-right
    length: targetWord.length,
    grid,
  });

  const diag2 = getWordForDirection({
    position: { row: position.row + 1, col: position.col - 1 }, // down-left
    direction: { row: -1, col: 1 }, // up-right
    length: targetWord.length,
    grid,
  });

  const diag1Matches =
    diag1 === targetWord || diag1.split("").reverse().join("") === targetWord;
  const diag2Matches =
    diag2 === targetWord || diag2.split("").reverse().join("") === targetWord;

  return diag1Matches && diag2Matches;
}

console.log(part1());
console.log(part2());
