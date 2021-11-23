import Automaton from '../class/Automaton.js';
import AutomatonInFlatTorus from '../class/Automaton/InFlatTorus.js';

import {domOn} from '../lib/dom.js';
import randomColor from '../lib/randomcolor.js';
import MainLoop from '../lib/mainloop.js';
import Keyboard from '../class/Keyboard.js';

const ctx = document.querySelector('canvas').getContext('2d');
ctx.canvas.width = ctx.canvas.clientWidth;
ctx.canvas.height = ctx.canvas.clientHeight;

const keyboard = new Keyboard(false);

/* configuration */
let freq = 30;
let gen = 1;
let tileSize = 10;
let isAliveProb = 0.5;
let mapIsFlatTorus = true;
let birthRule = new Set([3]);
let survivalRule = new Set([2, 3]);
let pause = false;
let automaton;

function generateAutomaton() {
  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.clientHeight;

  const aliveColor = randomColor();
  const width = Math.round(ctx.canvas.width / tileSize);
  const height = Math.round(ctx.canvas.height / tileSize);
  const opt = {width, height, isAliveProb, tileSize, aliveColor, birthRule, survivalRule};
  if (mapIsFlatTorus) {
    automaton = new AutomatonInFlatTorus(opt);
  } else {
    automaton = new Automaton(opt);
  }
}
generateAutomaton();

/* DOM */
function updateDom() {
  document.querySelector('#freq').textContent = freq;
  document.querySelector('#generation').textContent = gen;
  document.querySelector('#tile-size').textContent = tileSize;
  document.querySelector('#alive-prob').textContent = Math.round(isAliveProb * 100);

  const domMap = document.querySelector('#map');
  domMap.textContent = mapIsFlatTorus ? domMap.dataset.flatTorus : domMap.dataset.rectangle;

  for (let ruleNum = 0; ruleNum < 9; ruleNum++) {
    const ruleB = document.querySelector(`[data-rule-type="b"][data-rule-num="${ruleNum}"]`);
    birthRule.has(ruleNum) ? ruleB.classList.add('apply') : ruleB.classList.remove('apply');
    const ruleS = document.querySelector(`[data-rule-type="s"][data-rule-num="${ruleNum}"]`);
    survivalRule.has(ruleNum) ? ruleS.classList.add('apply') : ruleS.classList.remove('apply');
  }
}

/* Keyboard management */
keyboard.onKeyDown('p', () => {
  pause = !pause;
});

keyboard.onKeyDown('w', () => {
  freq = Math.min(500, freq + 1);
  MainLoop.setSimulationTimestep(1000/freq);
});

keyboard.onKeyDown('s', () => {
  freq = Math.max(1, freq - 1);
  MainLoop.setSimulationTimestep(1000/freq);
});

keyboard.onKeyDown('m', () => {
  mapIsFlatTorus = !mapIsFlatTorus;
  generateAutomaton();
});

keyboard.onKeyDown('r', () => {
  generateAutomaton();
});

keyboard.onKeyDown('z', () => {
  tileSize = Math.min(100, tileSize + 1);
  generateAutomaton();
});

keyboard.onKeyDown('h', () => {
  tileSize = Math.max(4, tileSize - 1);
  generateAutomaton();
});

keyboard.onKeyDown('a', () => {
  isAliveProb = Math.max(0, isAliveProb - 0.01);
});

keyboard.onKeyDown('d', () => {
  isAliveProb = Math.min(1, isAliveProb + 0.01);
});

/* Rules management */
domOn('.rule', 'click', evt => {
  const dom = evt.currentTarget;
  const ruleType = dom.dataset.ruleType;
  const ruleNum = dom.dataset.ruleNum-0;
  const rule = ruleType == 'b' ? birthRule : survivalRule
  rule.has(ruleNum) ? rule.delete(ruleNum) : rule.add(ruleNum);
})

// Cells click management
domOn('canvas', 'click', event => {
  const rect = ctx.canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / tileSize);
  const y = Math.floor((event.clientY - rect.top) / tileSize);
  automaton.toggleState({x, y});
});

/* Main loop */
MainLoop.setSimulationTimestep(1000/freq);

MainLoop.setUpdate(dt => {
  if (pause) return;
  automaton.applyRule()
  gen++;
});

MainLoop.setDraw(() => {
  updateDom();
  automaton.drawTiles(ctx)
});

MainLoop.setEnd((fps, panic) => {
  if (!panic) return;
  console.log('panic');
  MainLoop.resetFrameDelta();
});

MainLoop.start();