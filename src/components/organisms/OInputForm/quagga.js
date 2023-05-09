const { verifier, methods } = require("@/lib/verifier");
const { observer, OVSERVE_METHODS } = require("@/lib/observer");

/**
 *
 * @param {{
 * config:object,
 * processed: (result:object, {quagga:object}:object)=> void,
 * detected: (result:object, {quagga:object}:object)=> void,
 * live: (videoTrack:MediaStreamTrack, {quagga:object}:object)=> void,
 * resize: (video:HTMLElement, {quagga:object}:object)=>void,
 * }} args
 * @returns {Object}
 */
const generator = (args = {}) => {
  const { config, processed, detected, live, resize } = args;

  const checker = verifier(methods.continuity, { count: 4 });

  const modulus = verifier(methods.modulus10, {
    base: 10,
    weight: 3,
    digit: 10,
  });

  const video = ((target) => {
    let el =
      typeof target === "string" ? document.querySelector(target) : target;

    let v = el.querySelector("video");

    if (!v) {
      v = el.appendChild(document.createElement("video"));
    }

    return v;
  })(config.inputStream.target);

  /** @type {HTMLCanvasElement} */
  const debugCanvas =
    /**
     * @param {HTMLElement} el
     * @return {HTMLElement}
     */
    ((el) => {
      /** @type {HTMLElement} */
      const parent = el.parentNode;

      let v = parent.querySelector("canvas:not(.drawingBuffer)");

      if (!v) {
        v = parent.appendChild(document.createElement("canvas"));
      }

      return v;
    })(video);

  /**
   *
   * @param {Array<Array>} boxs
   * @param {{x,y}} e
   * @param {CanvasRenderingContext2D} ctx2d
   * @param {{color:string,lineWidth:number}} styles
   */
  const drawPath = (boxs, e, ctx2d, styles) => {
    ctx2d.strokeStyle = styles.color;
    ctx2d.fillStyle = styles.color;
    ctx2d.lineWidth = styles.lineWidth;

    ctx2d.beginPath();

    ctx2d.moveTo(Math.floor(boxs[0][e.x]), Math.floor(boxs[0][e.y]));

    for (var idx = 1; idx < boxs.length; idx++) {
      ctx2d.lineTo(Math.floor(boxs[idx][e.x]), Math.floor(boxs[idx][e.y]));
    }

    ctx2d.closePath();
    ctx2d.stroke();
  };

  /**
   * offCanvas -> onCanvas
   * @param {HTMLCanvasElement} from
   * @param {HTMLCanvasElement} to
   */
  const transferCanvas = (from, to) => {
    const context = to.getContext("2d");
    const rect = to.getBoundingClientRect();

    context.clearRect(0, 0, rect.width, rect.height);

    context.drawImage(from, 0, 0, rect.width, rect.height);
  };

  const QuaggaJS = {
    instance: null,

    processed: (result) => {
      if (!result) {
        return;
      }

      const quagga = QuaggaJS.instance;

      /** @type {CanvasRenderingContext2D} */
      const buffer = quagga.canvas.ctx.overlay;

      /** @type {HTMLCanvasElement} */
      const offCanvas = quagga.canvas.dom.overlay;

      if (result.boxes) {
        const width = Math.floor(offCanvas.getAttribute("width"));
        const height = Math.floor(offCanvas.getAttribute("height"));

        buffer.clearRect(0, 0, width, height);

        result.boxes
          .filter((box) => {
            return box !== result.box;
          })
          .forEach((box) => {
            /*  quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, buffer, {
              color: "green",
              lineWidth: 2,
            }); */

            drawPath(box, { x: 0, y: 1 }, buffer, {
              color: "green",
              lineWidth: 2,
            });
          });
      }

      if (result.box) {
        /* quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, buffer, {
          color: "#00F",
          lineWidth: 2,
        }); */
        drawPath(result.box, { x: 0, y: 1 }, buffer, {
          color: "#00F",
          lineWidth: 2,
        });
      }

      if (result.codeResult && result.codeResult.code) {
        /* quagga.ImageDebug.drawPath(result.line, { x: "x", y: "y" }, buffer, {
          color: "red",
          lineWidth: 3,
        }); */
        drawPath(result.line, { x: "x", y: "y" }, buffer, {
          color: "red",
          lineWidth: 3,
        });
      }

      transferCanvas(buffer.canvas, debugCanvas);

      if (processed) {
        processed(result, { quagga });
      }
    },

    detected: (result) => {
      if (!result) {
        return;
      }

      if (!result.codeResult) {
        return;
      }

      const quagga = QuaggaJS.instance;
      const code = result.codeResult.code;

      if (!modulus.verify(code)) {
        return;
      }

      if (!checker.verify(code)) {
        return;
      }

      if (detected) {
        detected(result, { quagga });
      }
    },

    // thread id
    delayId: "",
  };

  // return interface
  return {
    config,

    checker,

    modulus,

    /**
     * @param {{
     * init: ({quagga:object})=> void,
     * error: (err:Error)=> void,
     * }} args
     */
    init: (args = {}) => {
      const { init, error } = args;

      checker.reset();
      modulus.reset();

      const quagga = (QuaggaJS.instance = require("quagga"));

      quagga.onProcessed(QuaggaJS.processed);
      quagga.onDetected(QuaggaJS.detected);

      quagga.init(config, (err) => {
        if (err) {
          console.error("[Quagga]", err);
          if (error) {
            error(err);
          }
          return;
        }

        console.log("[Quagga]", "init finished. Ready to start");
        // console.log("[Quagga]", config);

        quagga.start();

        if (live) {
          const delay = (timeout) => {
            const cameraAccess = quagga.CameraAccess;

            if (!cameraAccess) {
              QuaggaJS.delayId = window.setTimeout(delay, timeout);
              return;
            }

            const videoTrack = cameraAccess.getActiveTrack();

            if (!videoTrack) {
              QuaggaJS.delayId = window.setTimeout(delay, timeout);
              return;
            }

            // resize observer
            QuaggaJS.observer = observer(OVSERVE_METHODS.resize, {
              target: video,
              options: { box: "border-box" },
              callback: (entries) => {
                entries.forEach((entry) => {
                  if (resize) {
                    resize(entry, { quagga });
                  }
                });
              },
            });

            if (typeof live === "function") {
              live(videoTrack, { quagga });
            }
          };

          delay(10);
        }

        if (init) {
          init({ quagga });
        }
      });
    },

    /**
     * @param {{term:({quagga:object})=> void}} args
     */
    term: (args = {}) => {
      const { term } = args;

      if (QuaggaJS.observer) {
        QuaggaJS.observer.disconnect();
        QuaggaJS.observer = null;
      }

      const quagga = QuaggaJS.instance;

      if (quagga) {
        if (QuaggaJS.delayId) {
          window.clearTimeout(QuaggaJS.delayId);
          QuaggaJS.delayId = "";
        }

        quagga.offProcessed(QuaggaJS.processed);
        quagga.offDetected(QuaggaJS.detected);
        quagga.stop();

        if (term) {
          term({ quagga });
        }
      }
    },
  };
};

module.exports = generator;
