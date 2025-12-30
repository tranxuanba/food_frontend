<template>
  <v-row>
    <v-col cols="2">
      <v-card elevation="0" class="product-filter" variant="outlined">
        <v-sheet color="#029d16" class="px-4 py-2 text-white font-weight-bold">
          Danh mục
        </v-sheet>
        <v-card-text>
          <v-radio-group v-model="selectedCategory">
            <v-radio
              v-for="item in categories"
              :label="item.categoryName"
              :value="item.categoryId"
            />
          </v-radio-group>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-row>
        <v-col
          v-for="item in useFoods"
          :key="item.foodId"
          cols="2"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="product-card"
            elevation="0"
            variant="outlined"
            rounded="lg"
          >
            <v-img :src="item.imageUrl" aspect-ratio="1" cover />

            <v-card-text class="text-center pt-3">
              {{ item.foodName }}
            </v-card-text>

            <!-- Giá + Action -->
            <v-card-actions class="px-3 pb-3">
              <div class="text-green">
                {{ formatPrice(item.price) }}
              </div>

              <v-spacer />

              <!-- Xem chi tiết -->
              <v-btn
                icon
                variant="text"
                @click="showProductDialog(item.foodId)"
              >
                <v-icon>mdi-eye-outline</v-icon>
              </v-btn>

              <!-- Thêm giỏ -->
              <v-btn
                icon
                variant="text"
                color="success"
                @click="addToCart(item)"
              >
                <v-icon>mdi-cart-plus</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <Pagination v-model="page" :items="users" :items-per-page="10" />
      </v-row>
    </v-col>
  </v-row>
  <div class="category-page"></div>
  <ProductDialog v-model="showDialog" :food_info="foodDetail" />
</template>

<script setup lang="ts">
import { categoryListApi, useCategoryList } from "../composables/categoryList";
import { useFoodList } from "../composables/foodList";
import { foodInfoApi } from "../composables/foodInfo";

import Pagination from "../components/Pagination.vue";
import { ref, onMounted } from "vue";
import ProductDialog from "../components/ProductDialog.vue";

const { useFoods } = useFoodList();
const { setUseCategoryes } = useCategoryList();
const showDialog = ref(false);
const foodDetail = ref<Record<string, any>>({});
const showProductDialog = async (foodId: number) => {
  const param: any = {
    foodId: foodId,
  };
  try {
    const { foodInfo } = foodInfoApi();
    foodDetail.value = await foodInfo(param);
    console.log(foodDetail.value)
  } catch (err) {
    console.error("Fetch food error", err);
  }
  showDialog.value = true;
};

const page = ref(1);
const users = Array.from({ length: 37 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
}));

const cart = ref<any[]>([]);

const addToCart = (product: any) => {
  const found = cart.value.find((p) => p.id === product.id);

  if (found) {
    found.quantity += 1;
  } else {
    cart.value.push({
      ...product,
      quantity: 1,
    });
  }

  console.log("Cart:", cart.value);
};

onMounted(async () => {
  getCategoryList();
});

// format giá
const formatPrice = (price: any) => price.toLocaleString("vi-VN") + "đ";

// lấy danh sách category
const categories = ref<any[]>([]);

const getCategoryList = async () => {
  try {
    const { categoryList } = categoryListApi();
    categories.value = await categoryList();
    setUseCategoryes(categories.value);
  } catch (err) {
    console.error("Fetch food error", err);
  }
};
const selectedCategory = ref(null);
</script>

<style scoped>
.category-page {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.products {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.product-filter {
  max-width: 260px;
  border: 1px solid #eee;
  overflow: hidden !important;
}

.product-card {
  transition: 0.2s ease;
  border: 1px solid #eee;
}

.text-green {
  color: #029d16;
}
</style>
