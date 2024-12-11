const inputText = require("fs")
  .readFileSync(__dirname + "/input.txt")
  .toString();

const { makeGrid, scanGrid } = require("../lib");

const directions = [
  { row: 1, col: 0 }, // down
  { row: 0, col: 1 }, // right
  { row: -1, col: 0 }, // up
  { row: 0, col: -1 }, // left
];

function part1And2() {
  const topo = makeGrid(inputText);
  const trailHeads = findTrailHeads(topo);

  return trailHeads.reduce(
    ({ totalScore, totalRating }, trailHead) => {
      const { score, rating } = scoreAndRateTrail(topo, trailHead);
      return {
        totalScore: totalScore + score,
        totalRating: totalRating + rating,
      };
    },
    { totalScore: 0, totalRating: 0 }
  );
}

console.log(part1And2());

function findTrailHeads(topo) {
  const trailHeads = [];

  scanGrid(topo, ({ row, col, val }) => {
    if (val === "0") {
      trailHeads.push({ height: val, row, col });
    }
  });

  return trailHeads;
}

function scoreAndRateTrail(topo, start) {
  const todo = [start];
  const peaks = [];

  while (todo.length) {
    const position = todo.shift();
    const nextSteps = getNextSteps(topo, position);
    nextSteps.forEach((step) => {
      if (step.height === "9") {
        peaks.push(step);
      } else {
        todo.push(step);
      }
    });
  }

  const unique = new Set(peaks.map(JSON.stringify));

  return { score: unique.size, rating: peaks.length };
}

function getNextSteps(topo, position) {
  const neighbors = directions.map((direction) => {
    const row = position.row + direction.row;
    const col = position.col + direction.col;
    const height = topo[row]?.[col];
    return { height, row, col };
  });

  return neighbors.filter(({ height }) => {
    if (height !== undefined) {
      return Number(height) === Number(position.height) + 1;
    }
  });
}
