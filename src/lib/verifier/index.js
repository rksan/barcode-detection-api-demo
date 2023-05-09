const methods = {
  continuity: "Continuity",
  modulus10: "Modulus10",
};

const verifier = (method, option) => {
  if (method === methods.continuity) {
    const Continuity = require("./continuity");
    return new Continuity(option);
  } else if (method === methods.modulus10) {
    const Modulus10Weight3 = require("./modulus10");
    return new Modulus10Weight3(option);
  }

  throw Error(`method is undefined[method = ${method}]`);
};

module.exports = { verifier, methods };
