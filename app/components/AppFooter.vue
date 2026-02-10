<template>
  <v-footer class="app-footer ps-0 pe-0" color="#029d16">
    <v-container class="p-0">
      <v-row dense class="footer-row">
        <!-- CỘT 1 -->
        <v-col cols="12" md="3" class="footer-col">
          <v-list bg-color="#029d16">
            <v-list-subheader class="text-footer footer-title">
              Shop nhà Ba Dung
            </v-list-subheader>

            <v-list-item v-for="(item, i) in baDungItems" :key="i">
              <template #prepend>
                <v-icon :icon="item.icon" />
              </template>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- CỘT 2 -->
        <v-col cols="12" md="3" class="footer-col category-sub">
          <v-list bg-color="#029d16">
            <v-list-subheader class="text-footer sub-title">
              Danh mục sản phẩm
            </v-list-subheader>

            <v-list-item
              v-for="(item, i) in categoryItems"
              :key="i"
              @click="onClickCategory(item.categoryId)"
            >
              <template #prepend>
                <v-icon icon="mdi-circle" size="8" color="white" />
              </template>
              <v-list-item-title>
                {{ item.categoryName }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- CỘT 3 -->
        <v-col cols="12" md="3" class="footer-col category-sub">
          <v-list bg-color="#029d16">
            <v-list-subheader class="text-footer sub-title">
              Hỗ trợ khách hàng
            </v-list-subheader>

            <v-list-item v-for="(item, i) in supportItems" :key="i">
              <template #prepend>
                <v-icon icon="mdi-circle" size="8" color="white" />
              </template>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- CỘT 4 -->
        <v-col cols="12" md="3" class="footer-col category-sub">
          <v-list bg-color="#029d16">
            <v-list-subheader class="text-footer sub-title">
              Về chúng tôi
            </v-list-subheader>

            <v-list-item v-for="(item, i) in aboutUsItems" :key="i">
              <template #prepend>
                <v-icon icon="mdi-circle" size="8" color="white" />
              </template>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

      <v-divider class="my-4" />
      <div class="ma-2">© {{ year }} Bản quyền thuộc về Trần Xuân Ba</div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { useCategoryList } from "../composables/categoryList";

// lấy danh sách category
const { useCategoryes, setSelectedCategories } = useCategoryList();

const year = new Date().getFullYear();
const baDungItems = [
  {
    text: "Căn chung cư số 3012A, Tòa I4 Imperia Smart City, Khu đô thị mới Tây Mỗ - Đại Mỗ, Hà Nội",
    icon: "mdi-map-marker",
  },
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
.app-footer {
  color: #fff;
  font-size: 14px;
}

/* title chính */
.footer-title {
  color: #fff;
  font-size: 18px !important;
}

/* sub title desktop */
.sub-title {
  color: #fff;
  font-size: 18px !important;
}

/* MOBILE */
@media (max-width: 600px) {
  /* dồn cột */
  .footer-col {
    padding-top: 0;
  }

  .category-sub {
    display: none;
  }
}
</style>
