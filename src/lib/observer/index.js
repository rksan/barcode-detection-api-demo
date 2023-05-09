const OVSERVE_METHODS = {
  resize: "ResizeObserver",
};

const observer = (method, options = {}) => {
  if (method === OVSERVE_METHODS.resize) {
    const { target, callback, option } = options;

    const resizeObserver = new ResizeObserver(callback);

    resizeObserver.observe(target, option);

    return resizeObserver;
  }
};

export { observer, OVSERVE_METHODS };
