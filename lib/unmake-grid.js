module.exports = function unmakeGrid(grid, joinRow = "\n", joinCol = "") {
  const lines = [];
  for (row of grid) {
    lines.push(row.join(joinCol));
  }
  return lines.join(joinRow);
};
