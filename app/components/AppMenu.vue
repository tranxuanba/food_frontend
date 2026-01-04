<template>
  <v-container style="background-color: #029d16; color: white; margin-bottom: 15px">
    <template v-for="(menu, index) in menus" :key="index">
      <v-btn v-if="!menu.children" variant="text" :to="menu.to">
        {{ menu.title }}
      </v-btn>
      <v-menu v-else :open-on-click="true" location="bottom" offset="8">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text">
            {{ menu.title }}
            <v-icon end>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-card width="300">
          <v-list>
            <v-list-item v-for="item in menu.children" :key="item.categoryId" @click="onClickCategory(item.categoryId)">
              {{ item.categoryName }}
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </template>
  </v-container>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useCategoryList } from "../composables/categoryList";

// lấy danh sách category
const { useCategoryes, setSelectedCategoryId } = useCategoryList();

const menus = computed(() => [
  { title: "Trang chủ", to: "/food-main" },
  { title: "Khuyến mãi" },
  {
    title: "Sản phẩm",
    children: useCategoryes.value,
  },
  {
    title: "Sản phẩm nổi bật",
    children: useCategoryes.value,
  },
  { title: "Giới thiệu" },
  { title: "Tin tức" },
  { title: "Liên hệ" },
]);
const onClickCategory = async (categoryId: any) => {
  setSelectedCategoryId(categoryId);
};
</script>
<style scoped></style>
