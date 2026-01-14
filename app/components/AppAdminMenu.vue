<template>
  <v-container class="pb-0">
    <template v-for="(menu, index) in menus" :key="index">
      <v-btn class="text-none font-weight-bold text-common" variant="text" :to="menu.to">
        {{ menu.title }}
      </v-btn>
    </template>
  </v-container>
  <v-divider class="my-4" />
</template>
<script setup lang="ts">
const menus = computed(() => [
  { title: "Danh mục category", to: "/admin-food-category" },
  { title: "Danh mục sản phẩm", to: "/admin-food" },
  { title: "Danh sách đơn đã đặt", to: "/admin-order" },
]);
</script>
<style scoped></style>
