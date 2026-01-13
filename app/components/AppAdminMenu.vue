<template>
  <v-container style="background-color: #029d16; color: white; margin-bottom: 15px">
    <template v-for="(menu, index) in menus" :key="index">
      <v-btn class="text-none" variant="text" :to="menu.to">
        {{ menu.title }}
      </v-btn>
    </template>
  </v-container>
</template>
<script setup lang="ts">
const menus = computed(() => [
  { title: "Danh mục category", to: "/admin-food-category" },
  { title: "Danh mục sản phẩm", to: "/admin-food" },
  { title: "Danh sách đơn đã đặt", to: "/admin-order" },
]);

</script>
<style scoped></style>
