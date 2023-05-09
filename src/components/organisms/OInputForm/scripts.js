import { reactive } from "vue";
import { useQuaggaConfigStore } from "@/store/quagga-config";
import createResizeObserver from "@/lib/createResizeObserver";

const setup = () => {
  // store
  const quaggaConfigStore = useQuaggaConfigStore();

  // data
  const ui = reactive({
    anime: false,
    camera: false,
  });
  const videoInfo = reactive({});

  const observers = [];

  // methods
  const termObserver = () => {
    if (observers.length) {
      observers.forEach((observer) => observer.disconnect());
    }
  };

  const initObserver = () => {
    termObserver();
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
          (target.className ? "." + target.className.split(" ").join(".") : "");

        videoInfo[selector] = {
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

    observers.concat([createResizeObserver(targets, doOvserver)]);

    videoInfo.toString = () => {
      const keys = Object.keys(videoInfo).filter((key) => key !== "toString");
      const props = keys.map((key) => {
        return `${key} : ${videoInfo[key]["width"]} * ${videoInfo[key]["height"]}`;
      });
      return props.join(", ");
    };
    //console.log("[initOvserver]");
  };

  // quagga
  const Quagga = {
    interface: null,

    term: () => {
      if (Quagga.interface) {
        Quagga.interface.term();
        termObserver();
        ui.camera = false;
      }
    },

    init: () => {
      const quaggaConfig = quaggaConfigStore.getConfig();

      const QuaggaJS = require("./quagga.js");

      (Quagga.interface = QuaggaJS({
        config: quaggaConfig,

        processed: Quagga.processed,

        detected: Quagga.detected,

        live: Quagga.live,
      })).init({
        init: () => {
          console.log("[Quagga.init]", this);
          ui.camera = true;
        },
      });
    },

    processed: (result) => result,

    detected: (result, { quagga }) => {
      const code = result.codeResult.code;

      const canvas = quagga.canvas.dom.image;

      this.model.imageURL = canvas.toDataURL();

      this.addGallary({
        code: code,
        imageURL: this.model.imageURL,
        result,
        checker: Quagga.interface.checker,
      });

      this.doScan();
      this.doStop();

      ui.anime = true;
    },

    live: () => {
      initObserver();
    },
  };

  return {
    quaggaConfigStore,

    ui,

    videoInfo,

    Quagga,

    init() {
      Quagga.init();
    },

    term() {
      Quagga.term();
    },
  };
};

const vm = {
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
      return this.ui.camera ? ["camera-full"].join(" ") : "";
    },
    compViewportShow() {
      return this.ui.camera ? "" : "d-none";
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
      if (this.ui.anime) {
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

  setup,

  methods: {
    resetGallary() {
      this.model.gallery = [];
    },

    addGallary({ code, imageURL, result, checker }) {
      this.model.gallery.push({ code, imageURL, result, checker });
    },

    doAnimationEnd() {
      this.ui.anime = false;
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
  },
};

export default vm;
