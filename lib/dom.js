export function domForEach(selector, callback) {
  document.querySelectorAll(selector).forEach(callback);
}

export function domOn(selector, event, callback, options) {
  domForEach(selector, ele => ele.addEventListener(event, callback, options));
}