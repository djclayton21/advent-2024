const { readFileSync } = require("fs");
const text = readFileSync("./input.txt").toString();

const multiplyRegex = /mul\(\d{1,3}\,\d{1,3}\)/g;

const combinedRegex = /(mul|do|don't)\(\d{0,3}\,*\d{0,3}\)/g;

function part1() {
  const validInstructions = text.match(multiplyRegex);
  return validInstructions.reduce(
    (acc, instruction) => (acc += mul(instruction)),
    0
  );
}

function part2() {
  const validInstructions = text.match(combinedRegex);

  let doing = true;
  let sum = 0;

  for (const instruction of validInstructions) {
    if (instruction === "do()") {
      doing = true;
      continue;
    }
    if (instruction === "don't()") {
      doing = false;
      continue;
    }
    if (doing) {
      sum += mul(instruction);
    }
  }

  return sum;
}

function mul(instruction) {
  const [a, b] = instruction.match(/\d+/g);

  return a * b;
}

console.log(part1());
console.log(part2());
