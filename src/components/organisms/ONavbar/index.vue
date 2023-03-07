<template>
  <nav class="navbar navbar-expand-lg" :class="compTheme">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarHead"
        aria-controls="navbarHead"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <a class="navbar-brand text-truncate" style="max-width: 50%" href="/">
        Barcode Reader Demo
      </a>

      <div class="collapse navbar-collapse" id="navbarHead">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" href="/">Home</a>
          </li>
        </ul>

        <a
          class="btn btn-dark"
          href="https://github.com/rksan/barcode-detection-api-demo"
          target="_blank"
        >
          <i class="bi bi-github"></i> github
        </a>
      </div>

      <div class="dropdown">
        <button
          class="btn btn-dark dropdown-toggle"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="bi bi-gear-fill"></i>
        </button>
        <ul
          class="dropdown-menu dropdown-menu-end"
          aria-labelledby="dropdownMenuButton1"
        >
          <li>
            <button
              class="dropdown-item"
              data-bs-toggle="modal"
              data-bs-target="#supported-constraints-dialog"
              @click="onSC"
            >
              Supported Constraints
            </button>
          </li>

          <li>
            <button
              class="dropdown-item"
              data-bs-toggle="modal"
              data-bs-target="#enumerate-devices-dialog"
              @click="onEnumerateDevices"
            >
              Enumerate Devices
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <OModalDialog
    id="supported-constraints-dialog"
    :theme="theme"
    title="Supported Constraints"
  >
    <ul>
      <template v-for="(value, name, idx) in supportedConstraints" :key="idx">
        <li>{{ name }} : {{ value }}</li>
      </template>
    </ul>
  </OModalDialog>

  <OModalDialog
    id="enumerate-devices-dialog"
    :theme="theme"
    title="Enumerate Devices"
  >
    <ul>
      <template v-for="(value, name, idx) in devices" :key="idx">
        <li>{{ name }} : {{ value }}</li>
      </template>
    </ul>
  </OModalDialog>
</template>

<style></style>

<script>
import OModalDialog from "@/components/organisms/OModalDialog";
export default {
  name: "o-navbar",

  components: { OModalDialog },

  props: {
    theme: {
      type: String,
      default() {
        return "light";
      },
    },
  },

  computed: {
    compTheme() {
      if (this.theme === "light") {
        return ["navbar-light", "bg-light", "text-dark"].join(" ");
      } else {
        return ["navbar-dark", "bg-dark", "text-light"].join(" ");
      }
    },
  },

  data() {
    return { supportedConstraints: [], devices: [] };
  },

  methods: {
    onSC() {
      let supportedConstraints =
        navigator.mediaDevices.getSupportedConstraints();

      //this.supportedConstraints = Object.keys(supportedConstraints);
      this.supportedConstraints = supportedConstraints;
    },
    onEnumerateDevices() {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        this.devices = devices;
      });
    },
  },
};
</script>
