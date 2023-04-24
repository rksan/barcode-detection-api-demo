import { useQuaggaConfigStore } from "@/store/quagga-config";
import { verifier, methods } from "@/lib/verifier";

export default {
  name: "o-input-form",

  props: {
    theme: {
      type: String,
      default() {
        return "light";
      },
    },

    start: { type: Function, default: () => {} },

    scan: { type: Function, default: () => {} },

    stop: { type: Function, default: () => {} },
  },

  computed: {
    compCameraFull() {
      return this.camera ? ["camera-full"].join(" ") : "";
    },
    compViewportShow() {
      return this.camera ? "" : "d-none";
    },
    compTheme() {
      if (this.theme === "light") {
        return ["bg-light", "text-dark"].join(" ");
      } else {
        return ["bg-dark", "text-light"].join(" ");
      }
    },
    compCameraTheme() {
      if (this.theme === "light") {
        return ["bg-light", "camera-demo-light"].join(" ");
      } else {
        return ["bg-dark", "camera-demo-dark"].join(" ");
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
      camera: false,
      videoInfo: "",
    };
  },

  created() {
    this.resetGallary();

    this.$watch(
      () => this.quaggaConfigStore.getEvents(),
      (events) => {
        // console.log("INFO", "update");
        if (events === "update") {
          if (this.camera) {
            this.doStop();
            this.doStart();
          }
          this.quaggaConfigStore.setEvents("");
        }
      }
    );
  },

  setup() {
    const store = {
      quaggaConfigStore: useQuaggaConfigStore(),
    };

    const data = {
      log: "#my-log",
      // config,
      Quagga: null,

      observer: null,
    };

    return {
      ...store,

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
        this.checker.reset();
        this.modulus.reset();

        this.Quagga = require("quagga");
        this.Quagga.onProcessed(this.doProcessed);
        this.Quagga.onDetected(this.doDetected);

        const quaggaConfig = this.quaggaConfigStore.getConfig();
        //const quaggaConfig = require("./config");

        this.Quagga.init(quaggaConfig, (err) => {
          if (err) {
            this.console(err);

            return;
          }

          //this.console("Initialization finished. Ready to start");
          this.Quagga.start();
        });

        this.initOvserver();
        this.camera = true;
      },

      term() {
        this.Quagga.offProcessed(this.doProcessed);
        this.Quagga.offDetected(this.doDetected);
        this.Quagga.stop();

        this.termObserver();
        this.camera = false;
      },

      checker: verifier(methods.continuity, { count: 4 }),

      modulus: verifier(methods.modulus10, { base: 10, weight: 3, digit: 10 }),
    };
  },

  methods: {
    initOvserver() {
      const target = document.querySelector(".viewport");

      const observer = new ResizeObserver(this.doOvserver);

      observer.observe(target);

      this.observer = observer;

      //console.log("[initOvserver]");
    },

    termObserver() {
      this.observer.disconnect();
      //console.log("[termObserver]");
    },

    doOvserver(mutations /* observer */) {
      //console.log("[doOvserver]");
      // Use traditional 'for loops' for IE 11
      mutations.forEach((mutation) => {
        //console.log("[mutation]", mutation);
        //console.log("[observer]", observer);
        /* if (mutation.type === "attributes") {
        } */
        const target = mutation.target;
        const rect = mutation.contentRect;

        const video = target.getElementsByTagName("video")[0];
        const vdr = video
          ? video.getBoundingClientRect()
          : { width: "", height: "" };

        const canvas = target.getElementsByTagName("canvas")[0];
        const cvr = canvas
          ? canvas.getBoundingClientRect()
          : { width: "", height: "" };

        const bdr = document.body.getBoundingClientRect();

        this.videoInfo = [
          {
            body: `${Math.floor(bdr.width)} * ${Math.floor(bdr.height)}`,
          },
          {
            view: `${Math.floor(rect.width)} * ${Math.floor(rect.height)}`,
          },
          {
            video: `${Math.floor(vdr.width)} * ${Math.floor(vdr.height)}`,
          },
          {
            canvas: `${Math.floor(cvr.width)} * ${Math.floor(cvr.height)}`,
          },
        ];
      });
    },

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

    doStart() {
      this.init();
      this.start("start", { data: this.model, vm: this });
    },

    doScan() {
      this.scan("scan", { data: this.model, vm: this });
    },

    doStop() {
      this.term();
      this.stop("stop", { data: this.model, vm: this });
    },

    doProcessed(result) {
      if (result) {
        //this.console("[Processed]", result);

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
      if (!result) {
        return;
      }

      if (!result.codeResult) {
        return;
      }

      const code = result.codeResult.code;

      if (!this.modulus.verify(code)) {
        return;
      }

      if (!this.checker.verify(code)) {
        return;
      }

      const canvas = this.Quagga.canvas.dom.image;

      this.model.imageURL = canvas.toDataURL();

      this.addGallary({
        code: code,
        imageURL: this.model.imageURL,
        result,
        checker: this.checker,
      });

      this.doScan();
      this.doStop();

      this.anime = true;
    },
  },
};
