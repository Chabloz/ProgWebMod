const DEAD = 0;
const ALIVE = 1;

export default class Automaton {

  constructor({
    width = 10,
    height = 10,
    isAliveProb = 0,
    birthRule = new Set([3]), // Game of Life birth rule by default
    survivalRule = new Set([2, 3]),  // Game of Life survival rule by default
    tileSize = 15,
    aliveColor = 'white',
    deadColor = 'black'
  } = {}) {
    this.width = width;
    this.height = height;
    this.birthRule = birthRule;
    this.survivalRule = survivalRule;
    this.tileSize = tileSize;
    this.aliveColor = aliveColor;
    this.deadColor = deadColor;
    this.randomize(isAliveProb);
  }

  randomize(isAliveProb) {
    this.grid = [];
    for (let x = 0; x < this.width; x++) {
      this.grid[x] = [];
      for (let y = 0; y < this.height; y++) {
        this.grid[x][y] = Math.random() < isAliveProb ? ALIVE : DEAD;
      }
    }
  }

  applyRule() {
    const toSwitch = [];

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const pos = {x, y};
        const cell = this.grid[x][y];
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

  toggleState({x, y}) {
    this.grid[x][y] = (this.grid[x][y] + 1) % 2;
  }

  countAliveMooreNeighborhood({x, y, chebyshevDistance = 1}) {
    const startX = Math.max(0, x - chebyshevDistance);
    const endX = Math.min(this.width - 1, x + chebyshevDistance);
    const startY = Math.max(0, y - chebyshevDistance);
    const endY = Math.min(this.height - 1, y + chebyshevDistance);

    let nbAliveNeighbors = 0;
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        if (this.grid[x][y]) nbAliveNeighbors++;
      }
    }

    return nbAliveNeighbors;
  }

  drawTiles(ctx) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const cell = this.grid[x][y];
        ctx.fillStyle = cell == ALIVE ? this.aliveColor : this.deadColor;
        ctx.fillRect(x * this.tileSize + 1, y * this.tileSize + 1, this.tileSize - 1, this.tileSize - 1);
      }
    }
  }



}