function scanGrid(grid, callback) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      callback({ row, col, val: grid[row][col], grid });
    }
  }
}

module.exports = scanGrid;
