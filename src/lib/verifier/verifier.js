//@ts-check

/**
 * @typedef Verifier
 * @property {function} verify
 */

class Varifier {
  /**
   * @returns {boolean}
   */
  verify(value) {
    return value === value;
  }
}

module.exports = Varifier;
