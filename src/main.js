import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import PatternDetails from "./components/PatternDetails.vue";
import { createVuetify } from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueDragResize from "vue3-drag-resize";
import "./style.css";
import { loadFonts } from "./plugins/webfontloader";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";

const app = createApp(App);
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/pattern-details",
      name: "pattern-details",
      component: PatternDetails,
      props: true,
    },
    {
      path: "/",
      component: App,
    },
  ],
});

app.use(router).use(VueDragResize).use(createVuetify()).mount("#app");
