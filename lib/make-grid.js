function makeGrid(text, splitRow = "\n", splitCol = "") {
  const rows = text.split(splitRow);
  return rows.map((row) => row.split(splitCol));
}

module.exports = makeGrid;
