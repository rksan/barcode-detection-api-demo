<template>
  <nav class="navbar navbar-expand-lg" :class="compTheme">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Barcode Reader Demo</a>

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

      <div class="collapse navbar-collapse" id="navbarHead">
        <ul class="navbar-nav flex-row flex-wrap">
          <li class="nav-item">
            <a class="nav-link active" href="/">Home</a>
          </li>
        </ul>
        <ul class="navbar-nav flex-row flex-wrap ms-md-auto">
          <li class="nav-item">
            <a
              class="nav-link active"
              href="https://github.com/rksan/barcode-detection-api-demo"
              target="_blank"
            >
              <i class="bi bi-github"></i> github
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style></style>

<script>
export default {
  name: "o-navbar",

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
};
</script>
