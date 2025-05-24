import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Receipt from "./pages/Receipt.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/receipt/:token", component: Receipt },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount("#app");
