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
    animate
  } = {}) {
    const tween = {time: 0, duration, from, to, loop, yoyo, animate};
    if (after) {
      this.tweensAfter.set(after, tween)
    } else {
      this.tweens.add(tween);
    }
    return tween;
  }

  update(dt) {
    for (const tween of this.tweens) {
      tween.time += dt;
      let timeFraction = tween.time / tween.duration;
      if (timeFraction > 1) timeFraction = 1;

      const progress = (tween.to - tween.from) * timeFraction + tween.from;
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