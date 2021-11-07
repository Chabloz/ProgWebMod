export default class {

  constructor() {
    window.addEventListener('keydown', evt => this.onKeyDown(evt));
    window.addEventListener('keyup', evt => this.onKeyUp(evt));
    this.keysPressed = new Map();
  }

  onKeyDown(evt) {
    let key = evt.code;
    this.keysPressed.set(key, key);
  }

  onKeyUp(evt) {
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