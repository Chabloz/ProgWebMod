import Circle from '../class/Circle/Bouncing.js';
import Tweens from '../class/Tweens.js';
import {domOn} from '../lib/dom.js';
import {getRandomInt} from '../lib/math.js';
import MainLoop from '../lib/mainloop.js';

const ctx = document.querySelector('canvas').getContext('2d');
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const nbParticles = 3000;
const particles = new Array(nbParticles);
const mouse = {x: -100, y: -100, r: 200};

for (let i = 0; i < particles.length; i++) {
  particles[i] = new Circle({
    x: getRandomInt(0, ctx.canvas.width),
    y: getRandomInt(0, ctx.canvas.height),
    r: getRandomInt(2, 12),
    velX: (Math.random() - .5) / 4,
    velY: (Math.random() - .5) / 4,
    color: `hsl(0, 100%, 50%)`,
  });
}

const tweens = new Tweens();
tweens.create({to: 360, duration: 50000, loop: true, animate: hue => {
  particles.forEach(p => p.setColor(`hsl(${hue}, 100%, 50%)`));
}})

domOn('canvas', 'mousemove', event => {
  const rect = ctx.canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
});

MainLoop.setSimulationTimestep(1000/30);
MainLoop.setUpdate((dt) => {
  tweens.update(dt);
  particles.forEach(p => {
    p.move(dt);
    p.bounceOffTheWalls(ctx, 0);
    if (p.isInCircle(mouse.x, mouse.y, mouse.r)) {
      const angle = p.getAngleFromPoint(mouse.x, mouse.y);
      p.setVelFromAngle(angle);
    }
  });
});
MainLoop.setDraw(() => {
  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;
  particles.forEach(p => p.draw(ctx));
});
MainLoop.setEnd((fps, panic) => {
  if (!panic) return;
  MainLoop.resetFrameDelta();
});
MainLoop.start();