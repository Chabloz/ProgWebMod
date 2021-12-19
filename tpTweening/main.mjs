import Circle from '../class/Circle/Alpha.js';
import Tweens from '../class/Tweens.js';
import {domOn} from '../lib/dom.js';

import MainLoop from '../lib/mainloop.js';

const ctx = document.querySelector('canvas').getContext('2d');
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const tweens = new Tweens();

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
ctx.globalCompositeOperation = 'destination-out';
ctx.filter = 'blur(3px)';
document.body.style['background-image'] = "url('landscape.jpg')";

domOn('canvas', 'mousemove', event => {
  const rect = ctx.canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const newCircle = new Circle({x, y, r: 40, color: 'white'});
  tweens.create({from: 0, to: 80, duration: 500, animate: progress => {
    newCircle.r = progress;
  }});
  tweens.create({from: 0, to: 1, duration: 1500, animate: progress => {
    newCircle.alpha = progress;
    newCircle.draw(ctx);
  }});
});

MainLoop.setSimulationTimestep(1000/30);
MainLoop.setUpdate((dt) => tweens.update(dt));
MainLoop.setEnd((fps, panic) => {
  if (!panic) return;
  const discardedTime = Math.round(MainLoop.resetFrameDelta());
})
MainLoop.start();