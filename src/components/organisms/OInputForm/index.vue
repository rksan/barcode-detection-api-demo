<script>
import scripts from "./scripts";
export default scripts;
</script>

<template>
  <div class="wapper grid-container">
    <section class="header grid-item-head">
      <p>Start をクリック後、ブラウザにカメラの使用を許可してください。</p>
    </section>

    <section class="content grid-item-main">
      <div class="camera" :class="[compCameraTheme, compCameraFull].join(' ')">
        <div id="interactive" class="viewport" :class="compViewportShow">
          <span>{{ videoInfo }}</span>
        </div>
        <div class="fixed-bottom">
          <button class="btn btn-primary" @click="doStart">
            <i class="bi bi-upc-scan"></i> Start
          </button>

          <button class="btn btn-danger" @click="doStop">
            <i class="bi bi-stop-circle-fill"></i> Stop
          </button>
        </div>
      </div>
    </section>
  </div>

  <div class="footer w-100 position-absolute bottom-0 start-0">
    <div class="d-flex justify-content-end p-5">
      <div
        class="btn-group bg-secondary dropup"
        :class="compAnime"
        @animationend="doAnimationEnd"
      >
        <button
          type="button"
          class="preview-button btn btn-secondary"
          data-bs-toggle="offcanvas"
          data-bs-target="#previewList"
          aria-controls="previewList"
        >
          <i class="bi bi-images"></i>
        </button>
        <button
          type="button"
          class="btn dropdown-toggle dropdown-toggle-split"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span class="visually-hidden">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-dark">
          <li>
            <button
              class="dropdown-item"
              data-bs-toggle="offcanvas"
              data-bs-target="#previewList"
              aria-controls="previewList"
            >
              Show Preview
            </button>
          </li>
          <li>
            <button class="dropdown-item" @click="resetGallary">Reset</button>
          </li>
        </ul>

        <span
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          v-show="model.gallery.length !== 0"
        >
          {{ model.gallery.length }}
        </span>
      </div>
    </div>
  </div>

  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="previewList"
    :class="compTheme"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasExampleLabel">Previews</h5>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body">
      <div
        class="preview-list list-group list-group-flush list-group-numbered"
        style="flex-direction: column-reverse"
      >
        <template v-for="(item, idx) in model.gallery" v-bind:key="idx">
          <b-button
            class="list-group-item list-group-item-action"
            :class="compTheme"
            data-bs-toggle="modal"
            data-bs-target="#dspResult"
            :data-result-index="idx"
            @click="doRsult"
          >
            <img :src="item.imageURL" class="preview-list-img" />
            <h5 class="preview-list-text bg-light text-dark">
              Code {{ idx + 1 }}. : {{ item.code }}
            </h5>
          </b-button>
        </template>
      </div>
    </div>
  </div>

  <div id="dspResult" class="modal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content" :class="compTheme">
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
.grid-container {
  display: grid;
  grid-template-areas:
    "head"
    "main";
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  height: 100%;
}

.grid-item-head {
  grid-area: head;
}

.grid-item-main {
  grid-area: main;
}

.wapper {
  text-align: center;
  z-index: 1;
}
.content {
  max-width: 100%;
  max-height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.footer {
  z-index: 2;
}

.anime {
  /*animation: poyon 1.2s infinite;*/
  animation: poyon 1.5s linear;
  animation-fill-mode: forwards;
}

.preview-button:hover {
  animation-play-state: paused;
}

@keyframes poyon {
  0% {
    transform: scale(1, 1) translate(0%, 0%);
  }
  15% {
    transform: scale(0.9, 0.9) translate(0%, 5%);
  }
  30% {
    transform: scale(1.3, 0.8) translate(0%, 10%);
  }
  50% {
    transform: scale(0.8, 1.3) translate(0%, -10%);
  }
  70% {
    transform: scale(1.1, 0.9) translate(0%, 5%);
  }
  100% {
    transform: scale(1, 1) translate(0%, 0%);
  }
}

.preview-button > img {
  max-width: 100%;
  height: auto;
  display: block;
}

.preview-list {
  flex-direction: column-reverse;
}

.preview-list-img {
  max-width: 100%;
  height: auto;
  display: block;
}

.preview-list-text {
  display: inline-block;
  width: fit-content;
  height: fit-content;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  opacity: 75%;
  padding: 0.5em;
}
.camera {
  overflow: hidden;
  max-width: 100vw;
  width: 100%;
  height: 100%;
}
.camera-full {
  position: absolute;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
}
.camera-demo-light {
  background-image: radial-gradient(circle, #000 1px, rgba(0, 0, 0, 0) 1px);
  background-size: 1rem 1rem;
}

.camera-demo-dark {
  background-image: radial-gradient(circle, #fff 1px, rgba(0, 0, 0, 0) 1px);
  background-size: 1rem 1rem;
}

.viewport {
  /* border: 1px dotted white;
 */
  position: relative;
  display: inline-block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  /* height: calc(100vh - calc(100vh - 100%)); */
  height: 100%;
  aspect-ratio: 16/9;
}

.viewport > span {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;
  background-color: #000;
  opacity: 70%;
}

.viewport > video,
.viewport > canvas {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  width: 100%;
  /*height: 100%;*/
}

/* height > width */
@media (orientation: portrait) {
  .viewport {
    /* width: calc(100vw - calc(100vw - 100%)); */
    width: 100%;
    height: auto;
    aspect-ratio: 9/16;
  }
}

.viewport > video {
  z-index: 1;
}

.viewport > canvas {
  z-index: 2;
}
</style>
