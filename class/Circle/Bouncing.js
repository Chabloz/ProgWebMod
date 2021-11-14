import Circle from '../Circle.js';

export default class CircleBouncing extends Circle {

  constructor({x, y , r, velX = 0, velY = 0, color}) {
    // on voit ici une première problématique de l'heritage
    // si on a mal pensé la classe mère pour sa spécialisation
    // en effet la direction et la vitesse héritées n'ont pas de sens ici
    super({x, y, r, speed: 0, dir: 0, color});
    this.velX = velX;
    this.velY = velY;
    this.gravity = 10;
  }

  move(deltaT) {
    let distX = this.velX * deltaT;
    let distY = this.velY * deltaT;
    this.x += distX;
    this.y += distY;
  }

  bounceOffTheWalls(ctx, withElasticity = true) {
    let width = ctx.canvas.width;
    let height = ctx.canvas.height;
    if (this.x + this.r > width) {
      this.velX = -Math.abs(this.velX);
      this.x = width - this.r;
    }
    if (this.x - this.r < 0) {
      this.velX = +Math.abs(this.velX);
      this.x = this.r;
    }
    if (this.y + this.r > height) {
      this.velY = -Math.abs(this.velY);
      this.y = height - this.r;
      if (withElasticity) {
        this.velY += this.gravity / 10;
      }
    }
    if (this.y - this.r < 0) {
      this.velY = +Math.abs(this.velY);
      this.y = this.r;
    }
  }

  applyFloorFriction(deltaT, ctx, friction = 0.001) {
    // if the circle is not "on the floor", no friction
    if (this.y + this.r < ctx.canvas.height) return;
    if (this.velX > 0) {
     this.velX -= friction * deltaT;
     this.velX = Math.max(0, this.velX);
   } else {
     this.velX += friction * deltaT;
     this.velX = Math.min(0, this.velX);
   }
 }

  applyGravity(deltaT) {
    this.velY += this.gravity/1000 * deltaT;
  }

}