import Circle from '../Circle.js';

export default class Alpha extends Circle {

  constructor({x, y , r, color, alpha = 1}) {
    super({x, y, r, speed: 0, dir: 0, color});
    this.alpha = alpha
  }

  draw(ctx) {
    ctx.globalAlpha = this.alpha;
    super.draw(ctx);
    ctx.globalAlpha = 1;
  }

}