<template>
  <form>
    <div class="row">
      <label class="form-label" for="input-readers">Readers</label>
      <div class="col">
        <b-form-checkbox-group
          id="input-readers"
          v-model="model.readers"
          :options="READERS_OPTIONS"
        />
      </div>
    </div>

    <div>
      <label class="form-label" for="input-workers">Workers(0 - 8)</label>
      <div class="row">
        <div class="col-8">
          <b-progress :min="WORKERS_RANGE.min" :max="WORKERS_RANGE.max">
            <b-progress-bar :value="model.numOfWorkers">
              <span>{{ `${model.numOfWorkers} / ${WORKERS_RANGE.max}` }}</span>
            </b-progress-bar>
          </b-progress>
        </div>
        <div class="col-1">
          <b-form-spin-button
            id="input-workers"
            v-model="model.numOfWorkers"
            :min="WORKERS_RANGE.min"
            :max="WORKERS_RANGE.max"
            inline
          />
        </div>
      </div>
    </div>

    <div>
      <label class="form-label" for="input-camera">Camera</label>
      <b-form-select
        id="input-camera"
        v-model="model.deviceId"
        :options="CAMERAS_OPTIONS"
      ></b-form-select>
    </div>

    <fieldset>
      <legend>Video</legend>

      <div class="row">
        <div class="col">
          <label class="form-label">Ratio</label>
          <b-form-select
            id="input-ratio"
            v-model="model.ratio"
            :options="RADIO_OPTIONS"
            disabled
          >
          </b-form-select>
        </div>
        <div class="col">
          <label class="form-label">width</label>
          <b-form-input
            type="number"
            v-model="model.width"
            :min="WIDTH.min"
            :max="WIDTH.max"
            step="10"
          />
        </div>
        <div class="col">
          <label class="form-label">height</label>
          <b-form-input
            type="number"
            v-model="model.height"
            :min="HEIGHT.min"
            :max="HEIGHT.max"
            step="10"
          />
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

<script>
import {
  useQuaggaConfigStore,
  QUAGGA_DEFAULT_CONFIGS,
} from "@/store/quagga-config";

export default {
  name: "o-settings",

  methods: {
    doClickOk() {
      Object.entries(this.model).forEach(([key, value]) => {
        this.quaggaConfigStore.setConfig(key, value);
      });
      this.quaggaConfigStore.setEvents("update");
    },
  },

  data() {
    return {
      model: {
        deviceId: this.quaggaConfigStore.cameras.deviceId,
        ratio: "16x9",
        readers: this.quaggaConfigStore.readers,
        numOfWorkers: this.quaggaConfigStore.numOfWorkers,
        width: this.quaggaConfigStore.width.ideal,
        height: this.quaggaConfigStore.height.ideal,
        singleChannel: this.quaggaConfigStore.singleChannel,
      },
      message: "",
    };
  },

  setup() {
    const store = {
      quaggaConfigStore: useQuaggaConfigStore(),
    };

    const devices = QUAGGA_DEFAULT_CONFIGS.devices();

    const data = {
      READERS_OPTIONS: QUAGGA_DEFAULT_CONFIGS.readers("values").map(
        (value) => ({
          text: value,
          value: value,
        })
      ),

      WORKERS_RANGE: QUAGGA_DEFAULT_CONFIGS.numOfWorkers("range"),

      DEVICES: devices,

      CAMERAS_OPTIONS: QUAGGA_DEFAULT_CONFIGS.cameras().map((device) => ({
        text: device.label,
        value: device.deviceId,
      })),

      RADIO_OPTIONS: ["21x9", "16x9", "4x3", "1x1"].map((ratio) => ({
        text: ratio,
        value: ratio,
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

    return {
      ...data,
      ...store,
    };
  },
};
</script>

<style scoped></style>
