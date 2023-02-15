import { createApp } from "vue";
import App from "./App.vue";

import BootstrapVueNext from "bootstrap-vue-next";

// Optional, since every component imports their Bootstrap functionality
// the following line is not necessary
// import 'bootstrap'

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "bootstrap-icons/font/bootstrap-icons.css";

createApp(App).use(BootstrapVueNext).mount("#app");
