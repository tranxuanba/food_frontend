<template>
  <div>
    <AppHeaderTop />
    <v-row>
      <v-col cols="1"></v-col>
      <v-col cols="10">
        <AppHeaderMain v-if="!isOrderPage" />
        <AppMenu v-if="!isOrderPage" />
        <main>
          <slot />
        </main>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
    <AppFooter v-if="!isOrderPage" />
  </div>
</template>

<script setup lang="ts">
import AppHeaderTop from "../components/AppHeaderTop.vue";
import AppHeaderMain from "../components/AppHeaderMain.vue";
import AppMenu from "../components/AppMenu.vue";
import AppFooter from "../components/AppFooter.vue";

const route = useRoute();
const isOrderPage = ref<boolean>(false);
watch(
  () => route.fullPath,
  (newPath) => {
    isOrderPage.value = newPath.includes("order-page");
  },
  { immediate: true }
);
</script>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
