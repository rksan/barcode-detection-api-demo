<template>
  <div :id="id" class="modal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content" :class="compTheme">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <slot name="header" />
          <button
            class="btn-close"
            :class="compCloseButton"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
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
    btnSave: {
      type: Object,
      default: () => {
        return { label: "Save", click: () => {} };
      },
    },
    btnCancel: {
      type: Object,
      default: () => {
        return { label: "Cancel", click: () => {} };
      },
    },
  },

  computed: {
    compTheme() {
      if (this.theme === "light") {
        return ["bg-light", "text-dark"].join(" ");
      }
      return ["bg-dark", "text-light"].join(" ");
    },
    compCloseButton() {
      return this.theme === "light" ? "" : "btn-close-white";
    },
  },
};
</script>

<style></style>
