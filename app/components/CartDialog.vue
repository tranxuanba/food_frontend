<template>
  <v-dialog v-model="confirmShoppingCart" max-width="500" persistent>
    <v-card>
      <v-card-title class="modal-title-custom text-white d-flex align-center justify-space-between">
        Mua hàng thành công
        <v-btn icon @click="confirmShoppingCart = false" variant="text">
          <v-icon class="text-white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="text-common">
        <v-row class="pa-4">
          <v-icon>mdi-check-circle</v-icon>Sản phẩm này vừa được thêm vào giỏ hàng
        </v-row>
        <v-divider class="my-4" />
        <v-row>
          <v-col cols="4">
            <v-img :src="imageUrl" aspect-ratio="1" cover />
          </v-col>
          <v-col cols="8">
            <v-row class="pa-4 food-title">{{ foodName }}</v-row>
            <v-row class="ps-4">Số lượng: <span>{{ quantity }}</span></v-row>
            <v-row class="pa-4">Giá: <span class="price">{{ price }}</span></v-row>
          </v-col>
        </v-row>

      </v-card-text>
      <v-divider />
      <v-card-actions class="my-2 d-flex justify-center">
        <v-btn class="btn-shopping-cart text-none" :text="'Giỏ hàng(' + totalCount + ')'" @click="handleShoppingCart" />
        <v-btn class="btn-payment-cart text-none" text="Tiến hành thanh toán" @click="handlePayment" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useCartItemMeList } from "../composables/cartItemMe";

const { useCartItemMes } = useCartItemMeList();


const confirmShoppingCart = defineModel<boolean>({ required: true });
const props = defineProps<{
  foodName: string;
  imageUrl: string;
  price: string;
  foodId: number;
  userId: string;
  totalCount: number;
}>();
const emit = defineEmits(["update:visible"]);
const quantity = computed(() => {
  const cartItem = useCartItemMes.value.find(
    item => item.foodId === props.foodId
  );
  return cartItem?.quantity ?? 0;
});

function handleShoppingCart() {
  navigateTo(`/shopping-cart`);
}

function handlePayment() {
  navigateTo(`/order-page`);
}
</script>

<style scoped>
.btn-shopping-cart {
  background-color: #029d16 !important;
  color: #e9e2e2 !important;
}

.btn-payment-cart {
  background-color: #9c9696 !important;
  color: #e9e2e2 !important;
}

.price {
  color: #f57c00;
}

.food-title {
  color: #1e1d1d;
}
</style>
