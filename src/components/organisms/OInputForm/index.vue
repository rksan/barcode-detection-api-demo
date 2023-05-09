<template src="@/components/organisms/OInputForm/template.html" />
<style src="@/components/organisms/OInputForm/style.css" />

<script>
import { reactive, defineComponent } from "vue";
import { useQuaggaConfigStore } from "@/store/quagga-config";
import createResizeObserver from "@/lib/createResizeObserver";

export default defineComponent({
  name: "o-input-form",

  setup() {
    // store
    const quaggaConfigStore = useQuaggaConfigStore();

    // data
    const model = reactive({
      imageURL: "",
      gallery: [{ code: "", imageURL: "", result: null, checker: null }],
      dspResult: "",
    });

    const ui = reactive({
      anime: false,
      camera: false,
    });

    const videoInfo = reactive({});

    // surveyor
    const Survey = {
      instances: null,

      init: () => {
        Survey.term();
        Survey.instances = [];
      },

      term: () => {
        if (Survey.instances) {
          if (Survey.instances.length) {
            Survey.instances.forEach((observer) => observer.disconnect());
          }
        }
      },

      add: (target, surveyor) => {
        Survey.instances.push(createResizeObserver(target, surveyor));
      },
    };

    // quaggajs
    const QuaggaJS = {
      interface: null,
    };

    return {
      quaggaConfigStore,
      model,
      ui,
      videoInfo,

      init() {
        //QuaggaJS.init();
        const quaggaConfig = quaggaConfigStore.getConfig();

        (QuaggaJS.interface = require("./quagga.js")({
          config: quaggaConfig,

          processed: (result) => result,

          detected: (result, { quagga }) => {
            const code = result.codeResult.code;

            const canvas = quagga.canvas.dom.image;

            model.imageURL = canvas.toDataURL();

            this.addGallary({
              code: code,
              imageURL: this.model.imageURL,
              result,
              checker: quagga.checker,
            });

            this.doScan();
            this.doStop();

            ui.anime = true;
          },

          live: () => {
            Survey.init();

            const body = document.body;
            const view = body.querySelector("div.viewport");
            const video = view.querySelector("video");
            const canvas = view.querySelector("canvas.debug");

            Survey.add([body, view, video, canvas], (entries) => {
              entries.forEach((entry) => {
                const target = entry.target;
                const rect = entry.contentRect;
                const selector =
                  target.localName +
                  (target.id ? "#" + target.id : "") +
                  (target.className
                    ? "." + target.className.split(" ").join(".")
                    : "");

                videoInfo[selector] = {
                  width: Math.floor(rect.width),
                  height: Math.floor(rect.height),
                };
              });
            });

            Survey.add([video], (entries) => {
              entries.forEach((entry) => {
                //console.log("[Survey.surveyor] entry", entry);

                const viewRect = entry.contentRect;

                video.width = viewRect.width;

                const videoRect = video.getBoundingClientRect();

                canvas.width = videoRect.width;
                canvas.height = videoRect.height;
              });
            });
          },
        })).init({
          init: () => {
            ui.camera = true;
          },
        });
      },

      term() {
        //QuaggaJS.term();
        if (QuaggaJS.interface) {
          QuaggaJS.interface.term();
          Survey.term();
          ui.camera = false;
        }
      },
    };
  },

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

  /* data() {
    return {
      model: {
        imageURL: "",
        gallery: [{ code: "", imageURL: "", result: null, checker: null }],
        dspResult: "",
      },
    };
  }, */

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
});
</script>
