//@ts-check
const Varifier = require("./verifier");

/**
 * @typedef ContinuityConfig
 * @property {number} count
 * */

/**@type {ContinuityConfig} */
const CONTINUITY_CONFIG = {
  // 連続性をチェックする範囲
  count: 4,
};

class Continuity extends Varifier {
  /** @type {ContinuityConfig} */
  _config = CONTINUITY_CONFIG;
  /** @type {Array} */
  _queue;
  /** @type {Array} */
  _dust;
  /** @type {String} */
  _value;
  /** @type {Boolean} */
  _result;

  /**
   * Creates an instance of Continuity.
   * @param {ContinuityConfig} [config]
   * @memberof Continuity
   */
  constructor(config = CONTINUITY_CONFIG) {
    super();
    this._config = {
      ...config,
      ...CONTINUITY_CONFIG,
    };
    this.reset();
  }

  /**
   *
   *
   * @param {String} value
   * @return {boolean}
   * @memberof Continuity
   */
  verify(value) {
    this._value = value;
    this._result = false;
    this._queue.push(value);

    if (this._queue.length < this._config.count) {
      return false;
    } else if (this._config.count < this._queue.length) {
      this._dust.push(this._queue.shift());
    }

    const result = this._queue.every((v) => v === value);

    if (result === false) {
      //this._dust.push(this._queue.shift());
      if (this._config.count * 10 < this._dust.length) this._dust.shift();
    }

    this._result = result;

    return result;
  }

  reset() {
    this._queue = [];
    this._dust = [];
    this._value = "";
    this._result = false;
  }

  /**
   * @return {Array}
   * @readonly
   * @memberof Continuity
   */
  get values() {
    return this._queue;
  }

  /**
   * @returns {Array}
   * @readonly
   * @memberof Continuity
   */
  get errors() {
    return this._dust;
  }
}

module.exports = Continuity;
