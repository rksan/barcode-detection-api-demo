<template>
  <div :id="id" class="modal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content" :class="compTheme">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" :class="compTheme">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "o-modal-dialog",

  props: {
    id: { type: String, default: () => "modal-dialog" },
    title: { type: String, default: () => "Modal Dialog" },
    theme: { type: String, default: () => "light" },
  },

  computed: {
    compTheme() {
      if (this.theme === "light") {
        return ["bg-light", "text-dark"].join(" ");
      }
      return ["bg-dark", "text-light"].join(" ");
    },
  },
};
</script>

<style></style>
