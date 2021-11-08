import {getRandomInt} from '../lib/math.js';
import Circle from '../class/Circle/InFlatTorus.js';
import Keyboard from '../class/Keyboard.js';
import randomColor from '../lib/randomcolor.js';

const ctx = document.querySelector('canvas').getContext('2d');
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const keyboard  = new Keyboard();

const getAngleFromKeyPressed = () => {
  if (keyboard.isKeysDown('KeyA', 'KeyW')) return Math.PI * 0.25;
  if (keyboard.isKeysDown('KeyA', 'KeyS')) return Math.PI * 1.75;
  if (keyboard.isKeysDown('KeyD', 'KeyW')) return Math.PI * 0.75;
  if (keyboard.isKeysDown('KeyD', 'KeyS')) return Math.PI * 1.25;
  if (keyboard.isKeyDown('KeyS')) return Math.PI * 1.5;
  if (keyboard.isKeyDown('KeyD')) return Math.PI;
  if (keyboard.isKeyDown('KeyW')) return Math.PI * 0.5;
  if (keyboard.isKeyDown('KeyA')) return 0;
  return false;
}

let circles = [];

for (let i = 0; i < 300; i++) {
  let r = getRandomInt(3, Math.max(i / 5, 3));

  circles.push(new Circle({
    x: getRandomInt(0, ctx.canvas.width),
    y: getRandomInt(0, ctx.canvas.height),
    speed: r / 100, // [pixel / ms] // (pixel is not a very good choice for a unit, but this will be ok for our first animation)
    r,
    dir: 0, // radian
    color: randomColor()
  }));
}

circles.sort((c1, c2) => c1.compareTo(c2));

let lastTime = 0;

function tick(time) {
  // Animation loop
  requestAnimationFrame(tick);

  // Delta time from last frame
  const dt = time - lastTime;
  lastTime = time;

  // if dt is too high, we skip the world update and rendering for now
  // Hopefully, we will catch up on the next tick call
  if (dt >= 1000/30) return;

  // User inputs management
  let angle = getAngleFromKeyPressed();

  // World update
  if (angle !== false) {
    circles.forEach(c => c.setDir(angle));
    circles.forEach(c => c.move(dt, ctx.canvas.width, ctx.canvas.height));
  }

  // Clean all
  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;
  // Draw all
  circles.forEach(c => c.draw(ctx));
}

// Start the animation loop
requestAnimationFrame(tick);