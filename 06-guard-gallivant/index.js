const { readFileSync } = require("fs");
const { makeGrid, scanGrid } = require("../lib");

const inputText = readFileSync("./input.txt").toString();

class Guard {
  constructor(grid, orientation = "up") {
    this.map = grid;
    this.position = this.getInitialPosition(this.map);
    this.updateValueAtPosition(this.position, "X");
    this.orientation = orientation;
    this.positionsVisited = 1;
    this.countRightTurns = 0;
  }
  getInitialPosition(map) {
    for (let row = 0; row < map.length; row++) {
      const col = map[row].indexOf("^");
      if (col !== -1) {
        return { row, col };
      }
    }
  }
  valueAtPosition({ row, col }) {
    return this.map[row]?.[col];
  }
  updatePosition({ row, col }) {
    this.position = { row, col };
  }
  updateValueAtPosition({ row, col }, value) {
    this.map[row][col] = value;
  }
  #directions = {
    up: { row: -1, col: 0 },
    right: { row: 0, col: 1 },
    down: { row: 1, col: 0 },
    left: { row: 0, col: -1 },
  };
  turnRight() {
    this.countRightTurns += 1;
    switch (this.orientation) {
      case "up":
        this.orientation = "right";
        break;
      case "right":
        this.orientation = "down";
        break;
      case "down":
        this.orientation = "left";
        break;
      case "left":
        this.orientation = "up";
        break;
    }
  }
  moveForward() {
    if (this.aheadValue === ".") {
      this.positionsVisited += 1;
      this.countRightTurns = 0;
    }
    this.updatePosition(this.aheadPosition);
    this.updateValueAtPosition(this.position, "X");
  }
  get aheadPosition() {
    return {
      row: this.position.row + this.#directions[this.orientation].row,
      col: this.position.col + this.#directions[this.orientation].col,
    };
  }
  get aheadValue() {
    const value = this.valueAtPosition(this.aheadPosition);

    if (value) {
      return value;
    } else {
      return null;
    }
  }
  get isInALoop() {
    return this.countRightTurns > 4;
  }
}

function part1() {
  const grid = makeGrid(inputText);
  const bob = new Guard(grid);

  while (bob.aheadValue !== null) {
    if (bob.aheadValue === "#") {
      bob.turnRight();
    } else {
      bob.moveForward();
    }
  }

  return bob.positionsVisited;
}

function part2() {
  const grid = makeGrid(inputText);
  let validObstructions = 0;

  scanGrid(grid, ({ row, col, val }) => {
    if (val === ".") {
      const newGrid = makeGrid(inputText);
      newGrid[row][col] = "#";
      const george = new Guard(newGrid);

      while (george.aheadValue !== null) {
        if (george.isInALoop) {
          validObstructions++;
          return;
        }
        if (george.aheadValue === "#") {
          george.turnRight();
        } else {
          george.moveForward();
        }
      }
    }
  });
  return validObstructions;
}

console.log(part2());
