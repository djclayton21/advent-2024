const inputText = require("fs")
  .readFileSync("/Users/djclayton21/Dev/advent-2024/07-bridge-repair/input.txt")
  .toString();
const calibrations = processInput(inputText);

function part1() {
  let totalCalibrationResults = 0;
  for ({ testValue, equationValues } of calibrations) {
    const sequences = getSequences(equationValues, ["+", "*"]);
    for (sequence of sequences) {
      const sequenceValue = calc(sequence);
      if (sequenceValue === testValue) {
        totalCalibrationResults += testValue;
        break;
      }
    }
  }

  return totalCalibrationResults;
}

function part2() {
  let totalCalibrationResults = 0;
  for ({ testValue, equationValues } of calibrations) {
    const sequences = getSequences(equationValues, ["+", "*", "||"]);
    for (sequence of sequences) {
      const sequenceValue = calc(sequence);
      if (sequenceValue === testValue) {
        totalCalibrationResults += testValue;
        break;
      }
    }
  }

  return totalCalibrationResults;
}

console.log(part1());
console.log(part2());

function processInput(inputText) {
  const lines = inputText.split("\n");

  const calibrations = lines.map((line) => {
    const [testValue, equationText] = line.split(":");
    const equationValues = equationText.trim().split(" ").map(Number);
    return { testValue: Number(testValue), equationValues };
  });

  return calibrations;
}

function getSequences(values, operations) {
  const sequences = [];
  sequences[0] = [[values[0]]];
  for (let i = 1; i < values.length; i++) {
    const value = values[i];

    const newSequences = sequences
      .at(-1)
      .map((sequence) =>
        operations.map((operation) => [...sequence, operation, value])
      )
      .flat();

    sequences.push(newSequences);
  }

  return sequences.at(-1); // only the last (full) set
}

function calc(sequence) {
  let total = sequence[0];

  for (let i = 1; i < sequence.length; i += 2) {
    const operation = sequence[i];
    const value = sequence[i + 1];

    total = operate(total, value, operation);
  }

  return total;
}

function operate(a, b, operation) {
  switch (operation) {
    case "*":
      return a * b;
    case "+":
      return a + b;
    case "||":
      return Number(String(a) + String(b));
  }
}
