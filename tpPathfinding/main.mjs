import MainLoop from '../lib/mainloop.js';
import Tweens from '../class/Tweens.js';
import Automaton from '../class/Automaton/WithPathFinding.js';
import {domOn} from '../lib/dom.js';
import Circle from '../class/Circle.js';
import randomColor from '../lib/randomColor.js';

const ctx = document.querySelector('canvas').getContext('2d');
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const tweens = new Tweens();

// Automaton initialisation
const spawn = {row: 0, col: 0};
const dest = {row: 12, col: 21};
const tileSize = 40;
const isAliveProb = 1;
const cols = Math.round(ctx.canvas.width / tileSize);
const rows = Math.round(ctx.canvas.height / tileSize);
const opt = {cols, rows, isAliveProb, tileSize};
const automaton = new Automaton(opt);

automaton.flowFieldTo(dest);

domOn('canvas', 'click', event => {
  const rect = ctx.canvas.getBoundingClientRect();
  const row = Math.floor((event.clientY - rect.top) / tileSize);
  const col = Math.floor((event.clientX - rect.left) / tileSize);
  if (!automaton.isValidPos({row, col})) return;
  automaton.toggleState({row, col});
  automaton.flowFieldTo(dest);
  tweens.deleteAll();
  for (const mob of mobs) {
    generateTweens(mob);
  }
});

// Optional part: mob spawner
const start = automaton.convertRowColToPixel(spawn);

const mobs = new Set();

const timers = new Tweens();
timers.create({
  loop: true,
  duration: 1000,
  animate: progress => {
    if (progress != 1) return;
    const mob = new Circle({
      ...start,
      speed: 0.05,
      r: tileSize / 4,
      color: randomColor()
    });
    mobs.add(mob);
    generateTweens(mob);
  }
});


function generateTweens(mob) {
  let lastPos = {x: mob.x, y: mob.y};
  let lastCell = automaton.convertPixelToRowCol(lastPos);
  let nextCell;
  let tweenX = null;
  let tweenY = null;
  while (nextCell = automaton.getNextCell(lastCell)) {
    const nextPos = automaton.convertRowColToPixel(nextCell);
    const dist = Math.sqrt((lastPos.x - nextPos.x) ** 2 + (lastPos.y - nextPos.y) ** 2);
    const duration = dist / mob.speed;
    tweenX = tweens.create({from: lastPos.x, to: nextPos.x, duration, after: tweenX, animate: x => {
      mob.x = x;
    }});
    tweenY = tweens.create({from: lastPos.y, to: nextPos.y, duration, after: tweenY, animate: y => {
      mob.y = y;
    }});
    lastPos = nextPos;
    lastCell = nextCell;
  }
  tweens.create({after: tweenX, duration: 0, animate: () => mobs.delete(mob)});
}



MainLoop.setUpdate(dt => {
  tweens.update(dt);
  timers.update(dt);
});
MainLoop.setDraw(() => {
  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;
  automaton.drawTiles(ctx);
  automaton.drawFlowArrows(ctx);
  for (const mob of mobs) {
    mob.draw(ctx);
  }
});
MainLoop.setEnd((fps, panic) => {
  if (!panic) return;
  MainLoop.resetFrameDelta();
});
MainLoop.start();

