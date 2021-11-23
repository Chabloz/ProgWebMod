import {getRandomInt} from '../lib/math.js';
import Circle from '../class/Circle/Bouncing.js';
import randomColor from '../lib/randomColor.js';
import MainLoop from '../lib/mainloop.js';

const ctx = document.querySelector('canvas').getContext('2d');
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const circles = [];
const maxNbCircle = 100;

function generatePopcorn() {
  let velX = getRandomInt(-10, 10) / 10;
  let velY = getRandomInt(-20, 0) / 10;
  circles.push(new Circle({
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 4,
    r: getRandomInt(10, 50),
    velX,
    velY,
    color: randomColor()
  }));
  // remove an old circle if too much on screen
  if (circles.length > maxNbCircle) circles.shift();
}

let timerPopcorn = 0;
const popcornFreq = 100; // [ms]

MainLoop.setUpdate(dt => {
  timerPopcorn += dt;
  if (timerPopcorn >= popcornFreq) {
    generatePopcorn();
    timerPopcorn -= popcornFreq;
  }
  circles.forEach(c => {
    c.move(dt, ctx.canvas.width, ctx.canvas.height);
    c.applyGravity(dt);
    c.bounceOffTheWalls(ctx);
    c.applyFloorFriction(dt, ctx);
  });
});
MainLoop.setDraw(() => {
  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;
  circles.forEach(c => c.draw(ctx));
});
MainLoop.setEnd((fps, panic) => {
  if (!panic) return;
  MainLoop.resetFrameDelta();
});
MainLoop.start();