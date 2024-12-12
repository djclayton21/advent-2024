const inputText = require("fs")
  .readFileSync(__dirname + "/input.txt")
  .toString();

function part1() {
  const blinks = 25;
  let stones = inputText.split(" ");

  for (let i = 0; i < blinks; i++) {
    stones = blink(stones);
  }

  return stones.length;
}

function part2() {
  const blinks = 75;
  let stones = inputText.split(" ");
  const memory = remember(stones);
  const total = stones.reduce((count, stone) => {
    return (count += getCountAtDepth(stone, memory, blinks));
  }, 0);

  return total;
}

console.log(part2());

function getChildren(stone) {
  if (stone === "0") {
    return ["1"];
  } else if (stone.length % 2 === 0) {
    const chars = stone.split("");
    const left = chars.slice(0, chars.length / 2).join("");
    const right = chars.slice(chars.length / 2).join("");

    return [left, String(parseInt(right))];
  } else {
    return [String(parseInt(stone) * 2024)];
  }
}

function getCountAtDepth(stone, memory, depth) {
  const entry = memory[stone];
  const countAtDepth = entry.count[depth];

  if (countAtDepth) {
    return countAtDepth;
  }

  const childCount = entry.children.reduce((childCount, childStone) => {
    return (childCount += getCountAtDepth(childStone, memory, depth - 1));
  }, 0);

  entry.count[depth] = childCount;
  return childCount;
}

function blink(stones) {
  const newStones = [];
  for (stone of stones) {
    newStones.push(...getChildren(stone));
  }
  return newStones;
}

function remember(stones) {
  const memory = {};
  const todo = [];
  let current;

  todo.push(...stones);

  while (todo.length) {
    current = todo.pop();

    if (!memory[current]) {
      const children = getChildren(current);
      memory[current] = { children, count: [1] };
      todo.push(...children);
    }
  }

  return memory;
}
