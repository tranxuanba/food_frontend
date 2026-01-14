<template>
  <v-container class="pb-0">
    <template v-for="(menu, index) in menus" :key="index">
      <v-btn
        class="text-none font-weight-bold text-common"
        variant="text"
        :to="menu.to"
      >
        {{ menu.title }}
      </v-btn>
    </template>
  </v-container>
  <v-divider class="my-4" />
</template>
<script setup lang="ts">
const menus = computed(() => [
  { title: "DANH MỤC CATEGORY", to: "/admin-food-category" },
  { title: "DANH MỤC SẢN PHẨM", to: "/admin-food" },
  { title: "DANH SÁCH ĐƠN ĐÃ ĐẶT", to: "/admin-order" },
]);
</script>
<style scoped></style>
