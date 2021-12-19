import Circle from '../Circle.js';

export default class CircleBouncing extends Circle {

  constructor({x, y , r, velX = 0, velY = 0, color}) {
    // On voit ici une première problématique de l'héritage.
    // On a mal pensé la classe mère pour sa spécialisation.
    // En effet la direction et la vitesse héritées n'ont pas de sens ici.
    // Il faudrait donc ré-achitecturer la classe mère, ou changer l'architecture actuelle
    super({x, y, r, speed: 0, dir: 0, color});
    this.velX = velX;
    this.velY = velY;
  }

  setVelFromAngle(angle) {
    const speed = Math.sqrt(this.velX**2 + this.velY**2);
    this.velX = Math.cos(angle) * speed;
    this.velY = Math.sin(angle) * speed;
  }

  move(deltaT) {
    let distX = this.velX * deltaT;
    let distY = this.velY * deltaT;
    this.x += distX;
    this.y += distY;
  }

  bounceOffTheWalls(ctx, withElasticity = true, elasticity = 1) {
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
        this.velY += elasticity;
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

  applyGravity(deltaT, gravity = 0.01) {
    this.velY += gravity * deltaT;
  }

}