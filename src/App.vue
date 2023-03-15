<template>
  <PAsyncPermissionMedia theme="dark">
    <PHome theme="dark" />
  </PAsyncPermissionMedia>
</template>

<script>
import PHome from "@/components/pages/Home";
import PAsyncPermissionMedia from "@/components/pages/AsyncPermissionMedia";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",

  components: {
    PAsyncPermissionMedia,
    PHome,
  },
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: calc(100vw - calc(100vw - 100%));
  height: calc(100vh - calc(100vh - 100%));
}
#app {
  width: 100%;
  height: 100%;
}
</style>
