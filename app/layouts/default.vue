<template>
  <div class="app-layout">
    <AppHeaderTop />

    <div class="page-container">
      <AppHeaderMain
        v-if="!isOrderPage && (useRoleName === 'BUYER' || useRoleName === '')"
      />

      <AppMenu
        v-if="!isOrderPage && (useRoleName === 'BUYER' || useRoleName === '')"
      />

      <AppAdminMenu v-if="useRoleName === 'ADMIN'" />

      <main class="page-content">
        <slot />
      </main>
    </div>

    <AppFooter
      v-if="!isOrderPage && (useRoleName === 'BUYER' || useRoleName === '')"
    />
  </div>
</template>

<script setup lang="ts">
import AppHeaderTop from "../components/AppHeaderTop.vue";
import AppHeaderMain from "../components/AppHeaderMain.vue";
import AppMenu from "../components/AppMenu.vue";
import AppFooter from "../components/AppFooter.vue";
import AppAdminMenu from "../components/AppAdminMenu.vue";
import { useLocalStorage } from "@vueuse/core";

const userStorage = useLocalStorage<any>("user_me", {});
const useRoleName = computed(() => userStorage.value.roleName ?? "");

const route = useRoute();
const isOrderPage = ref(false);

watch(
  () => route.fullPath,
  (path) => {
    isOrderPage.value = path.includes("order-page");
  },
  { immediate: true },
);
</script>

<style>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-container {
  max-width: 80%;
  margin: 0 auto;
  width: 100%;
}

.page-content {
  min-height: 60vh;
}

/* Mobile */
@media (max-width: 600px) {
  .page-container {
    max-width: 100%;
  }
}
</style>
