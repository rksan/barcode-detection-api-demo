import { defineStore } from "pinia";
// import merge from "lodash.merge";

const getProperty = (config, name) => {
  if (config && name) {
    return config[name];
  }

  return config;
};

const QUAGGA_DEFAULT_CONFIGS = {
  /**
   *
   * @param {MediaStreamConstraints} constraints
   * @returns {Promise<MediaStream | DOMException>}
   */
  asyncUserMedias: async (constraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
  },

  _permissions: {
    video: false,
    audio: false,
  },

  _devices: [],

  devices() {
    const config = QUAGGA_DEFAULT_CONFIGS._devices;

    return config;
  },

  _cameras: [],

  cameras(name) {
    if (QUAGGA_DEFAULT_CONFIGS._permissions.video) {
      const config = QUAGGA_DEFAULT_CONFIGS._cameras;

      if (name === "default") {
        return config[0];
      }

      return config;
    }
    return [];
  },

  _microphones: [],

  microphones(name) {
    if (QUAGGA_DEFAULT_CONFIGS._permissions.audio) {
      const config = QUAGGA_DEFAULT_CONFIGS._microphones;

      if (name === "default") {
        return config[0];
      }

      return config;
    }

    return [];
  },

  /**
   *
   * @param {MediaStreamConstraints} constraints
   * @returns {Promise<InputDeviceInfo[]> | Promise<DOMException>}
   */
  asyncPermissionToUseUserMedia: async (constraints) => {
    try {
      const media = await QUAGGA_DEFAULT_CONFIGS.asyncUserMedias(constraints);

      QUAGGA_DEFAULT_CONFIGS._permissions.audio = true;

      const videos = media.getVideoTracks();
      if (0 < videos.length) {
        QUAGGA_DEFAULT_CONFIGS._permissions.video = true;
        videos.forEach((video) => video.stop());
      }

      const audios = media.getAudioTracks();
      if (0 < audios.length) {
        QUAGGA_DEFAULT_CONFIGS._permissions.audio = true;
        audios.forEach((audio) => audio.stop());
      }

      const devices = await QUAGGA_DEFAULT_CONFIGS.asyncDevices();

      QUAGGA_DEFAULT_CONFIGS._devices = devices;

      QUAGGA_DEFAULT_CONFIGS._cameras = devices.filter(
        (device) => device.kind === "videoinput" && device.label !== ""
      );

      QUAGGA_DEFAULT_CONFIGS._microphones = devices.filter(
        (device) => device.kind === "audioinput" && device.label !== ""
      );

      return Promise.resolve(devices);
    } catch (err) {
      QUAGGA_DEFAULT_CONFIGS._permissions.video = false;
      QUAGGA_DEFAULT_CONFIGS._permissions.audio = false;

      return Promise.reject(err);
    }
  },

  /**
   *
   * @returns {Promise<Array>} devices
   */
  asyncDevices: async () => {
    return await navigator.mediaDevices.enumerateDevices();
  },

  width: (name) => {
    const config = {
      default: {
        min: 1280,
        ideal: 1920,
        max: 2560,
      },
    };

    return getProperty(config, name);
  },

  height: (name) => {
    const config = {
      default: {
        min: 720,
        ideal: 1080,
        max: 1440,
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
      default: ["ean_reader"],
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
    deviceId: QUAGGA_DEFAULT_CONFIGS.cameras("default").deviceId,
    cameras: QUAGGA_DEFAULT_CONFIGS.cameras("default"),
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
              deviceId: state.deviceId,
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

export { useQuaggaConfigStore, QUAGGA_DEFAULT_CONFIGS };
