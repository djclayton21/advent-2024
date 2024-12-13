const inputText = require("fs")
  .readFileSync(__dirname + "/input.txt")
  .toString();

const { makeGrid, scanGrid, unmakeGrid } = require("../lib");

class Plot {
  todo = [];
  points = [];
  sides = [];
  directions = {
    down: { row: 1, col: 0 },
    right: { row: 0, col: 1 },
    up: { row: -1, col: 0 },
    left: { row: 0, col: -1 },
  };
  constructor(garden, startPoint, plant) {
    this.garden = garden;
    this.plant = plant;
    this.plot = Array(garden.length)
      .fill(null)
      .map(() => Array(garden[0].length).fill("."));
    this.todo.push({ ...startPoint, plant });
    this.fill();
    this.addAllSides();
  }
  fill() {
    while (this.todo.length) {
      const current = this.todo.pop();

      const neighbors = this.getNeighbors(current);
      neighbors.forEach((neighbor) => {
        if (!this.isInPlot(neighbor) && neighbor.plant === this.plant) {
          this.todo.push(neighbor);
        }
      });

      if (!this.isInPlot(current)) {
        this.plot[current.row][current.col] = current.plant;
        this.points.push(current);
      }
    }
  }
  getNeighbors(point) {
    return Object.entries(this.directions).map(([dir, vector]) => {
      const row = point.row + vector.row;
      const col = point.col + vector.col;
      return {
        row,
        col,
        plant: this.garden[row]?.[col],
        rel: dir,
      };
    });
  }
  getBorders(point) {
    return this.getNeighbors(point).filter(
      (neighbor) => neighbor.plant !== this.plant
    );
  }
  countBorders(point) {
    return this.getBorders(point).length;
  }
  isInPlot(point) {
    return this.plot[point.row]?.[point.col] === this.plant;
  }
  isInSides(point, rel) {
    const isInSides = this.sides.some((side) =>
      side.some(
        (plant) =>
          plant.row === point.row &&
          plant.col === point.col &&
          plant.rel === rel
      )
    );
    return isInSides;
  }
  addAllSides() {
    this.points.forEach((point) => this.addNewSides(point));
  }
  addNewSides(point) {
    const borders = this.getBorders(point);

    borders.forEach((border) => {
      if (!this.isInSides(point, border.rel)) {
        const newSide = this.followBorder(point, border.rel);
        this.sides.push(newSide);
      }
    });
  }
  getSideDirections(rel) {
    switch (rel) {
      case "up":
      case "down":
        return ["left", "right"];
      case "left":
      case "right":
        return ["up", "down"];
    }
  }
  followBorder(point, rel) {
    const side = [{ ...point, rel }];
    let loop = true;
    const [oneDirection, theOther] = this.getSideDirections(rel);

    while (loop) {
      const current = side[0];
      const next = {
        row: current.row + this.directions[oneDirection].row,
        col: current.col + this.directions[oneDirection].col,
        rel,
      };
      if (this.sideContinues(next, rel)) {
        side.unshift(next);
      } else {
        loop = false;
      }
    }

    loop = true;
    while (loop) {
      const current = side[side.length - 1];
      const next = {
        row: current.row + this.directions[theOther].row,
        col: current.col + this.directions[theOther].col,
        rel,
      };

      if (this.sideContinues(next, rel)) {
        side.push(next);
      } else {
        loop = false;
      }
    }

    return side;
  }
  sideContinues(point, sideRel) {
    if (!this.isInPlot(point)) {
      return false;
    }

    const borderThatMatchesSide = this.getBorders(point).filter(
      (border) => border.rel === sideRel
    );

    return borderThatMatchesSide.length > 0;
  }
  area() {
    return this.points.length;
  }
  perimeter() {
    return this.points.reduce((total, point) => {
      return (total += this.countBorders(point));
    }, 0);
  }
  countSides() {
    return this.sides.length;
  }
  get price() {
    return this.area() * this.perimeter();
  }
  get premium() {
    return this.area() * this.countSides();
  }
  get pretty() {
    return unmakeGrid(this.plot);
  }
}

function part1and2() {
  const garden = makeGrid(inputText);

  const plots = [];
  scanGrid(garden, ({ row, col, val, grid }) => {
    if (!plots.some((Plot) => Plot.isInPlot({ row, col }))) {
      plots.push(new Plot(grid, { row, col }, val));
    }
  });

  return plots.reduce(
    ({ price, premium }, Plot) => ({
      price: price + Plot.price,
      premium: premium + Plot.premium,
    }),
    { price: 0, premium: 0 }
  );
}

console.log(part1and2());
