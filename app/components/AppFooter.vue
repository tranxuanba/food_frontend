<template>
  <v-footer class="app-footer ps-0 pe-0" color="#029d16">
    <v-container class="py-0">
      <v-row class="" dense>
        <!-- Cột 1: Thông tin công ty -->
        <v-col cols="3">
          <v-list bg-color="#029d16">
            <v-list-subheader class="text-footer">Shop nhà Ba Dung</v-list-subheader>
            <v-list-item v-for="(item, i) in baDungItems" :key="i" :value="item" color="primary">
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>

              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Cột 2: Danh mục -->
        <v-col cols="3">
          <v-list bg-color="#029d16">
            <v-list-subheader class="text-footer">Danh mục sản phẩm</v-list-subheader>
            <v-list-item v-for="(item, i) in categoryItems" :key="i" :value="item.categoryId" color="primary"
              @click="onClickCategory(item.categoryId)">
              <template #prepend>
                <v-icon icon="mdi-circle" size="10" color="white" />
              </template>

              <v-list-item-title v-text="item.categoryName"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Cột 3: Hỗ trợ -->
        <v-col cols="3">
          <v-list bg-color="#029d16">
            <v-list-subheader class="text-footer">Hỗ trợ khách hàng</v-list-subheader>
            <v-list-item v-for="(item, i) in supportItems" :key="i" :value="item" color="primary">
              <template #prepend>
                <v-icon icon="mdi-circle" size="10" color="white" />
              </template>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Cột 4: Về Organic -->
        <v-col cols="3">
          <v-list bg-color="#029d16">
            <v-list-subheader class="text-footer">Về chúng tôi</v-list-subheader>
            <v-list-item v-for="(item, i) in aboutUsItems" :key="i" :value="item" color="primary">
              <template #prepend>
                <v-icon icon="mdi-circle" size="10" color="white" />
              </template>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row class="ma-2 d-flex align-center">
        <div>© {{ year }} Bản quyền thuộc về Trần Xuân Ba</div>
      </v-row>
    </v-container>
  </v-footer>
</template>
<script setup lang="ts">
import { useCategoryList } from "../composables/categoryList";

// lấy danh sách category
const { useCategoryes, setSelectedCategories } = useCategoryList();

const year = new Date().getFullYear();
const baDungItems = [
  { text: "Căn chung cư số 3012A, Tòa I4 Imperia Smart City, Khu đô thị mới Tây Mỗ - Đại Mỗ, Hà Nội", icon: "mdi-map-marker" },
  { text: "035 521 0795", icon: "mdi-phone" },
  { text: "Thứ 2 - Chủ nhật: 9:00 - 18:00", icon: "mdi-clock-outline" },
  { text: "thoitran2107@gmail.com", icon: "mdi-email-outline" },
];

const categoryItems = computed(() => useCategoryes.value);
const supportItems = [
  { text: "Câu hỏi thường gặp" },
  { text: "Khách hàng thân thiết" },
  { text: "Chính sách đổi trả hàng" },
  { text: "Chính sách cho cộng tác viên" },
];
const aboutUsItems = [{ text: "Giới thiệu" }, { text: "Tầm nhìn & Sứ mệnh" }];
const onClickCategory = async (categoryId: number[]) => {
  setSelectedCategories(categoryId);
};
</script>
<style scoped>
.text-footer {
  color: #fff;
  font-size: 18px !important;
}

.app-footer {
  color: #fff;
  font-size: 14px;
}

</style>
