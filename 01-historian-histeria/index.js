const { readFileSync } = require("fs");

function processInput(filename) {
  const text = readFileSync(filename).toString();
  const lines = text.split("\n");
  const { list1, list2 } = lines.reduce(
    (acc, line) => {
      const [one, two] = line.split(/\s+/);

      // sort here?
      acc.list1.push(parseInt(one));
      acc.list2.push(parseInt(two));

      return acc;
    },
    { list1: [], list2: [] }
  );
  return { list1, list2 };
}

function part1() {
  const { list1, list2 } = processInput("./input.txt");
  const sortedList1 = list1.sort();
  const sortedList2 = list2.sort();

  let total = 0;

  for (let i = 0; i < sortedList1.length; i++) {
    total += Math.abs(sortedList1[i] - sortedList2[i]);
  }

  return total;
}

console.log(part1());

function part2() {
  const { list1, list2 } = processInput("./input.txt");

  let total = 0;
  for (let i = 0; i < list1.length; i++) {
    total += similarity(list1[i], list2);
  }

  return total;
}

function similarity(num, list) {
  const appearances = list.filter((n) => n === num).length;
  return appearances * num;
}

console.log(part2());