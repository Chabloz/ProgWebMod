export default class Keyboard {

  constructor(useCode = true, caseSensitive = true) {
    window.addEventListener('keydown', evt => this.#onKeyDown(evt));
    window.addEventListener('keyup', evt => this.#onKeyUp(evt));
    this.keysPressed = new Set();
    this.doOnKeyDown = new Map();
    this.caseSensitive = caseSensitive;
    this.codeOrKey = useCode ? 'code' : 'key';
  }

  #onKeyDown(evt) {
    let key = evt[this.codeOrKey];
    if (!this.caseSensitive) {
      key = key.toUpperCase();
    }
    this.keysPressed.add(key);
    if (this.doOnKeyDown.has(key)) {
      const fn = this.doOnKeyDown.get(key);
      fn();
    }
  }

  #onKeyUp(evt) {
    let key = evt[this.codeOrKey];
    if (!this.caseSensitive) {
      key = key.toUpperCase();
    }
    this.keysPressed.delete(key);
  }

  onKeyDown(key, fn) {
    if (!this.caseSensitive) {
      key = key.toUpperCase();
    }
    this.doOnKeyDown.set(key, fn);
  }

  isKeyDown(key) {
    if (!this.caseSensitive) {
      key = key.toUpperCase();
    }
    return this.keysPressed.has(key);
  }

  isKeysDown(...keys) {
    return keys.every(key => this.isKeyDown(key));
  }

}