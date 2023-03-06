<template>
  <div class="container-fluid grid-container" :class="compTheme">
    <header class="header grid-item-head">
      <ONavbar :theme="theme" />
    </header>

    <main class="main grid-item-main">
      <OInputForm :theme="theme" />
    </main>
  </div>
</template>

<style scoped>
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
</style>

<script>
import ONavbar from "@/components/organisms/ONavbar";
import OInputForm from "@/components/organisms/OInputForm";

export default {
  name: "p-home",

  components: {
    ONavbar,
    OInputForm,
  },

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
        return ["bg-light", "text-dark"].join(" ");
      } else {
        return ["bg-dark", "text-light"].join(" ");
      }
    },
  },
};
</script>
