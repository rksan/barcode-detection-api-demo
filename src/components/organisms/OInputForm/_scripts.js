import { useQuaggaConfigStore } from "@/store/quagga-config";
import { verifier, methods } from "@/lib/verifier";
import createResizeObserver from "@/lib/createResizeObserver";

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
      videoInfo: {},
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

      observers: [],
    };

    return {
      ...store,

      ...data,

      init() {
        this.codes = [];
        this.checker.reset();
        this.modulus.reset();

        this.Quagga = require("quagga");
        this.Quagga.onProcessed(this.doProcessed);
        this.Quagga.onDetected(this.doDetected);

        const quaggaConfig = this.quaggaConfigStore.getConfig();
        //const quaggaConfig = require("./config");
        console.log("[scripts.js] quaggaConfig", quaggaConfig);
        this.Quagga.init(quaggaConfig, (err) => {
          if (err) {
            console.log("[script.js] Quagga.init", err);

            return;
          }

          this.Quagga.start();

          console.log("[scripts.js] Quagga", this.Quagga);

          const debugFunc = () => {
            const cameraAccess = this.Quagga.CameraAccess;
            const videoTrack = cameraAccess.getActiveTrack();

            if (videoTrack) {
              console.log("[scripts.js] cameraAccess", cameraAccess);

              cameraAccess.enumerateVideoDevices().then((devices) => {
                console.log("[scripts.js] enumerateVideoDevices", devices);
              });

              console.log(
                "[scripts.js] acriveStreamLabel",
                cameraAccess.getActiveStreamLabel()
              );

              console.log("[scripts.js] activeTrack", videoTrack);

              console.log(
                "[scripts.js] activeTrack.constraints",
                videoTrack.getConstraints()
              );

              const settings = videoTrack.getSettings();

              console.log("[scripts.js] activeTrack.settings", settings);

              const view = document.querySelector(".viewport");

              //const video = view.querySelector("video");

              view.style.maxWidth = `${settings.width}px`;
              view.style.maxHeight = `${settings.height}px`;
            } else {
              window.setTimeout(debugFunc, 10);
            }
          };

          window.setTimeout(debugFunc, 10);
        });

        this.initOvserver();
        this.camera = true;
      },

      term() {
        if (this.Quagga) {
          this.Quagga.offProcessed(this.doProcessed);
          this.Quagga.offDetected(this.doDetected);
          this.Quagga.stop();

          this.termObserver();
        }

        this.camera = false;
      },

      checker: verifier(methods.continuity, { count: 4 }),

      modulus: verifier(methods.modulus10, { base: 10, weight: 3, digit: 10 }),
    };
  },

  methods: {
    initOvserver() {
      this.termObserver();
      //this.observers = [createResizeObserver(".viewport", this.doOvserver)];

      const body = document.body;
      const view = body.querySelector(".viewport");
      //const video = view.querySelector("video");
      const canvas = view.querySelector("canvas.drawingBuffer");
      const targets = [body, view];

      const doOvserver = (entries) => {
        entries.forEach((entry) => {
          console.log("[doObserver] entry", entry);
          const target = entry.target;
          const rect = entry.contentRect;
          const selector =
            target.localName +
            (target.id ? "#" + target.id : "") +
            (target.className
              ? "." + target.className.split(" ").join(".")
              : "");

          this.videoInfo[selector] = {
            width: Math.floor(rect.width),
            height: Math.floor(rect.height),
          };

          if (target.tagName === "BODY") {
            canvas.width = rect.width;
            canvas.height = rect.height;
          } else {
            canvas.width = rect.width;
            canvas.height = rect.height;
          }
        });
      };

      this.observers = [createResizeObserver(targets, doOvserver)];

      this.videoInfo.toString = () => {
        const keys = Object.keys(this.videoInfo).filter(
          (key) => key !== "toString"
        );
        const props = keys.map((key) => {
          return `${key} : ${this.videoInfo[key]["width"]} * ${this.videoInfo[key]["height"]}`;
        });
        return props.join(", ");
      };
      //console.log("[initOvserver]");
    },

    termObserver() {
      if (this.observers.length) {
        this.observers.forEach((observer) => observer.disconnect());
      }

      //console.log("[termObserver]");
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
