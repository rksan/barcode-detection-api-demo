import { defineStore } from "pinia";
// import merge from "lodash.merge";
import USER_MEDIA from "@/lib/user-media";

const getProperty = (config, name) => {
  if (config && name) {
    return config[name];
  }

  return config;
};

const QUAGGA_DEFAULT_CONFIGS = {
  width: (name) => {
    const config = {
      default: {
        min: 160,
        ideal: 1200,
        max: 10240,
      },
    };

    return getProperty(config, name);
  },

  height: (name) => {
    const config = {
      default: {
        min: 120,
        ideal: 720,
        max: 4320,
      },
    };

    return getProperty(config, name);
  },

  /**
   * @param {String} [name] "default" or "values"
   * @returns {String | Array<{value:string}>}
   * */
  readers: (name) => {
    const config = {
      default: ["ean_reader", "ean_8_reader"],
      values: [
        "code_128_reader",
        "ean_reader",
        "ean_8_reader",
        "code_39_reader",
        "code_39_vin_reader",
        "codabar_reader",
        "upc_reader",
        "upc_e_reader",
        "i2of5_reader",
        "2of5_reader",
        "code_93_reader",
      ],
    };

    return getProperty(config, name);
  },

  numOfWorkers: (name) => {
    const config = {
      default: 0,
      range: {
        min: 0,
        max: navigator.hardwareConcurrency || 4,
      },
    };

    return getProperty(config, name);
  },

  singleChannel: (name) => {
    const config = {
      default: false,
    };

    return getProperty(config, name);
  },
};

const useQuaggaConfigStore = defineStore("quagga-config", {
  state: () => ({
    readers: QUAGGA_DEFAULT_CONFIGS.readers("default"),
    numOfWorkers: QUAGGA_DEFAULT_CONFIGS.numOfWorkers("default"),
    singleChannel: QUAGGA_DEFAULT_CONFIGS.singleChannel("default"),
    width: QUAGGA_DEFAULT_CONFIGS.width("default"),
    height: QUAGGA_DEFAULT_CONFIGS.height("default"),
    events: "",
  }),

  getters: {
    getEvents: (state) => {
      return () => state.events;
    },
    getConfig: (state) => {
      return () => {
        const config = {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: "#interactive.viewport",

            constraints: {
              width: state.width,
              height: state.height,
              facingMode: "environment",
              // deviceId: state.deviceId,
            },

            /*
      area: {
        // defines rectangle of the detection/localization area
        top: "0%", // top offset
        right: "0%", // right offset
        left: "0%", // left offset
        bottom: "0%", // bottom offset
      },
       */

            singleChannel: state.singleChannel, // true: only the red color-channel is read
          },
          numOfWorkers: state.numOfWorkers, //navigator.hardwareConcurrency || 4,
          decoder: {
            readers: state.readers,
            /*
      readers: [
        "code_128_reader",
        "ean_reader",
        "ean_8_reader",
        "code_39_reader",
        "code_39_vin_reader",
        "codabar_reader",
        "upc_reader",
        "upc_e_reader",
        "i2of5_reader",
        "2of5_reader",
        "code_93_reader",
      ],
       */

            /* debug: {
      drawBoundingBox: true,
      showFrequency: true,
      drawScanline: true,
      showPattern: true,
    }, */

            /*
      multiple: false,
       */
          },
          locate: true,
          /* locator: {
    halfSample: true,
    patchSize: "medium", // x-small, small, medium, large, x-large
    debug: {
      showCanvas: true,
      showPatches: true,
      showFoundPatches: true,
      showSkeleton: true,
      showLabels: true,
      showPatchLabels: true,
      showRemainingPatchLabels: true,
      boxFromPatches: {
        showTransformed: true,
        showTransformedBox: true,
        showBB: true,
      },
    },
  }, */
        };

        return config;
      };
    },
  },

  actions: {
    setEvents(events) {
      this.events = events;
    },
    setConfig(name, value) {
      this[name] = value;
    },
  },
});

export { useQuaggaConfigStore, QUAGGA_DEFAULT_CONFIGS, USER_MEDIA };
