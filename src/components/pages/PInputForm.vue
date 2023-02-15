<template>
  <p>Start をクリック後、ブラウザにカメラの使用を許可してください。</p>

  <div id="interactive" class="viewport"></div>

  <b-button @click="doStart" variant="primary">
    <i class="bi bi-upc-scan"></i> Start
  </b-button>

  <b-button @click="doStop" variant="danger">
    <i class="bi bi-stop-circle-fill"></i> Stop
  </b-button>

  <p>{{ model.log }}</p>
</template>

<script>
import Quagga from "quagga";

export default {
  name: "pInputForm",

  data() {
    return {
      model: {
        log: "",
      },
    };
  },

  setup() {},

  methods: {
    console(msg) {
      this.model.log = msg;
    },
    doStop() {
      Quagga.stop();
    },
    doStart() {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#interactive.viewport"),
        },
        function(err) {
          if (err) {
            console(err);
            return;
          }
          console("Initialization finished. Ready to start");
          Quagga.start();
        },
      });

      Quagga.onProcessed(this.doProcessed);
      Quagga.onDetected(this.doDetected);
    },
    doProcessed() {},
    doDetected() {},
  },
};
</script>
