const { readFileSync } = require("fs");
const inputText = readFileSync("./input.txt").toString();
const { rules, updates } = processInput(inputText);

function part1() {
  const validUpdates = updates.filter((update) =>
    checkUpdate({ update, rules })
  );

  return validUpdates.reduce(
    (acc, update) => (acc += getMiddleNumber(update)),
    0
  );
}

function part2() {
  const invalidUpdates = updates.filter(
    (update) => !checkUpdate({ update, rules })
  );

  const fixedUpdates = invalidUpdates.map((update) => {
    while (!checkUpdate({ update, rules })) {
      // mutating :x
      adjustUpdate({ update, rules });
    }

    return update;
  });

  return fixedUpdates.reduce(
    (acc, update) => (acc += getMiddleNumber(update)),
    0
  );
}

console.log(part1());
console.log(part2());

function processInput(text) {
  // separate rules from updates
  const [rulesText, updatesText] = text.split("\n\n");

  // rules and updates by line.
  const rules = rulesText
    .split("\n")
    .map((rule) => rule.split("|").map(Number));
  const updates = updatesText
    .split("\n")
    .map((update) => update.split(",").map(Number));
  // or, leave together for regex? nah

  return { rules, updates };
}

function checkUpdate({ update, rules }) {
  return rules.every((rule) => doesUpdatePassRule(update, rule));
}

function doesUpdatePassRule(update, [a, b]) {
  // if we find b first, take note
  // if we find a after b, fail
  // if no fails, pass
  let firstFound = null;
  for (const page of update) {
    if (page === a) {
      if (firstFound) {
        return false;
      }
    } else if (page === b) {
      firstFound = true;
    }
  }
  return true;
}

function getMiddleNumber(update) {
  // are they always odd? yes
  return update[Math.floor(update.length / 2)];
}

function adjustUpdate({ update, rules }) {
  for ([a, b] of rules) {
    if (!doesUpdatePassRule(update, [a, b])) {
      const indexA = update.indexOf(a);
      const indexB = update.indexOf(b);

      update.splice(indexA, 1);
      update.splice(indexB, 0, a);
    }
  }
  return update;
}

function doesUpdateHaveDuplicates(update) {
  return update.length === new Set(update).length;
  // there are no duplicates
}


