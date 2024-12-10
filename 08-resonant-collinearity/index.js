const inputText = require("fs")
  .readFileSync(
    "/Users/djclayton21/Dev/advent-2024/08-resonant-collinearity/input.txt"
  )
  .toString();
const { makeGrid, scanGrid, unmakeGrid } = require("../lib");

function groupAntennas(grid) {
  const antennas = {};

  scanGrid(grid, ({ row, col, val }) => {
    if (val === "." || val === "#") {
      return;
    }

    if (antennas[val]) {
      antennas[val].push({ row, col });
    } else {
      antennas[val] = [{ row, col }];
    }
  });

  return antennas;
}

function getAntinodesForPoints(pointA, pointB, boundary, limit = 1) {
  if (pointA.row === pointB.row && pointA.col === pointB.col) {
    return [];
  }
  const diff = { row: pointB.row - pointA.row, col: pointB.col - pointA.col };

  const nodes = [];

  let inBounds = true;
  let count = 0;
  let multiplier = 1;
  while (inBounds && (count < limit || limit === 0)) {
    const nextA = {
      row: pointA.row - diff.row * multiplier,
      col: pointA.col - diff.col * multiplier,
    };
    if (isInBounds(nextA, boundary)) {
      nodes.push(nextA);
      count++;
      multiplier++;
    } else {
      inBounds = false;
    }
  }

  inBounds = false;
  count = 0;
  multiplier = 1;
  while (inBounds && (count < limit || limit === 0)) {
    const nextB = {
      row: pointB.row + diff.row * multiplier,
      col: pointB.col + diff.col * multiplier,
    };
    if (isInBounds(nextB, boundary)) {
      nodes.push(nextB);
      count++;
      multiplier++;
    } else {
      inBounds = false;
    }
  }

  return nodes;
}

function isInBounds(point, boundary) {
  return (
    point.row >= 0 &&
    point.col >= 0 &&
    point.row < boundary.row &&
    point.col < boundary.col
  );
}

function getValueAtPoint(point, grid) {
  return grid[point.row]?.[point.col];
}

function setValueAtPoint(point, grid, value) {
  if (getValueAtPoint(point, grid) && value) {
    grid[point.row][point.col] = value;
  }
}

function getAntinodesForList(locations, boundary, limit) {
  const antinodes = [];
  for (antenna of locations) {
    const newAntinodes = locations.reduce((nodes, otherAntenna) => {
      const newPair = getAntinodesForPoints(
        antenna,
        otherAntenna,
        boundary,
        limit
      );
      return nodes.concat(newPair);
    }, []);

    antinodes.push(...newAntinodes);
  }

  return antinodes;
}

function part1() {
  const grid = makeGrid(inputText);
  const boundary = { row: grid.length, col: grid[0].length };
  const antennas = groupAntennas(grid);
  const allAntinodes = [];

  for (antennaLocations of Object.values(antennas)) {
    const antinodesForAntenna = getAntinodesForList(antennaLocations, boundary);
    allAntinodes.push(...antinodesForAntenna);
  }

  allAntinodes.forEach((node) => {
    setValueAtPoint(node, grid, "#");
  });

  console.log(unmakeGrid(grid));

  return grid.flat().filter((val) => val === "#").length;
}

function part2() {
  const grid = makeGrid(inputText);
  const boundary = { row: grid.length, col: grid[0].length };
  const antennas = groupAntennas(grid);
  const allAntinodes = [];

  for (antennaLocations of Object.values(antennas)) {
    const antinodesForAntenna = getAntinodesForList(
      antennaLocations,
      boundary,
      0
    );
    allAntinodes.push(...antinodesForAntenna);
  }

  allAntinodes.forEach((node) => {
    setValueAtPoint(node, grid, "#");
  });

  console.log(unmakeGrid(grid));

  return grid.flat().filter((val) => val !== ".").length;
}

console.log(part1());
console.log(part2());
