import Circle from '../class/Circle/Bouncing.js';
import Tweens from '../class/Tweens.js';
import {domOn} from '../lib/dom.js';
import {getRandomInt} from '../lib/math.js';
import MainLoop from '../lib/mainloop.js';

const ctx = document.querySelector('canvas').getContext('2d');
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const tweens = new Tweens();

// tweens.create({to: 360, duration: 100000, loop: true, animate: hue => {
//   particles.forEach(c => c.setColor(`hsl(${hue}, 100%, 50%)`));
// }})
let mouse = {x: -500, y: -500, r: 200};
let circle = new Circle({x: 0, y: 0, r: 20, speed: 0.1, dir:0, color: `hsl(0, 100%, 50%)`});
let mouseTween = {x: null, y: null};

tweens.create({to: 360, duration: 10000, loop: true, animate: hue => {
  circle.setColor(`hsl(${hue}, 100%, 50%)`);
  document.body.style.background = `hsl(${hue + 180}, 100%, 50%)`;
}})
domOn('canvas', 'click', () => {
  document.body.style.background = circle.color;
})

domOn('canvas', 'mousemove', event => {
  const rect = ctx.canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
  tweens.delete(mouseTween.x);
  mouseTween.x = tweens.create({from: circle.x, to: mouse.x, timing: 'quad', easing: 'out', duration: 300, animate: progress => {
    circle.x = progress
  }});
  tweens.delete(mouseTween.y);
  mouseTween.y = tweens.create({from: circle.y, to: mouse.y, timing: 'quad', easing: 'out', duration: 300, animate: progress => {
    circle.y = progress
  }})
});

MainLoop.setUpdate((dt) => {
  tweens.update(dt);
});
MainLoop.setDraw(() => {
  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;
  circle.draw(ctx);
});
MainLoop.setEnd((fps, panic) => {
  if (!panic) return;
  MainLoop.resetFrameDelta();
});
MainLoop.start();