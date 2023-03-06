<template>
  <PHome theme="dark" />
</template>

<script>
import PHome from "@/components/pages/Home";

export default {
  name: "App",
  components: {
    PHome,
  },
};
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
