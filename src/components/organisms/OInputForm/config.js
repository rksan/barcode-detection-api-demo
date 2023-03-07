export default {
  inputStream: {
    name: "Live",
    type: "LiveStream",
    target: "#interactive.viewport",

    /* constraints: {
      width: 1280,
      height: 720,
      facingMode: "environment",
      // deviceId: "7832475934759384534",
    }, */

    constraints: {
      width: { min: 1280, ideal: 1920, max: 2560 },
      height: { min: 720, ideal: 1080, max: 1440 },
      facingMode: "environment",
      // deviceId: "7832475934759384534",
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

    singleChannel: false, // true: only the red color-channel is read
  },
  numOfWorkers: navigator.hardwareConcurrency || 4,
  decoder: {
    readers: ["ean_reader"],
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
