<template>
  <v-row>
    <v-col cols="2">
      <v-card elevation="0" class="product-filter" variant="outlined">
        <v-sheet color="#029d16" class="px-4 py-2 text-white font-weight-bold">
          Danh mục
        </v-sheet>
        <v-card-text>
          <v-radio-group v-model="selectedCategory">
            <v-radio v-for="item in categories" :label="item.categoryName" :value="item.categoryId" />
          </v-radio-group>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-row>
        <v-col v-for="item in useFoods" :key="item.foodId" cols="2" sm="6" md="4" lg="3">
          <v-card class="product-card" elevation="0" variant="outlined" rounded="lg">
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
              <v-btn icon variant="text" @click="showProductDialog(item.foodId)">
                <v-icon>mdi-eye-outline</v-icon>
              </v-btn>

              <!-- Thêm giỏ -->
              <v-btn icon variant="text" color="success" @click="addToCart(item)">
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
  <CartDialog v-model="showCartDialog" :foodName="foodNameCart" :imageUrl="imageUrlCart" :price="priceCart"
    :foodId="foodIdCart" :userId="userId" :totalCount="totalCount" />
  <ConfirmLoginDialog v-model="confirmLogin" />
</template>

<script setup lang="ts">
import { categoryListApi, useCategoryList } from "../composables/categoryList";
import { useFoodList } from "../composables/foodList";
import { foodInfoApi } from "../composables/foodInfo";
import { cartItemMeUpdateApi, cartItemMeListApi, useCartItemMeList } from "../composables/cartItemMe";
import { useLocalStorage } from "@vueuse/core";


import Pagination from "../components/Pagination.vue";
import { ref, onMounted } from "vue";
import ProductDialog from "../components/ProductDialog.vue";
import CartDialog from "../components/CartDialog.vue";

const { setTotalCount, setCartItemMes } = useCartItemMeList();
const { useFoods } = useFoodList();
const { setUseCategoryes, setSelectedCategoryId } = useCategoryList();
const showDialog = ref(false);
const showCartDialog = ref(false);
const foodDetail = ref<Record<string, any>>({});
const showProductDialog = async (foodId: number) => {
  const param: any = {
    foodId: foodId,
  };
  try {
    const { foodInfo } = foodInfoApi();
    foodDetail.value = await foodInfo(param);
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

const foodNameCart = ref<string>('');
const imageUrlCart = ref<string>('');
const priceCart = ref<string>('');
const userId = ref<string>('');
const foodIdCart = ref<number>(0);
const totalCount = ref<number>(0);
const confirmLogin = ref<boolean>(false);
const isLoginOk = () => {
  const userStorage = useLocalStorage<any>("user_me", "");

  const userStorageId = computed(
    () => JSON.parse(userStorage.value || "{}")?.userId ?? ""
  );
  if (userStorageId.value !== "") {
    userId.value = userStorageId.value;
    return false;
  }
  return true;
}
const addToCart = async (item: any) => {
  if (isLoginOk()) {
    confirmLogin.value = true;
  } else {
    await callCartMeUpdateApi(userId.value, item.foodId);
    foodNameCart.value = item.foodName
    imageUrlCart.value = item.imageUrl
    priceCart.value = formatPrice(item.price)
    foodIdCart.value = item.foodId
    await getTotalCount();
    showCartDialog.value = true
  }

};
const cartItemList = ref<any[]>([]);
const getTotalCount = async () => {
  if (isLoginOk()) {
    return;
  } else {
    const cartParam: any = {
      userId: userId.value
    };
    try {
      const { cartItemMeList } = cartItemMeListApi();
      cartItemList.value = await cartItemMeList(cartParam);
      totalCount.value = cartItemList.value[0].totalCount ?? 0;
      setCartItemMes(cartItemList.value);
      setTotalCount(totalCount.value);
    } catch (err) {
      console.error("Fetch food error", err);
    }
  }
};
const callCartMeUpdateApi = async (userId: string, foodId: number) => {
  const { useCartItemMes } = useCartItemMeList();
  const cartItem = useCartItemMes.value.find(
    item => item.foodId === foodId
  );

  const quantityBeforeUpdate = cartItem?.quantity ?? 0;

  const updateToCartParam: any = {
    userId: userId,
    foodId: foodId,
    quantity: quantityBeforeUpdate + 1,
  };
  try {
    const updateCartItem = cartItemMeUpdateApi();
    await updateCartItem(updateToCartParam);
  } catch (err) {
    console.error("lỗi update sản phẩm vào giỏ hàng", err);
  }
};

onMounted(async () => {
  getCategoryList();
  getTotalCount();
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
const selectedCategory = ref<number>();
watch(selectedCategory, (newVal) => {
  if (newVal) {
    setSelectedCategoryId(selectedCategory.value);
  }
});
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
