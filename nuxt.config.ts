import { defineNuxtConfig } from "nuxt/config";
import vuetify from "vite-plugin-vuetify";

export default defineNuxtConfig({
  css: [
    "@/assets/css/main.css",
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    plugins: [vuetify()],
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:8080/api/food",
    },
  },
  modules: ["@pinia/nuxt"],
});
