<template>
  <div
    class="grid-content container-fluid"
    id="grid-item-content"
    :class="compTheme"
  >
    <header class="header" id="grid-item-head">
      <ONavbar :theme="theme" />
    </header>

    <main class="main" id="grid-item-main" :class="compTheme">
      <OInputForm :theme="theme" />
    </main>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-areas: "sidebar content";
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 2fr;
  height: 100%;
  padding: 0;
}
#grid-item-content {
  grid-area: content;
  padding: 0;
}
#grid-item-sidebar {
  grid-area: sidebar;
  min-width: 100%;
  min-height: 100%;
  padding: 0;
}

.grid-content {
  display: grid;
  grid-template-areas:
    "head"
    "main";
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  height: 100%;
}

#grid-item-head {
  grid-area: head;
}

#grid-item-main {
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
