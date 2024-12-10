const inputText = require("fs")
  .readFileSync(
    "/Users/djclayton21/Dev/advent-2024/09-disk-fragmenter/input.txt"
  )
  .toString();

function part1() {
  const inflated = inflate(inputText);
  const filled = fill(inflated);
  return checksum(filled);
}

function part2() {
  const inflated = inflate(inputText);
  const { files } = findContinuous(inflated);

  for (let i = files.length - 1; i >= 0; i--) {
    const { spaces } = findContinuous(inflated);

    for (space of spaces) {
      const swapped = tryToSwapInPlace(files[i], space, inflated); // mutates
      if (swapped) {
        break;
      }
    }
  }

  return checksum(inflated);
}

console.log(part1());
console.log(part2());

function inflate(diskMap) {
  const blocks = diskMap.split("").map(Number);
  const inflated = [];

  for (let i = 0; i < blocks.length; i += 2) {
    const id = i / 2;
    const fileBlocks = Array(blocks[i]).fill(id);
    inflated.push(...fileBlocks);
    if (blocks[i + 1]) {
      const emptyBlocks = Array(blocks[i + 1]).fill(".");
      inflated.push(...emptyBlocks);
    }
  }

  return inflated;
}

function fill(inflated) {
  const unfilled = [...inflated];
  const filled = [];

  while (unfilled.length) {
    const first = unfilled.shift();
    if (first === ".") {
      const last = popLastFileBlock(unfilled);
      filled.push(last);
    } else {
      filled.push(first);
    }
  }

  return filled;
}

function popLastFileBlock(unfilled) {
  while (unfilled.length) {
    const last = unfilled.pop();
    if (last !== ".") {
      return last;
    }
  }
}

function tryToSwapInPlace(
  { start: fileStart, length: fileLength },
  { start: spaceStart, length: spaceLength },
  diskMap
) {
  if (spaceLength >= fileLength && spaceStart < fileStart) {
    const file = diskMap.splice(fileStart, fileLength);
    const space = diskMap.splice(spaceStart, fileLength, ...file);
    diskMap.splice(fileStart, 0, ...space);
    return true;
  }
}

function findContinuous(diskMap) {
  const files = [];
  const spaces = [];
  let current = { id: diskMap[0], start: 0, length: 1 };

  for (let i = 1; i <= diskMap.length; i++) {
    const id = diskMap[i];

    if (current?.id === id) {
      current.length++;
    } else {
      if (current.id === ".") {
        spaces.push(current);
      } else {
        files.push(current);
      }
      current = { id, start: Number(i), length: 1 };
    }
  }

  return { files, spaces };
}

function checksum(filled) {
  let sum = 0;
  for (let i = 0; i < filled.length; i++) {
    if (filled[i] !== ".") {
      sum += i * filled[i];
    }
  }
  return sum;
}
