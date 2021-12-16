import Automaton from '../Automaton.js';
import {moduloEuclidian} from '../../lib/math.js';


export default class AutomatonInFlatTorus extends Automaton {

  countAliveMooreNeighborhood({row, col, chebyshevDistance = 1}) {
    const startRow = row - chebyshevDistance;
    const endRow = row + chebyshevDistance;
    const startCol = col - chebyshevDistance;
    const endCol = col + chebyshevDistance;

    let nbAliveNeighbors = 0;
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const posRow = moduloEuclidian(row, this.rows);
        const posCol = moduloEuclidian(col, this.cols);
        if (this.grid[posRow][posCol]) nbAliveNeighbors++;
      }
    }

    return nbAliveNeighbors;
  }

}