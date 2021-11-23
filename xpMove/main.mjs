import Circle from '../class/Circle/Moving.js';
import randomColor from '../lib/randomColor.js';
import MainLoop from '../lib/mainloop.js';
import Keyboard from '../class/Keyboard.js';

const ctx = document.querySelector('canvas').getContext('2d');
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const keyboard  = new Keyboard();

const player = new Circle({
  x: ctx.canvas.width / 2,
  y: ctx.canvas.height / 2,
  r: 30,
  speed: 0,
  dir: 0,
  color: randomColor()
});


function manageInput(dt) {
  if (keyboard.isKeyDown('KeyW')) player.thrust(dt, 0.001);
  if (keyboard.isKeyDown('KeyS')) player.thrust(dt, -0.001);
  if (keyboard.isKeyDown('KeyD')) player.rotate(dt, Math.PI/1000);
  if (keyboard.isKeyDown('KeyA')) player.rotate(dt, -Math.PI/1000);
}

MainLoop.setUpdate(dt => {
  manageInput(dt);
  player.move(dt);
  player.friction(dt, 0.97);
});
MainLoop.setDraw(() => {
  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;
  player.draw(ctx);
});
MainLoop.setEnd((fps, panic) => {
  if (!panic) return;
  MainLoop.resetFrameDelta();
});
MainLoop.start();