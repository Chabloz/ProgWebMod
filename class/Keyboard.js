export default class Keyboard {

  constructor() {
    window.addEventListener('keydown', evt => this.#onKeyDown(evt));
    window.addEventListener('keyup', evt => this.#onKeyUp(evt));
    this.keysPressed = new Set();
  }

  #onKeyDown(evt) {
    let key = evt.code;
    this.keysPressed.add(key);
  }

  #onKeyUp(evt) {
    let key = evt.code;
    this.keysPressed.delete(key);
  }

  isKeyDown(key) {
    return this.keysPressed.has(key);
  }

  isKeysDown(...keys) {
    return keys.every(key => this.isKeyDown(key));
  }

}