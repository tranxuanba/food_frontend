<template>
  <v-container>
    <!-- Data table -->
    <v-card elevation="0">
      <v-data-table
        :headers="headers"
        :items="cartItemList"
        item-key="id"
        hide-default-footer
      >
        <!-- No data -->
        <template #no-data>
          <div class="text-center py-6 text-common">
            Giỏ hàng của bạn đang trống
          </div>
        </template>
        <!-- Image -->
        <template #item.imageUrl="{ item }">
          <v-img :src="item.imageUrl" width="80" height="80" contain />
        </template>

        <!-- Price -->
        <template #item.price="{ item }">
          <span class="price">{{ formatPrice(item.price) }}</span>
        </template>

        <!-- Quantity -->
        <template #item.quantity="{ item }">
          <v-number-input
            inset
            variant="solo-filled"
            v-model="item.quantity"
            control-variant="split"
            elevation="0"
            class="no-shadow-number"
            hide-details
            @update:model-value="(val) => onQuantityChange(item, val)"
            density="compact"
          ></v-number-input>
        </template>

        <!-- Total -->
        <template #item.total="{ item }">
          <span class="price">
            {{ formatPrice(item.price * item.quantity) }}
          </span>
        </template>

        <!-- Delete -->
        <template #item.actions="{ item }">
          <v-btn
            icon
            variant="text"
            color="red-lighten-1"
            @click="removeFoodInCart(item.cartItemId, item.foodId)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Footer -->
    <div class="d-flex justify-space-between align-center mt-6">
      <div>
        <span class="mr-2 text-common">Tổng tiền:</span
        ><span class="font-weight-bold price">{{
          formatPrice(totalPrice)
        }}</span>
      </div>
      <div class="d-flex gap-3">
        <v-btn
          class="text-none"
          color="#9c9696"
          variant="flat"
          @click="continueShopping()"
        >
          Tiếp tục mua hàng
        </v-btn>
        <v-btn
          color="#029d16"
          class="ml-2 text-none"
          variant="flat"
          @click="placeOrder()"
        >
          Tiến hành đặt hàng
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCartItemMeList } from "../composables/cartItemMe";
import { useLocalStorage } from "@vueuse/core";

const { useCartItemMes } = useCartItemMeList();
const { totalCount } = useCartItemMeList();
const { setTotalCount } = useCartItemMeList();
const { setCartItemMes } = useCartItemMeList();
const onQuantityChange = async (item: any, updateQuantity: number) => {
  if (isLoginOk()) {
    const index = userCartItemStorage.value.findIndex(
      (cartItem: any) => cartItem.foodId === item.foodId
    );
    userCartItemStorage.value[index].quantity = item.quantity;
  } else {
    await callCartMeUpdateApi(getUserId(), item.foodId, updateQuantity);
  }
  await getCartInfo();
};
const userStorage = useLocalStorage<any>("user_me", {});
const getUserId = () => {
  const userId = computed(() => userStorage.value.userId ?? "");
  return userId.value;
};
const isLoginOk = () => {
  if (getUserId() !== "") {
    return false;
  }
  return true;
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
const userCartItemStorage = useLocalStorage<CartMeLocalStorage[] | any>(
  "cart_me_localstorage",
  []
);
const totalCountLocalstorage = computed(() =>
  userCartItemStorage.value.reduce(
    (sum: any, item: any) => sum + item.quantity,
    0
  )
);
totalCount.value = totalCountLocalstorage.value;
const cartItemList = ref<any[]>([]);
const getCartInfo = async () => {
  if (isLoginOk()) {
    totalCount.value = totalCountLocalstorage.value;
    cartItemList.value = userCartItemStorage.value || "[]";
  } else {
    const cartParam: any = {
      userId: getUserId(),
    };
    try {
      const { cartItemMeList } = cartItemMeListApi();
      cartItemList.value = await cartItemMeList(cartParam);
      totalCount.value = cartItemList.value[0].totalCount ?? 0;
    } catch (err) {
      console.error("Fetch food error", err);
    }
  }
  setCartItemMes(cartItemList.value);
  setTotalCount(totalCount.value);
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
const removeFoodInCart = async (cartItemId: any, foodId: any) => {
  if (isLoginOk()) {
    userCartItemStorage.value = userCartItemStorage.value.filter(
      (item: any) => item.foodId !== foodId
    );
  } else {
    await callCartMeDeleteApi(cartItemId);
  }
  await getCartInfo();
};
onMounted(async () => {
  getCartInfo();
});
const headers = [
  {
    title: "Sản phẩm",
    key: "imageUrl",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Thông tin sản phẩm",
    key: "foodName",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Đơn giá",
    key: "price",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Số lượng",
    key: "quantity",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Thành tiền",
    key: "total",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Xóa",
    key: "actions",
    headerProps: { class: "font-weight-bold text-common" },
    cellProps: {
      class: "last-column",
    },
  },
];

const formatPrice = (v: number) => v.toLocaleString("vi-VN") + "đ";
const totalPrice = computed(() =>
  useCartItemMes.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
);

const continueShopping = async () => {
  await navigateTo("/food-main");
};
const placeOrder = () => {
  navigateTo(`/order-page`);
};
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

.no-shadow-number ::v-deep(.v-field) {
  box-shadow: none !important;
  background-color: #fff !important;
  max-width: 150px !important;
}

.price {
  color: #f57c00;
}

::v-deep(.v-data-table th),
::v-deep(.v-data-table td) {
  border-left: 1px solid #eee;
}

::v-deep(.v-data-table th) {
  border-top: 1px solid #eee;
}

::v-deep(.v-data-table td) {
  border-bottom: 1px solid #eee;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

::v-deep(.v-data-table thead tr th:last-child),
::v-deep(.last-column) {
  border-right: 1px solid #eee !important;
}

::v-deep(.v-data-table-rows-no-data td) {
  border-right: 1px solid #eee !important;
}
</style>
