import { createApp } from "vue";
import App from "./App.vue";

import BootstrapVueNext from "bootstrap-vue-next";

// Optional, since every component imports their Bootstrap functionality
// the following line is not necessary
// import 'bootstrap'

import "bootstrap/dist/css/bootstrap.css";

import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { createPinia } from "pinia";

createApp(App).use(createPinia()).use(BootstrapVueNext).mount("#app");
