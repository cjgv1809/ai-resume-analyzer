import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { usePuterStore } from "~/stores/puter";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Kick off the Puter.js readiness/auth check before the router's first
// navigation guard runs, so route guards can await it.
usePuterStore().init();

app.use(router);
app.mount("#app");
