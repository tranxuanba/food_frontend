<template>
  <v-row>
    <v-col cols="2">
      <v-card elevation="0" class="product-filter" variant="outlined">
        <v-sheet color="#029d16" class="px-4 py-2 text-white font-weight-bold">
          Danh mục
        </v-sheet>
        <v-card-text>
          <v-checkbox
            v-for="item in categories"
            :key="item.categoryId"
            v-model="selectedCategories"
            :label="item.categoryName"
            :value="item.categoryId"
            hide-details
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-row class="food-cart pt-3 pr-3">
        <v-col class="pa-0" v-for="item in useFoods" :key="item.foodId">
          <v-card
            class="product-card"
            elevation="0"
            variant="outlined"
            rounded="lg"
          >
            <v-img :src="item.imageUrl" aspect-ratio="1" contain />
            <v-card-text class="text-center pt-3">
              <v-tooltip activator="parent" location="top">
                {{ item.foodName }}
              </v-tooltip>
              <div class="text-ellipsis">
                {{ item.foodName }}
              </div>
            </v-card-text>
            <v-card-actions class="px-3 pb-3">
              <div class="text-green">
                {{ formatPrice(item.price) }}
              </div>
              <v-spacer />
              <v-btn
                icon
                variant="text"
                @click="showProductDialog(item.foodId)"
              >
                <v-icon>mdi-eye-outline</v-icon>
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="success"
                @click="addToCart(item, $event)"
              >
                <v-icon>mdi-cart-plus</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <Pagination
          v-model:pagination="pagination"
          :totalItems="totalItems"
          @update:pagination="handlePaginationUpdate"
        />
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
import {
  cartItemMeUpdateApi,
  cartItemMeListApi,
  useCartItemMeList,
} from "../composables/cartItemMe";
import { useLocalStorage } from "@vueuse/core";

import Pagination from "../components/Pagination.vue";
import { ref, onMounted } from "vue";
import ProductDialog from "../components/ProductDialog.vue";

const { setTotalCount, setCartItemMes } = useCartItemMeList();
const { useFoods, setPagination } = useFoodList();
const { setUseCategoryes, setSelectedCategories, useSelectedCategories } =
  useCategoryList();
const showDialog = ref(false);
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
const totalItems = ref<number>(0);
watch(
  () => useFoods.value,
  (val) => {
    if (val.length > 0) {
      totalItems.value = val[0].totalCount;
    }
  },
  { immediate: true }
);

const pagination = ref<any>({
  page: 1,
  limit: 10,
  offset: 0,
});
const handlePaginationUpdate = async (pagination: any) => {
  setPagination(pagination);
};

const foodNameCart = ref<string>("");
const imageUrlCart = ref<string>("");
const priceCart = ref<string>("");
const userId = ref<string>("");
const foodIdCart = ref<number>(0);
const totalCount = ref<number>(0);
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
};
const userCartItemStorage = useLocalStorage<CartMeLocalStorage[] | any>(
  "cart_me_localstorage",
  []
);
const addToCartLocalstorage = (item: CartMeLocalStorage) => {
  const index = userCartItemStorage.value.findIndex(
    (cartItem: any) => cartItem.foodId === item.foodId
  );

  if (index !== -1) {
    userCartItemStorage.value[index].quantity += item.quantity || 1;
  } else {
    userCartItemStorage.value.push({
      ...item,
      quantity: item.quantity || 1,
    });
  }
};

const addToCart = async (item: any, event: MouseEvent) => {
  const sourceEl = event.currentTarget as HTMLElement;
  flyToCart(sourceEl);
  if (isLoginOk()) {
    addToCartLocalstorage({
      foodId: item.foodId,
      foodName: item.foodName,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: 1,
    });
  } else {
    await callCartMeUpdateApi(userId.value, item.foodId);
    foodNameCart.value = item.foodName;
    imageUrlCart.value = item.imageUrl;
    priceCart.value = formatPrice(item.price);
    foodIdCart.value = item.foodId;
  }
  await getTotalCount();
  animateCart();
};
const animateCart = () => {
  if (!cartIcon.value) return;

  cartIcon.value.classList.remove("cart-animate");
  // ép reflow để animation chạy lại
  void cartIcon.value.offsetWidth;
  cartIcon.value.classList.add("cart-animate");
};

const { cartIcon } = useCartIcon();
const flyToCart = (sourceEl: HTMLElement) => {
  if (!cartIcon.value) return;

  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = cartIcon.value.getBoundingClientRect();

  const flyEl = sourceEl.cloneNode(true) as HTMLElement;

  flyEl.style.position = "fixed";
  flyEl.style.left = `${sourceRect.left}px`;
  flyEl.style.top = `${sourceRect.top}px`;
  flyEl.style.width = `${sourceRect.width}px`;
  flyEl.style.height = `${sourceRect.height}px`;
  flyEl.style.zIndex = "9999";
  flyEl.style.pointerEvents = "none";
  flyEl.style.transition = "all 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)";

  document.body.appendChild(flyEl);

  requestAnimationFrame(() => {
    flyEl.style.left = `${targetRect.left}px`;
    flyEl.style.top = `${targetRect.top}px`;
    flyEl.style.transform = "scale(0.2)";
    flyEl.style.opacity = "0";
  });

  setTimeout(() => {
    flyEl.remove();
  }, 700);
};
const totalCountLocalstorage = computed(() =>
  userCartItemStorage.value.reduce(
    (sum: any, item: any) => sum + item.quantity,
    0
  )
);
const cartItemList = ref<any[]>([]);
const getTotalCount = async () => {
  if (isLoginOk()) {
    totalCount.value = totalCountLocalstorage.value;
    cartItemList.value = userCartItemStorage.value || "[]";
    setCartItemMes(cartItemList.value);
    setTotalCount(totalCount.value);
  } else {
    const cartParam: any = {
      userId: userId.value,
    };
    try {
      const { cartItemMeList } = cartItemMeListApi();
      cartItemList.value = await cartItemMeList(cartParam);
      totalCount.value = cartItemList.value[0]?.totalCount ?? 0;
      setCartItemMes(cartItemList.value);
      setTotalCount(totalCount.value);
    } catch (err) {
      console.error("Fetch food error", err);
    }
  }
};
const callCartMeUpdateApi = async (userId: string, foodId: number) => {
  const { useCartItemMes } = useCartItemMeList();
  const cartItem = useCartItemMes.value.find((item) => item.foodId === foodId);

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

const formatPrice = (price: any) => price.toLocaleString("vi-VN") + "đ";

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
const selectedCategories = ref<number[]>(useSelectedCategories.value ?? []);
watch(selectedCategories, (newVal) => {
  if (!newVal) {
    setSelectedCategories([]);
  } else {
    setSelectedCategories(newVal ?? []);
  }
});
watch(useSelectedCategories, (newVal) => {
  if (newVal) {
    selectedCategories.value = newVal;
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

.food-cart {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.text-green {
  color: #029d16;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 13rem !important;
  text-align: center !important;
}
</style>
