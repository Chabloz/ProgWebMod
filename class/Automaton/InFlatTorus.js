import Automaton from '../Automaton.js';
import {moduloEuclidian} from '../../lib/math.js';


export default class AutomatonInFlatTorus extends Automaton {

  countAliveMooreNeighborhood({x, y, chebyshevDistance = 1}) {
    const startX = x - chebyshevDistance;
    const endX = x + chebyshevDistance;
    const startY = y - chebyshevDistance;
    const endY = y + chebyshevDistance;

    let nbAliveNeighbors = 0;
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const posX = moduloEuclidian(x, this.width);
        const posY = moduloEuclidian(y, this.height);
        if (this.grid[posX][posY]) nbAliveNeighbors++;
      }
    }

    return nbAliveNeighbors;
  }

}