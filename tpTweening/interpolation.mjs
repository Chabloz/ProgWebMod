import Circle from '../class/Circle/Bouncing.js';
import Tweens, {timings} from '../class/Tweens.js';
import {domOn} from '../lib/dom.js';
import {getRandomInt} from '../lib/math.js';
import MainLoop from '../lib/mainloop.js';

const ctx = document.querySelector('canvas').getContext('2d');
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const tweens = new Tweens();
const tweenOpts = {from: 20, to: 320, duration: 2000, loop: true, yoyo: true};

const nbParticles = timings.length;
let particles = new Array(nbParticles);
for (let i = 0; i < particles.length; i++) {
  particles[i] = new Circle({
    x: 20 + i * 60, y: 20, r: 20,
    color: `hsl(${i * 360/nbParticles}, 100%, 50%)`,
  });
  console.log(timings[i]);
  tweens.create({...tweenOpts, timing: timings[i], animate: progress => {
    particles[i].y = progress;
  }})
}

MainLoop.setUpdate((dt) => {
  tweens.update(dt);
});
MainLoop.setDraw(() => {
  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;
  particles.forEach(c => c.draw(ctx));
});
MainLoop.setEnd((fps, panic) => {
  if (!panic) return;
  MainLoop.resetFrameDelta();
});
MainLoop.start();