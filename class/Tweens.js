const timingFct = new Map();

timingFct.set('linear', timeFraction => timeFraction);

timingFct.set('quad', timeFraction => timeFraction ** 2);

timingFct.set('cubic', timeFraction => timeFraction ** 3);

timingFct.set('circ', timeFraction => 1 - Math.sin(Math.acos(timeFraction)));

timingFct.set('back', timeFraction => {
  return Math.pow(timeFraction, 2) * (2.5 * timeFraction - 1.5);
});

timingFct.set('bounce', timeFraction => {
  for (let a = 0, b = 1; 1; a += b, b /= 2) {
    if (timeFraction >= (7 - 4 * a) / 11) {
      return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
    }
  }
});

timingFct.set('elastic', timeFraction => {
  return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(31.415926535 * timeFraction)
});

const makeEaseOut = (timing) => (timeFraction) => 1 - timing(1 - timeFraction);

const makeEaseInOut = (timing) => (timeFraction) => {
  if (timeFraction < .5) return timing(2 * timeFraction) / 2;
  return (2 - timing(2 * (1 - timeFraction))) / 2;
}

export const timings = [...timingFct.keys()];

export default class Tweens{

  constructor() {
    this.tweens = new Set();
    this.tweensAfter = new Map();
  }

  create({
    duration = 1000,
    from = 0,
    to = 1,
    after = null,
    loop = false,
    yoyo = false,
    timing = 'linear',
    easing = 'in',
    animate
  } = {}) {
    timing = timingFct.get(timing);
    if (easing == 'out') {
      timing = makeEaseOut(timing);
    } else if (easing == 'inOut') {
      timing = makeEaseInOut(timing);
    }
    const tween = {time: 0, duration, timing, from, to, loop, yoyo, animate};
    if (after) {
      this.tweensAfter.set(after, tween)
    } else {
      this.tweens.add(tween);
    }
    return tween;
  }

  isRunning(tween) {
    return this.tweens.has(tween);
  }

  delete(tween) {
    this.tweens.delete(tween);
  }

  update(dt) {
    for (const tween of this.tweens) {
      tween.time += dt;
      let timeFraction = tween.time / tween.duration;
      if (timeFraction > 1) timeFraction = 1;

      const progress = (tween.to - tween.from) * tween.timing(timeFraction) + tween.from;
      tween.animate(progress);

      if (timeFraction == 1) {
        if (tween.loop) {
          if (tween.yoyo) [tween.to, tween.from] = [tween.from, tween.to];
          if (tween.yoyo && !tween.loop) tween.yoyo = false;
          tween.time = tween.time - tween.duration;
        } else {
          if (this.tweensAfter.has(tween)){
            const nextTween = this.tweensAfter.get(tween);
            this.tweens.add(nextTween);
          }
          this.tweens.delete(tween);
        }

      }
    }
  }


}