<template>
  <v-footer class="app-footer ps-0 pe-0" color="#029d16">
    <v-container>
      <v-row class="" dense>
        <!-- Cột 1: Thông tin công ty -->
        <v-col cols="3">
          <v-list bg-color="#029d16">
            <v-list-subheader class="text-footer"
              >SHOP NHÀ BA DUNG</v-list-subheader
            >
            <v-list-item
              v-for="(item, i) in baDungItems"
              :key="i"
              :value="item"
              color="primary"
            >
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
            <v-list-subheader class="text-footer"
              >DANH MỤC SẢN PHẨM</v-list-subheader
            >
            <v-list-item
              v-for="(item, i) in categoryItems"
              :key="i"
              :value="item.categoryId"
              color="primary"
            >
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
            <v-list-subheader class="text-footer"
              >HỖ TRỢ KHÁCH HÀNG</v-list-subheader
            >
            <v-list-item
              v-for="(item, i) in supportItems"
              :key="i"
              :value="item"
              color="primary"
            >
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
            <v-list-subheader class="text-footer"
              >VỀ CHÚNG TÔI</v-list-subheader
            >
            <v-list-item
              v-for="(item, i) in aboutUsItems"
              :key="i"
              :value="item"
              color="primary"
            >
              <template #prepend>
                <v-icon icon="mdi-circle" size="10" color="white" />
              </template>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row class="footer-bottom">
        <div class="ps-4">© {{ year }} Bản quyền thuộc về Trần Xuân Ba</div>
      </v-row>
    </v-container>
  </v-footer>
</template>
<script setup lang="ts">
import { useCategoryList } from "../composables/categoryList";

// lấy danh sách category
const { useCategoryes } = useCategoryList();

const year = new Date().getFullYear();
const baDungItems = [
  { text: "339/26 Tô Hiến Thành, P.12, Q.10, TP. HCM", icon: "mdi-map-marker" },
  { text: "079 668 0669", icon: "mdi-phone" },
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
</script>
<style scoped>
.text-footer {
  color: #fff;
  font-weight: bold;
}

.app-footer {
  color: #fff;
  font-size: 14px;
}
.footer-bottom {
  padding-top: 15px;
}
</style>
