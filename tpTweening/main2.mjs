import Circle from '../class/Circle/Bouncing.js';
import Tweens from '../class/Tweens.js';
import {domOn} from '../lib/dom.js';
import {getRandomInt} from '../lib/math.js';
import MainLoop from '../lib/mainloop.js';

const ctx = document.querySelector('canvas').getContext('2d');
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const tweens = new Tweens();

const nbParticles = 1500;
let particles = new Array(nbParticles);
let mouse = {x: -500, y: -500, r: 200};

for (let i = 0; i < particles.length; i++) {
  particles[i] = new Circle({
    x: getRandomInt(0, ctx.canvas.width),
    y: getRandomInt(0, ctx.canvas.height),
    r: getRandomInt(5, 15),
    velX: (Math.random() - 0.5) / 4,
    velY: (Math.random() - 0.5) / 4,
    color: `hsl(0, 100%, 50%)`,
  });
}

tweens.create({to: 360, duration: 100000, loop: true, animate: hue => {
  particles.forEach(c => c.setColor(`hsl(${hue}, 100%, 50%)`));
}})

domOn('canvas', 'mousemove', event => {
  const rect = ctx.canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
});

MainLoop.setUpdate((dt) => {
  tweens.update(dt);
  particles.forEach(c => {
    c.move(dt);
    c.bounceOffTheWalls(ctx, 0);
    if (c.isInCircle(mouse.x, mouse.y, mouse.r)) {
      const angle = c.getAngleFromPoint(mouse.x, mouse.y);
      c.setVelFromAngle(angle);
    }
  });
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