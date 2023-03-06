import config from "./config";

export default {
  name: "o-input-form",

  props: {
    theme: {
      type: String,
      default() {
        return "light";
      },
    },
  },

  computed: {
    compTheme() {
      if (this.theme === "light") {
        return ["bg-light", "text-dark"].join(" ");
      } else {
        return ["bg-dark", "text-light"].join(" ");
      }
    },
    compAnime() {
      if (this.anime) {
        return ["anime"].join(" ");
      }
      return "";
    },
  },

  data() {
    return {
      model: {
        imageURL: "",
        gallery: [{ code: "", imageURL: "", result: null, checker: null }],
        dspResult: "",
      },
      anime: false,
    };
  },

  setup() {
    const data = {
      log: "#my-log",
      // config,
      Quagga: null,
      codeChecker: {
        codes: [],
        count: 0,
        error: 0,
        errors: [],
      },
    };

    return {
      ...data,

      console(type, msg) {
        if (typeof this.log === "string") {
          this.log = document.querySelector(this.log);
        }

        if (typeof msg === "string") {
          var p = document.createElement("p");
          p.textContent = msg;

          this.log.appendChild(p);
        }

        // console.log(type, msg);
      },

      init() {
        this.codes = [];

        this.Quagga = require("quagga");
        this.Quagga.onProcessed(this.doProcessed);
        this.Quagga.onDetected(this.doDetected);

        this.Quagga.init(config, (err) => {
          if (err) {
            this.console(err);

            return;
          }

          this.console("Initialization finished. Ready to start");
          this.Quagga.start();
        });
      },

      term() {
        this.Quagga.offProcessed(this.doProcessed);
        this.Quagga.offDetected(this.doDetected);
        this.Quagga.stop();
      },

      isSameCode(result) {
        const codes = this.codeCheckCode(result.codeResult.code);

        if (codes.length < 5) {
          return false;
        }

        const checked = codes.every((v) => v === codes[0]);

        this.codeCheckCount();

        if (!checked) {
          this.codeCheckError();
          //this.codeChecker.codes.shift();
        }

        return checked;
      },

      getCodeChecker() {
        return Object.assign({}, this.codeChecker);
      },

      codeCheckCode(code) {
        if (code) {
          this.codeChecker.codes.push(code);
        }

        return this.codeChecker.codes;
      },

      codeCheckCount() {
        return ++this.codeChecker.count;
      },

      codeCheckError() {
        this.codeChecker.errors.push(this.codeChecker.codes.shift());
        return ++this.codeChecker.error;
      },

      resetCodeChecker() {
        this.codeChecker.codes = [];
        this.codeChecker.count = 0;
        this.codeChecker.error = 0;
        this.codeChecker.errors = [];
      },
    };
  },

  created() {
    this.resetGallary();
  },

  methods: {
    resetGallary() {
      this.model.gallery = [];
    },

    addGallary({ code, imageURL, result, checker }) {
      this.model.gallery.push({ code, imageURL, result, checker });
    },

    doAnimationEnd() {
      this.anime = false;
    },

    doRsult(event) {
      let elem = event.currentTarget;
      var idx = elem.dataset.resultIndex;
      var result = this.model.gallery[idx].result;
      this.model.dspResult = JSON.stringify(result);
    },

    doStop() {
      this.term();
    },

    doStart() {
      this.init();
    },

    doProcessed(result) {
      if (result) {
        this.console("[Processed]", result);

        const drawingCtx = this.Quagga.canvas.ctx.overlay;
        const drawingCanvas = this.Quagga.canvas.dom.overlay;

        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute("width")),
            parseInt(drawingCanvas.getAttribute("height"))
          );

          result.boxes
            .filter((box) => {
              return box !== result.box;
            })
            .forEach((box) => {
              this.Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2,
              });
            });
        }

        if (result.box) {
          this.Quagga.ImageDebug.drawPath(
            result.box,
            { x: 0, y: 1 },
            drawingCtx,
            {
              color: "#00F",
              lineWidth: 2,
            }
          );
        }

        if (result.codeResult && result.codeResult.code) {
          this.Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
    },

    doDetected(result) {
      if (result) {
        if (result.codeResult) {
          console.log("[Detected]", result);
          if (this.isSameCode(result)) {
            const code = result.codeResult.code;

            const canvas = this.Quagga.canvas.dom.image;

            /* this.model.code = code;
            this.model.imageURL = canvas.toDataURL(); */

            this.model.imageURL = canvas.toDataURL();

            this.addGallary({
              code: code,
              imageURL: this.model.imageURL,
              result,
              checker: this.getCodeChecker(),
            });

            this.doStop();
            this.resetCodeChecker();
            this.anime = true;
          }
        }
      }
    },
  },
};
