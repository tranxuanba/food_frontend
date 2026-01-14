<template>
  <v-container>
    <div class="header-main">
      <div class="">
        <v-img :width="200" aspect-ratio="16/9" contain :src="LogoBaDung" />
      </div>
      <v-text-field
        color="green"
        v-model="keyword"
        density="compact"
        label="Tìm kiếm..."
        variant="outlined"
        style="max-width: 400px"
        append-inner-icon="mdi-magnify"
        hide-details
        single-line
        @click:append-inner="onSearch"
      ></v-text-field>
      <v-menu
        open-on-hover
        location="bottom"
        offset="4"
        :open-on-click="false"
        :close-on-content-click="false"
      >
        <template #activator="{ props }">
          <v-btn
            class="text-none"
            v-bind="props"
            color="#029d16"
            variant="flat"
            @click="shoppingCart"
          >
            <v-icon start>mdi-cart-outline</v-icon>
            Giỏ hàng ({{ totalCount }})
          </v-btn>
        </template>

        <v-card min-width="400" max-height="700">
          <div v-if="useCartItemMes.length === 0">
            <v-card-text class="text-common">
              <v-row class="pa-2 d-flex align-center">
                <v-col>Giỏ hàng trống</v-col>
              </v-row></v-card-text
            >
          </div>
          <div v-else>
            <v-card-text class="text-common">
              <v-row class="py-1" v-for="item in useCartItemMes">
                <v-col cols="4">
                  <v-img :src="item.imageUrl" aspect-ratio="1" cover />
                </v-col>
                <v-col cols="7">
                  <v-row class="ps-4 pt-2 food-title">
                    <span>{{ item.foodName }}</span>
                  </v-row>
                  <v-row class="ps-4 pt-1 d-flex align-center">
                    <v-col cols="5" class="px-0"><span>Số lượng: </span></v-col>
                    <v-col cols="7" class="px-0"
                      ><v-number-input
                        inset
                        variant="solo-filled"
                        v-model="item.quantity"
                        control-variant="split"
                        elevation="0"
                        class="no-shadow-number"
                        hide-details
                        @update:model-value="
                          (val) => onQuantityChange(item, val)
                        "
                        density="compact"
                      ></v-number-input
                    ></v-col>
                  </v-row>
                  <v-row class="pb-1 ps-4"
                    >Giá:
                    <span class="price">{{
                      formatPrice(item.price)
                    }}</span></v-row
                  >
                </v-col>
                <v-col cols="1" class="d-flex align-center p-0">
                  <v-btn
                    icon
                    variant="text"
                    color="red-lighten-1"
                    @click="removeFoodInCart(item.cartItemId)"
                  >
                    <v-icon style="font-size: 25px">mdi-close-circle</v-icon>
                  </v-btn>
                </v-col>
                <v-divider />
              </v-row>
            </v-card-text>
            <v-card-actions class="mb-2 d-flex justify-center">
              <v-btn
                class="btn-shopping-cart text-none"
                text="Giỏ hàng"
                @click="handleShoppingCart"
              />
              <v-btn
                class="btn-payment-cart text-none"
                text="Thanh toán"
                @click="handlePayment"
              />
            </v-card-actions>
          </div>
        </v-card>
      </v-menu>
    </div>
  </v-container>
  <ConfirmLoginDialog v-model="confirmLogin" />
</template>

<script setup lang="ts">
import LogoBaDung from "@/assets/images/logo-ba-dung.png";
import { foodListApi, useFoodList } from "../composables/foodList";
import { ref } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { useCartItemMeList } from "../composables/cartItemMe";

const route = useRoute();
const { setTotalCount, setCartItemMes, useCartItemMes, totalCount } =
  useCartItemMeList();
const { setFoods, setSearchFoodName, usePagination } = useFoodList();
const { useSelectedCategories } = useCategoryList();
const confirmLogin = ref<boolean>(false);
const userStorage = useLocalStorage<any>("user_me", "");
const getUserId = () => {
  const userId = computed(
    () => JSON.parse(userStorage.value || "{}")?.userId ?? ""
  );
  return userId.value;
};
const isLoginOk = () => {
  if (getUserId() !== "") {
    return false;
  }
  return true;
};
const shoppingCart = () => {
  if (isLoginOk()) {
    confirmLogin.value = true;
  } else {
    navigateTo(`/shopping-cart`);
  }
};
const onQuantityChange = async (item: any, updateQuantity: number) => {
  await callCartMeUpdateApi(getUserId(), item.foodId, updateQuantity);
  await getCartInfo();
};
const callCartMeUpdateApi = async (
  userId: string,
  foodId: number,
  quantity: number
) => {
  const updateToCartParam: any = {
    userId: userId,
    foodId: foodId,
    quantity: quantity,
  };
  try {
    const updateCartItem = cartItemMeUpdateApi();
    await updateCartItem(updateToCartParam);
  } catch (err) {
    console.error("lỗi update sản phẩm vào giỏ hàng", err);
  }
};
const cartItemList = ref<any[]>([]);
const getCartInfo = async () => {
  if (isLoginOk()) {
    return;
  } else {
    const cartParam: any = {
      userId: getUserId(),
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
const callCartMeDeleteApi = async (cartItemId: number) => {
  const deleteCartParam: any = {
    cartItemId: cartItemId,
  };
  try {
    const deleteCartItem = cartItemMeDeleteApi();
    await deleteCartItem(deleteCartParam);
  } catch (err) {
    console.error("xóa cart không thành công", err);
  }
};
const removeFoodInCart = async (cartItemId: any) => {
  await callCartMeDeleteApi(cartItemId);
  await getCartInfo();
};
const keyword = ref("");
onMounted(async () => {
  getFoodList();
});
const onSearch = () => {
  getFoodList();
};
watch(useSelectedCategories, (newVal) => {
  if (newVal) {
    getFoodList();
    if (!route.fullPath.includes("food-main")) {
      navigateTo(`/food-main`);
    }
  }
});
watch(
  () => usePagination.value.offset,
  (newVal) => {
    getFoodList();
  }
);

const foods = ref<any[]>([]);
const getFoodList = async () => {
  const searchForm: any = {
    categoryIds:
      useSelectedCategories.value.length == 0
        ? null
        : useSelectedCategories.value,
    foodName: keyword.value,
    limit: usePagination.value.limit ?? 10,
    offset: usePagination.value.offset ?? 0,
  };
  try {
    const { foodList } = foodListApi();
    foods.value = await foodList(searchForm);
    setFoods(foods.value);
    setSearchFoodName(keyword.value);
  } catch (err) {
    console.error("Fetch food error", err);
  }
};
function handleShoppingCart() {
  navigateTo(`/shopping-cart`);
}

function handlePayment() {
  navigateTo(`/order-page`);
}
const formatPrice = (price: any) => price.toLocaleString("vi-VN") + "đ";
</script>

<style scoped>
.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 28px;
  font-weight: bold;
  color: #7bbf00;
}

.cart {
  background: #7bbf00;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 20px;
}

.delivery-text {
  padding: 30px 30px;
  border-radius: 20px;
}

.price {
  color: #f57c00;
}

.food-title {
  color: #1e1d1d;
}

.btn-shopping-cart {
  background-color: #029d16 !important;
  color: #e9e2e2 !important;
}

.btn-payment-cart {
  background-color: #9c9696 !important;
  color: #e9e2e2 !important;
}

.no-shadow-number ::v-deep(.v-field) {
  box-shadow: none !important;
  background-color: #fff !important;
}
</style>
