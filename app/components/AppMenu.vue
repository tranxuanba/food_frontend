<template>
  <v-container style="background-color: #029d16; color: white; margin-bottom: 15px">
    <template v-for="(menu, index) in menus" :key="index">
      <v-btn class="text-none" v-if="!menu.children" variant="text" :to="menu.to" :active="isActiveMenu(menu)">
        {{ menu.title }}
      </v-btn>
      <v-menu v-else :open-on-click="true" location="bottom" offset="8">
        <template #activator="{ props }">
          <v-btn class="text-none" v-bind="props" variant="text">
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
const { useCategoryes, setSelectedCategories } = useCategoryList();

const menus = computed(() => [
  {
    title: "Trang chủ", to: {
      path: "/food-main",
      query: { discount: "0" },
    },
  },
  {
    title: "Khuyến mãi", to: {
      path: "/food-main",
      query: { discount: "1" },
    },
  },
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
const onClickCategory = async (categoryId: number[]) => {
  setSelectedCategories(categoryId);
};
const route = useRoute()

const isActiveMenu = (menu: any) => {
  if (!menu.to) return false

  const menuPath = menu.to.path
  const menuDiscount = menu.to.query?.discount ?? "0"
  const currentDiscount = route.query.discount ?? "0"

  return (
    route.path === menuPath &&
    menuDiscount === currentDiscount
  )
}

</script>
<style scoped></style>
