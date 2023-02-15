<template>
  <div v-if="checkBrowser">
    <p>Barcode Detector はこのブラウザーでは対応していません。</p>
    <p>
      <b-link
        href="https://developer.mozilla.org/ja/docs/Web/API/Barcode_Detection_API#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%BC%E3%81%AE%E4%BA%92%E6%8F%9B%E6%80%A7"
        target="_blank"
      >
        Barcode Detection API | MDN Web Docs
        <i class="bi bi-box-arrow-up-right"></i>
      </b-link>
    </p>
    <p>UserAgent : {{ userAgent }}</p>
  </div>
  <div v-else>
    <div class="row">
      <b-button @click="doStart">
        <i class="bi bi-upc-scan"></i> Barcode
      </b-button>
    </div>
    <div class="row" id="my-console">{{ model.text }}</div>
  </div>
</template>

<script>
import BarcodeDetector from "barcode-detector";

// polyfill unless already supported
if (!("BarcodeDetector" in window)) {
  window.BarcodeDetector = BarcodeDetector;
}

export default {
  name: "pInputForm",

  data() {
    return {
      model: { text: "" },
    };
  },

  setup() {},

  computed: {
    userAgent() {
      return window.navigator.userAgent;
    },
    checkBrowser() {
      return "BarcodeDetector" in window;
    },
  },

  methods: {
    console(msg) {
      this.model.text = msg;
    },
    doStart() {
      // 新しい検出器を生成
      var barcodeDetector = new BarcodeDetector({
        formats: ["code_39", "codabar", "ean_13"],
      });

      // 対応している型をチェック
      barcodeDetector.getSupportedFormats().then((supportedFormats) => {
        supportedFormats.forEach((format) => this.console(format));
      });
    },
  },
};
</script>
