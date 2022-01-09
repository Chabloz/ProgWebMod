import Automaton from '../Automaton.js';

export default class AutomatonWithPathfinding extends Automaton {

  initFlowMap() {
    // create an empty "flow map" matrix of the same size as the actual grid.
    this.flowMap = [];
    for (let row = 0; row < this.rows; row++) {
      this.flowMap[row] = [];
      for (let col = 0; col < this.cols; col++) {
        // By default, there is no path found for the cells
        this.flowMap[row][col] = false;
      }
    }
  }

  flowFieldTo({row, col}) {
    this.initFlowMap();
    // The frontier will store the cells who needs to be visited
    const frontier = [];
    // At the beginning, only the destination is in the frontier
    frontier.push({row, col});
    this.flowMap[row][col] = {row, col};
    // While the frontier is not empty, we must continue to visit the cells inside it
    while (frontier.length > 0) {
      // Get the first cell in the frontier
      const cell = frontier.shift();
      // For each of the "walkables" neighbors (all "alives" neighbors)
      this.getWalkableNeighbors(cell).forEach(next => {
        // Ignore allready visited cells
        if (this.flowMap[next.row][next.col] === false) {
          //  the current neighbor need to be visited. So we put it in the frontier.
          frontier.push(next);
          // Store the actual cell as the destination of the current neighbor
          this.flowMap[next.row][next.col] = cell;
        }
      });
    }
    // The destination is the final step. There is no destination from it.
    this.flowMap[row][col] = false;
  }

  getWalkableNeighbors({row, col}) {
    // Von Neumann neighborhood (without itself)
    let neighbors = [
      {row: row + 1, col},
      {row: row - 1, col},
      {row, col: col + 1},
      {row, col: col - 1}
    ];
    // add diag for Moore neighborhood
    let diagNeighbors = [
      {row: row + 1, col: col - 1},
      {row: row + 1, col: col + 1},
      {row: row - 1, col: col + 1},
      {row: row - 1, col: col - 1}
    ];
    // Disallow diag move, if the two adjacents neighbors are not walkable
    diagNeighbors = diagNeighbors.filter(cell =>
         this.isWalkable({row, col: cell.col})
      && this.isWalkable({row: cell.row, col})
    );
    neighbors = neighbors.concat(diagNeighbors);
    neighbors = neighbors.filter(cell => this.isWalkable(cell));
    return neighbors;
  }

  isWalkable(cell) {
    return this.isValidPos(cell) && this.grid[cell.row][cell.col];
  }

  getNextCell(cell) {
    return this.flowMap[cell.row][cell.col];
  }

  drawFlowArrows(ctx) {
    ctx.fillStyle = 'black';
    ctx.font = `${this.tileSize / 2}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.flowMap[row][col] !== false) {
          const flowTo = this.flowMap[row][col];
          const angle = Math.atan2(flowTo.row - row, flowTo.col - col);
          const {x, y} = this.convertRowColToPixel({row, col});
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.fillText('→', 0, 0);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
      }
    }
  }

}