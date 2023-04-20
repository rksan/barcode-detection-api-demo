//@ts-check
const Varifier = require("./verifier");

/**
 * @typedef Modulus10Config
 * @property {Number} base
 * @property {Number} weight
 * @property {Number} digit
 * */

/**@type {Modulus10Config} */
const MODULUS10_CONFIG = {
  // 規定
  base: 10,
  // 間隔
  weight: 3,
  // 桁数
  digit: 13,
};

class Modulus10 extends Varifier {
  _config = null;

  /** @type {Array<String>} */
  _codes = null;

  _lastChar = "";

  _checkdigit = 0;

  _buffers = null;

  constructor(config = MODULUS10_CONFIG) {
    super();
    this._config = {
      ...config,
      ...MODULUS10_CONFIG,
    };
    this.reset();
  }

  reset() {
    this._codes = null;
    this._lastChar = "";
    this._checkdigit = 0;
    this._buffers = null;
  }

  /**
   *
   * @param {Array<String>} chars code without check digit
   * @return {Number} check digit
   * @memberof Modulus10
   */
  checkdigit(chars) {
    let subtotal = [0, 0];

    chars.forEach((code, idx) => {
      let num = parseInt(code, 10);

      if (idx % 2 === 0) {
        // 偶数
        subtotal[1] += num;
      } else {
        // 奇数
        subtotal[0] += num;
      }
    });

    let total = subtotal[0] * this._config.weight + subtotal[1];
    let subplus = total % this._config.base;
    let digit = 0;

    if (subplus === 0) {
      digit = 0;
    } else {
      digit = this._config.base - subplus;
    }

    return digit;
  }

  /**
   *
   *
   * @param {String} barcode barcode
   * @return {boolean}
   * @memberof Modulus10Weight3
   */
  verify(barcode) {
    this._codes = barcode.toString().split("");

    this._checkdigit = 0;

    this._buffers = ("0".repeat(this._config.digit) + barcode)
      .slice(-this._config.digit)
      .split("");

    this._lastChar = this._buffers.pop();

    if (!this._lastChar) return false;

    this._checkdigit = this.checkdigit(this._buffers);

    return parseInt(this._lastChar, 10) === this._checkdigit;
  }
}

module.exports = Modulus10;
