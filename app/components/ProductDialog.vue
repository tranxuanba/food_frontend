<template>
  <v-dialog v-model="modelValue" max-width="900" persistent>
    <v-card>
      <!-- Close button -->
      <v-card-title
        class="modal-title-custom text-white d-flex align-center justify-space-between"
      >
        Chi tiết sản phẩm
        <v-btn icon @click="close()" variant="text">
          <v-icon class="text-white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-row class="mx-0 my-0">
        <!-- Image -->
        <v-col cols="12" md="6" class="pa-0">
          <v-img :src="foodInfo.imageUrl" aspect-ratio="1" cover />
        </v-col>

        <!-- Content -->
        <v-col cols="12" md="6">
          <h2 class="mb-2 text-common">{{ foodInfo.foodName }}</h2>

          <div class="mb-3 text-common">
            Trạng thái:
            <v-chip :color="stockInfo.color" size="small" class="ml-2" label>
              {{ stockInfo.text }}
            </v-chip>
          </div>

          <div class="price mb-4">{{ formatPrice(foodInfo.price) }}</div>

          <p class="text-body-2 text-common mb-4">
            {{ foodInfo.description }}
          </p>

          <div class="mb-4 text-common">
            <strong>Loại sản phẩm:</strong> {{ foodInfo.categoryName }}
          </div>

          <!-- Quantity + Button -->
          <div class="text-common d-flex align-center">
            <div class="d-flex align-center">
              <span class="mr-2">Số lượng</span>
              <v-number-input
                inset
                variant="solo-filled"
                v-model="foodInfo.quantity"
                control-variant="split"
                elevation="0"
                class="no-shadow-number"
                hide-details
                @update:model-value="(val) => onQuantityChange(val)"
              ></v-number-input>
            </div>

            <v-btn 
              color="#029d16"
              class="text-none ml-6"
              size="large"
              @click="addToCart(foodInfo)"
            >
              MUA HÀNG
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
  <CartDialog
    v-model="showCartDialog"
    :foodName="foodNameCart"
    :imageUrl="imageUrlCart"
    :price="priceCart"
    :foodId="foodIdCart"
    :userId="userId"
    :totalCount="totalCount"
  />
  <ConfirmLoginDialog v-model="confirmLogin" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  cartItemMeUpdateApi,
  cartItemMeListApi,
  useCartItemMeList,
} from "../composables/cartItemMe";
import { useLocalStorage } from "@vueuse/core";

const { setTotalCount, setCartItemMes } = useCartItemMeList();
const showCartDialog = ref(false);
const props = defineProps<{
  modelValue: boolean;
  food_info: any;
}>();
const foodInfo = computed(() => props.food_info);
const modelValue = computed(() => props.modelValue);

const stockInfo = computed(() => {
  const isInStock = foodInfo.value?.status === "0";
  console.log(foodInfo.value?.status);

  return {
    color: isInStock ? "green" : "grey",
    text: isInStock ? "✔ Còn hàng" : "✖ Hết hàng",
  };
});

// format giá
const formatPrice = (price: any) => price.toLocaleString("vi-VN") + "đ";
const emit = defineEmits(["update:modelValue"]);

const close = () => {
  emit("update:modelValue", false);
};
const quantityChange = ref<number>();
const onQuantityChange = async (updateQuantity: number) => {
  quantityChange.value = updateQuantity;
};

const foodNameCart = ref<string>("");
const imageUrlCart = ref<string>("");
const priceCart = ref<string>("");
const userId = ref<string>("");
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
};
const addToCart = async (item: any) => {
  if (isLoginOk()) {
    confirmLogin.value = true;
  } else {
    await callCartMeUpdateApi(userId.value, item.foodId);
    foodNameCart.value = item.foodName;
    imageUrlCart.value = item.imageUrl;
    priceCart.value = formatPrice(item.price);
    foodIdCart.value = item.foodId;
    await getTotalCount();
    showCartDialog.value = true;
  }
};
const cartItemList = ref<any[]>([]);
const getTotalCount = async () => {
  if (isLoginOk()) {
    return;
  } else {
    const cartParam: any = {
      userId: userId.value,
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
  const cartItem = useCartItemMes.value.find((item) => item.foodId === foodId);

  const quantityBeforeUpdate = cartItem?.quantity ?? 0;

  const updateToCartParam: any = {
    userId: userId,
    foodId: foodId,
    quantity: quantityBeforeUpdate + quantityChange.value,
  };
  try {
    const updateCartItem = cartItemMeUpdateApi();
    await updateCartItem(updateToCartParam);
  } catch (err) {
    console.error("lỗi update sản phẩm vào giỏ hàng", err);
  }
};
</script>

<style scoped>
.price {
  font-size: 28px;
  font-weight: 700;
  color: #f57c00;
}

.no-shadow-number ::v-deep(.v-field) {
  box-shadow: none !important;
  background-color: #fff !important;
}
</style>
