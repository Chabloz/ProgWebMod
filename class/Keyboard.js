export default class Keyboard {

  constructor(useCode = true) {
    window.addEventListener('keydown', evt => this.#onKeyDown(evt));
    window.addEventListener('keyup', evt => this.#onKeyUp(evt));
    this.keysPressed = new Set();
    this.doOnKeyDown = new Map();
    this.codeOrKey = useCode ? 'code' : 'key';
  }

  #onKeyDown(evt) {
    const key = evt[this.codeOrKey];
    this.keysPressed.add(key);
    if (this.doOnKeyDown.has(key)) {
      const fn = this.doOnKeyDown.get(key);
      fn();
    }
  }

  #onKeyUp(evt) {
    const key = evt[this.codeOrKey];
    this.keysPressed.delete(key);
  }

  onKeyDown(key, fn) {
    // TODO: authorize multiple listeners on the same key ?
    this.doOnKeyDown.set(key, fn);
  }

  isKeyDown(key) {
    return this.keysPressed.has(key);
  }

  isKeysDown(...keys) {
    return keys.every(key => this.isKeyDown(key));
  }

}