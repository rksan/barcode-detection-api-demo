<template>
  <form>
    <div class="row">
      <label class="form-label" for="input-readers">Readers</label>
      <div class="col">
        <b-form-checkbox-group
          id="input-readers"
          v-model="model.readers"
          :options="OPTIONS.READERS"
        />
      </div>
    </div>

    <div>
      <label class="form-label" for="input-workers">Workers</label>

      <div class="d-flex">
        <div class="align-self-stretch flex-fill w-100 text-center">
          <span>{{
            `${model.numOfWorkers}/${OPTIONS.WORKERS_RANGE.max}`
          }}</span>
          <input
            class="w-100 text-light"
            type="range"
            id="input-workers"
            list="input-workers-list"
            :min="OPTIONS.WORKERS_RANGE.min"
            :max="OPTIONS.WORKERS_RANGE.max"
            v-model="model.numOfWorkers"
          />
          <datalist id="input-workers-list">
            <option value="0" label="0"></option>
            <option
              v-for="n in OPTIONS.WORKERS_RANGE.max"
              :key="n"
              :value="n"
              :label="n"
            ></option>
          </datalist>
        </div>
        <div class="order-first">
          <b-button
            variant="primary"
            @click="
              OPTIONS.WORKERS_RANGE.min < model.numOfWorkers
                ? --model.numOfWorkers
                : false
            "
          >
            <i class="bi bi-arrow-left"></i>
          </b-button>
        </div>
        <div class="order-last">
          <b-button
            variant="primary"
            @click="
              model.numOfWorkers < OPTIONS.WORKERS_RANGE.max
                ? ++model.numOfWorkers
                : false
            "
          >
            <i class="bi bi-arrow-right"> </i>
          </b-button>
        </div>
      </div>
    </div>

    <div>
      <label class="form-label" for="input-camera">Camera</label>
      <b-form-select
        id="input-camera"
        v-model="model.deviceId"
        :options="OPTIONS.CAMERAS"
      ></b-form-select>
    </div>

    <fieldset>
      <legend>Video</legend>

      <div class="row">
        <div class="col">
          <label class="form-label">Ratio</label>
          <b-form-select
            id="input-ratio"
            v-model="material.ratio"
            @input="emitInputRatio"
          >
            <b-form-select-option
              v-for="(opt, idx) in OPTIONS.RATIO"
              :key="idx"
              :value="String(opt.value)"
            >
              {{ opt.text }}
            </b-form-select-option>
          </b-form-select>
        </div>
        <div class="col">
          <label class="form-label" for="input-width">width</label>
          <input
            id="input-width"
            class="form-control"
            type="number"
            v-model="model.width.ideal"
            :min="model.width.min"
            :max="model.width.max"
            step="10"
            @input="doInputWidth"
          />
        </div>
        <div class="col">
          <label class="form-label" for="input-height">height</label>
          <input
            id="input-height"
            class="form-control"
            type="number"
            v-model="model.height.ideal"
            number
            :min="model.height.min"
            :max="model.height.max"
            step="10"
            @input="doInputHeight"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <b-button @click="doClickFitSize">fix body</b-button>
        </div>
      </div>
    </fieldset>

    <fieldset>
      <legend>Options</legend>
      <div>
        <b-form-checkbox
          :checked="model.singleChannel"
          v-model="model.singleChannel"
        >
          SingleChannel
        </b-form-checkbox>
      </div>
    </fieldset>
  </form>
  <section class="modal-footer">
    <button
      class="btn btn-success"
      data-bs-dismiss="offcanvas"
      @click="doClickOk"
    >
      OK
    </button>
    <button class="btn text-light" data-bs-dismiss="offcanvas">Cancel</button>
  </section>
</template>

<script setup>
import { reactive } from "vue";

import {
  useQuaggaConfigStore,
  QUAGGA_DEFAULT_CONFIGS,
  USER_MEDIA,
} from "@/store/quagga-config";

// store
const quaggaConfigStore = useQuaggaConfigStore();

