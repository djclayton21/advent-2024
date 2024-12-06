function processInput(filename) {
  const { readFileSync } = require("fs");
  const text = readFileSync(`./${filename}`).toString();
  const reports = text
    .split("\n")
    .map((report) => report.split(/\s+/).map((num) => parseInt(num)));
  return reports;
}

function part1() {
  const reports = processInput("input.txt");
  const safeReports = reports.filter(checkReport);

  return safeReports.length;
}

function part2() {
  const reports = processInput("input.txt");
  const count = reports.reduce((count, report) => {
    const isSafe = checkReport(report);
    if (isSafe) {
      return count + 1;
    } else {
      if (tryToDampen(report)) {
        return count + 1;
      } else {
        return count;
      }
    }
  }, 0);

  return count;
}

function tryToDampen(report) {
  for (let i = 0; i < report.length; i++) {
    const reportWithoutLevel = [...report.slice(0, i), ...report.slice(i + 1)];
    if (checkReport(reportWithoutLevel)) {
      return true;
    }
  }
  return false;
}

function checkReport(report) {
  const direction = report[0] - report[1] > 0 ? -1 : 1;
  for (let i = 1; i < report.length; i++) {
    const diff = report[i - 1] - report[i];
    const newDirection = diff > 0 ? -1 : 1;
    if (newDirection !== direction) {
      return false;
    }

    if (Math.abs(diff) < 1) {
      return false;
    }

    if (Math.abs(diff) > 3) {
      return false;
    }
  }

  return true;
}

console.log("part1", part1());
console.log("part2", part2());
