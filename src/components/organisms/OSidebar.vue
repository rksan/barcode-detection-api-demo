<template>
  <div class="offcanvas d-flex flex-column flex-shrink-0" :class="compTheme">
    <div class="offcanvas-header" :class="compTheme">
      <slot name="header" />
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body">
      <slot />
    </div>
    <div class="offcanvas-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
//import OSettings from "@/components/organisms/OSettings";

export default {
  name: "o-sidebar",

  // components: { OSettings },

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