// data
const model = reactive({
  deviceId: "",
  readers: quaggaConfigStore.readers,
  numOfWorkers: quaggaConfigStore.numOfWorkers,
  width: {
    min: quaggaConfigStore.width.min,
    ideal: quaggaConfigStore.width.ideal,
    max: quaggaConfigStore.width.max,
  },
  height: {
    min: quaggaConfigStore.height.min,
    ideal: quaggaConfigStore.height.ideal,
    max: quaggaConfigStore.height.max,
  },
  singleChannel: quaggaConfigStore.singleChannel,
});

const OPTIONS = (() => {
  const devices = USER_MEDIA.devices();

  return {
    READERS: QUAGGA_DEFAULT_CONFIGS.readers("values").map((value) => ({
      text: value,
      value: value,
    })),

    WORKERS_RANGE: QUAGGA_DEFAULT_CONFIGS.numOfWorkers("range"),

    DEVICES: devices,

    CAMERAS: USER_MEDIA.cameras().map((device) => ({
      text: device.label,
      value: device.deviceId,
    })),

    RATIO: [
      {
        text: "21x9",
        value: 9 / 21,
      },
      { text: "16x9", value: 9 / 16, default: true },
      { text: "4x3", value: 3 / 4 },
      { text: "1x1", value: 1 },
    ].map((ratio) => ({
      text: ratio.text,
      value: ratio.value,
      default: ratio.default || false,
    })),

    WIDTH: {
      min: QUAGGA_DEFAULT_CONFIGS.width("default").min,
      max: QUAGGA_DEFAULT_CONFIGS.width("default").max,
    },

    HEIGHT: {
      min: QUAGGA_DEFAULT_CONFIGS.height("default").min,
      max: QUAGGA_DEFAULT_CONFIGS.height("default").max,
    },
  };
})();

const material = reactive({
  ratio: String(OPTIONS.RATIO.filter((opt) => opt.default === true)[0].value),
});

// method
/**
 * @param {Event} event
 */
const _defaultEventCancel = (event) => {
  if (event) event.preventDefault();
};

const _forceRange = ({ width, height }) => {
  if (width < OPTIONS.WIDTH.min) {
    width = OPTIONS.WIDTH.min;
  } else if (OPTIONS.WIDTH.max < width) {
    width = OPTIONS.WIDTH.max;
  }

  if (height < OPTIONS.HEIGHT.min) {
    height = OPTIONS.HEIGHT.min;
  } else if (OPTIONS.HEIGHT.max < height) {
    height = OPTIONS.HEIGHT.max;
  }

  return { width, height };
};

const emitInputRatio = (value) => {
  let height = Math.floor(
    Number.parseFloat(model.width.ideal) * Number.parseFloat(value)
  );

  const box = _forceRange({ width: value, height });

  model.width.ideal = box.width;
  model.height.ideal = box.height;
};

const doInputWidth = (event) => {
  let value = event.target.value;
  let height = Math.floor(
    Number.parseFloat(value) * Number.parseFloat(material.ratio)
  );

  const box = _forceRange({ width: value, height });

  model.width.ideal = box.width;
  model.height.ideal = box.height;
};

const doInputHeight = (event) => {
  let value = event.target.value;
  let width = Math.floor(
    Number.parseFloat(value) / Number.parseFloat(material.ratio)
  );

  const box = _forceRange({ width, height: value });

  model.width.ideal = box.width;
  model.height.ideal = box.height;
};

const doClickFitSize = () => {
  const body = document.body;
  const rect = body.getBoundingClientRect();

  const box = _forceRange({ width: rect.width, height: rect.height });

  model.width.ideal = box.width;
  model.height.ideal = box.height;
};

const doClickOk = (event) => {
  _defaultEventCancel(event);

  Object.entries(model).forEach(([key, value]) => {
    quaggaConfigStore.setConfig(key, value);
  });
  quaggaConfigStore.setEvents("update");
};
</script>

<script>
export default {
  name: "o-settings",
};
</script>

<style scoped></style>
