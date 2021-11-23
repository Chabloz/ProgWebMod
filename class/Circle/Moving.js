import Circle from '../Circle.js';

export default class Moving extends Circle {

  thrust(dt, factor) {
    this.speed += dt * factor;
  }

  friction(dt, factor) {
    this.speed *= 1 - dt/1000 * factor;
  }

  rotate(dt, radianFactor){
    this.dir += dt * radianFactor;
  }

  draw(ctx) {
    super.draw(ctx);

    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 10;
    ctx.moveTo(this.x, this.y);
    const distX = this.r * 1.5 * Math.cos(this.dir);
    const distY = this.r * 1.5 * Math.sin(this.dir);
    ctx.lineTo(this.x + distX, this.y + distY);
    ctx.closePath();
    ctx.stroke();
  }

}