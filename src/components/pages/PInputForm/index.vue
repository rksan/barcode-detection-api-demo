<script>
import scripts from "./scripts";
export default scripts;
</script>

<template>
  <div
    class="wapper container-fluid bg-dark d-flex align-items-start flex-column"
  >
    <header class="header order-first">
      <p>Start をクリック後、ブラウザにカメラの使用を許可してください。</p>
      <b-button @click="doStart" variant="primary">
        <i class="bi bi-upc-scan"></i> Start
      </b-button>

      <b-button @click="doStop" variant="danger">
        <i class="bi bi-stop-circle-fill"></i> Stop
      </b-button>
    </header>

    <div class="content camera-demo text-center">
      <div id="interactive" class="viewport"></div>
    </div>

    <footer class="footer order-last">
      <div class="gallery row">
        <template v-for="(item, idx) in model.gallery" v-bind:key="idx">
          <div class="card bg-dark col align-middle">
            <img :src="item.imageURL" class="card-img" />

            <div class="card-body card-img-overlay text-center">
              <h5 class="card-title bg-light text-center opacity-50">
                {{ item.code }}
              </h5>
              <b-button
                href="#dspResult"
                data-bs-toggle="modal"
                data-bs-target="#dspResult"
                :data-result-index="idx"
                @click="doRsult"
                >Result
              </b-button>
            </div>
          </div>
        </template>
      </div>
    </footer>
  </div>

  <div id="dspResult" class="modal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Result</h5>
          <button
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body bg-dark">
          <code class="prettyprint linenums">
            {{ model.dspResult }}
          </code>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
html,
body {
  overflow: auto;
  margin: 0;
  padding: 0;
}

.wapper {
  width: 100vw;
  height: 100vh;
}

.header {
  color: white;
  width: 100%;
  height: fit-content;
  text-align: center;
}

.content {
  width: 100%;
  height: 100%;
  min-height: 50%;
}

.footer {
  width: 100%;
  max-width: 100vw;
  max-height: 50vh;
  min-height: 150px;
}

.camera-demo {
  background-image: radial-gradient(circle, #ddd 1px, rgba(0, 0, 0, 0) 1px);
  background-size: 1rem 1rem;
}

.viewport {
  position: relative;
  display: inline-block;
  max-width: 100%;
  max-height: 100%;
  /*width: 1280px;*/
  height: min(720px, 100%);
  aspect-ratio: 16/9;
}

.viewport > video,
.viewport > canvas {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  width: 100%;
  height: 100%;
}

.viewport > video {
  z-index: 1;
}

.viewport > canvas {
  z-index: 2;
}

.gallery {
  width: 100%;
  height: auto;
  min-height: 100%;
  max-height: 100%;
}

.gallery .card,
.gallery .card * {
  margin: 0;
  padding: 0;
}

.gallery.row {
  flex-wrap: nowrap;
}
.gallery img {
  display: block;
  object-fit: cover;
  /*max-width: 100%;*/
  max-height: 100%;
}
/*.gallery img {
  display: inline-block;
  object-fit: cover;
  max-width: min(200px, 100%);
  max-height: min(200px, 100%);
}*/
</style>
