/**
 * @function createResizeObserver
 * @see https://developer.mozilla.org/ja/docs/Web/API/Document/querySelectorAll
 * @param {String | NodeList<Element> | Element[] | Element} selectors
 * Argument `selectors` of `Document.querySelectorAll()`, or `NodeList` or `Element`
 * @see https://developer.mozilla.org/ja/docs/Web/API/ResizeObserverEntry
 * @param {(entries:ResizeObserverEntry[], observer:ResizeObserver)=> void} callback
 * A function called when the Element represented by selector is resized
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe#parameters
 * @param {{box:String}} [options]
 * @see https://developer.mozilla.org/ja/docs/Web/API/ResizeObserver
 * @returns {ResizeObserver} A new instance of ResizeObserver whose observation target is the Element indicated by `selectors`
 *
 * * Sample Code
 * ```js:sample.js
 * let resizeObserver = createResizeObserver("body > .any-class:first-child", (entries, observer) => {
 *     // code to observe...
 * })
 * ```
 */
const createResizeObserver = (selectors, callback, options) => {
  const elements = ((s) => {
    if (typeof s === "string") {
      return document.querySelectorAll(s);
    } else {
      return s;
    }
  })(selectors);

  const resizeObserver = new ResizeObserver(callback);

  if (elements.forEach) {
    elements.forEach((element) => {
      resizeObserver.observe(element, options);
    });
  } else {
    resizeObserver.observe(elements, options);
  }

  return resizeObserver;
};

module.exports = createResizeObserver;
