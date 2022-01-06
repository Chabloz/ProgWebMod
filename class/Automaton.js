const DEAD = 0;
const ALIVE = 1;

export default class Automaton {

  constructor({
    cols = 10,
    rows = 10,
    isAliveProb = 0,
    birthRule = new Set([3]), // Game of Life birth rule by default
    survivalRule = new Set([2, 3]),  // Game of Life survival rule by default
    tileSize = 15,
    aliveColor = 'white',
    deadColor = 'black'
  } = {}) {
    this.rows = rows;
    this.cols = cols;
    this.birthRule = birthRule;
    this.survivalRule = survivalRule;
    this.tileSize = tileSize;
    this.aliveColor = aliveColor;
    this.deadColor = deadColor;
    this.randomize(isAliveProb);
  }

  randomize(isAliveProb) {
    this.grid = [];
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.grid[row][col] = Math.random() < isAliveProb ? ALIVE : DEAD;
      }
    }
  }

  applyRule() {
    const toSwitch = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const pos = {row, col};
        const cell = this.grid[row][col];
        let nbAliveNeighbors = this.countAliveMooreNeighborhood(pos);
        if (cell == DEAD && this.birthRule.has(nbAliveNeighbors)) {
          toSwitch.push(pos);
        } else if (cell == ALIVE && !this.survivalRule.has(nbAliveNeighbors - 1)) {
          toSwitch.push(pos);
        }
      }
    }

    for (const pos of toSwitch) {
      this.toggleState(pos);
    }
  }

  toggleState({row, col}) {
    this.grid[row][col] = (this.grid[row][col] + 1) % 2;
  }

  isValidPos({row, col}) {
    return row >= 0 && row < this.rows
        && col >= 0 && col < this.cols;
  }

  convertRowColToPixel({row, col}) {
    return {
      x: col * this.tileSize + this.tileSize / 2,
      y: row * this.tileSize + this.tileSize / 2,
    }
  }

  convertPixelToRowCol({x, y}) {
    return {
      row: Math.floor(y / this.tileSize),
      col: Math.floor(x / this.tileSize),
    }
  }

  countAliveMooreNeighborhood({row, col, chebyshevDistance = 1}) {
    const startRow = Math.max(0, row - chebyshevDistance);
    const endRow = Math.min(this.rows - 1, row + chebyshevDistance);
    const startCol = Math.max(0, col - chebyshevDistance);
    const endCol = Math.min(this.rows - 1, col + chebyshevDistance);

    let nbAliveNeighbors = 0;
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        if (this.grid[row][col]) nbAliveNeighbors++;
      }
    }

    return nbAliveNeighbors;
  }

  drawTiles(ctx) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.grid[row][col];
        ctx.fillStyle = cell == ALIVE ? this.aliveColor : this.deadColor;
        ctx.fillRect(col * this.tileSize + 1, row * this.tileSize + 1, this.tileSize - 1, this.tileSize - 1);
      }
    }
  }

}