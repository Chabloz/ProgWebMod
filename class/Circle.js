export default class Circle {

  constructor({x, y, r, speed, dir, color}) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.speed = speed;
    this.dir = dir; // radian
  }

  getRadius() {
    return this.r;
  }

  setSpeed(speed){
    this.speed = speed;
  }

  setColor(color){
    this.color = color;
  }

  setDir(dir){
    this.dir = dir;
  }

  compareTo(otherCircle) {
    // test instanceof ?
    return this.getRadius() - otherCircle.getRadius();
  }

  isInCircle(x, y, r = 0) {
    return Math.abs(x - this.x) ** 2 + Math.abs(y - this.y) ** 2 <= Math.abs(r + this.r) ** 2;
  }

  isCircleInCollision(otherCircle) {
    return this.isInCircle(otherCircle.x, otherCircle.y, otherCircle.r)
  }

  getAngleFromPoint(x, y) {
    return Math.atan2(x - this.x, y - this.y);
  }

  distanceFrom(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx**2 + dy**2);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }

  move(deltaT) {
    const distX = this.speed * deltaT * Math.cos(this.dir);
    const distY = this.speed * deltaT * Math.sin(this.dir);
    this.x += distX;
    this.y += distY;
  }

}