<template>
  <v-row class="mt-2">
    <v-col cols="7" class="payment-col1">
      <v-row class="pt-3">
        <v-col cols="5">
          <v-img :width="200" aspect-ratio="16/9" contain :src="LogoBaDung" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-row><span class="text-common text-bold pl-3">Thông tin nhận hàng</span></v-row>
          <v-divider class="my-4" />
          <v-row>
            <v-col>
              <label class="input-label text-common">Tên người nhận</label>
              <v-text-field v-model="receiveName" variant="outlined" hide-details="auto"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label class="input-label text-common">Email</label>
              <v-text-field v-model="email" variant="outlined" hide-details="auto" disabled></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label class="input-label text-common">Số điện thoại</label>
              <v-text-field v-model="phoneNumber" variant="outlined" hide-details="auto"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label class="input-label text-common">Địa chỉ</label>
              <v-text-field v-model="address" variant="outlined" hide-details="auto"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label class="input-label text-common">Ghi chú</label>
              <v-textarea v-model="note" variant="outlined" hide-details="auto"></v-textarea>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row><span class="text-common text-bold pl-3">Vận chuyển</span></v-row>
          <v-divider class="my-4" />
          <v-row>
            <v-col>
              <div class="delivery pa-4">Vui lòng nhập thông tin giao hàng</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-row class="pt-4"><span class="text-common text-bold pl-3">Phương thức thanh toán</span></v-row>
              <v-divider class="my-4" />
              <div class="payment-custom">
                <v-checkbox class="text-common" hide-details label="Thanh toán khi giao hàng (COD)"></v-checkbox>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="5">
      <v-row class="pt-4"><span class="text-common text-bold pl-3">Đơn hàng ({{ totalCount }} sản phẩm)</span></v-row>
      <v-divider class="my-4" />
      <v-row>
        <v-col>
          <v-data-table :headers="headers" :items="cartItemList" item-key="id" hide-default-header hide-default-footer
            class="cart-table">
            <!-- Cột hình + badge -->
            <template #item.imageUrl="{ item }">
              <div class="image-wrapper">
                <v-img :src="item.imageUrl" width="70" height="70" cover />
                <span class="qty-badge">{{ item.quantity }}</span>
              </div>
            </template>

            <!-- Cột tên -->
            <template #item.foodName="{ item }">
              <div class="text-common">
                {{ item.foodName }}
              </div>
            </template>

            <!-- Cột giá -->
            <template #item.price="{ item }">
              <div class="product-price">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row>
        <v-col cols="8"><v-text-field v-model="orderVoucher" placeholder="Nhập mã giảm giá" variant="outlined"
            hide-details="auto"></v-text-field></v-col>
        <v-col cols="4">
          <v-btn class="btn-shopping-cart text-none" size="x-large" text="Áp dụng" :disabled="orderVoucher == ''" />
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row class="text-common">
        <v-col cols="6"><span>Tạm tính</span></v-col>
        <v-col cols="6" class="total-price">{{ formatPrice(totalPrice) }}</v-col>
      </v-row>
      <v-row class="text-common">
        <v-col cols="6"><span>Phí vận chuyển</span></v-col>
        <v-col cols="6" class="total-price">-</v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row class="text-common">
        <v-col cols="6"><span style="font-size: 20px;">Tổng cộng</span></v-col>
        <v-col cols="6" class="total-price-final">{{ formatPrice(totalPrice) }}</v-col>
      </v-row>
      <v-row class="text-common">
        <v-col cols="6"><v-btn color="rgb(35 163 5)" variant="text" class="text-none" to="/shopping-cart">
            <v-icon start icon="mdi-arrow-left" />
            Quay về giỏ hàng
          </v-btn></v-col>
        <v-col cols="6" class="total-price"><v-btn class="btn-shopping-cart text-none" text="Đặt hàng" /></v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import LogoBaDung from "@/assets/images/logo-ba-dung.png";
import { useLocalStorage } from "@vueuse/core";

const userStorage = useLocalStorage<any>("user_me", "");
const userInfo = JSON.parse(userStorage.value || '{}');
const receiveName = ref<string>("");
const email = ref<string>("");
const phoneNumber = ref<string>("");
const address = ref<string>("");
const note = ref<string>("");
const totalCount = ref<number>(0);
const orderVoucher = ref<string>("");
const getUserId = () => {
  const userId = computed(
    () => userInfo?.userId ?? ""
  );
  receiveName.value = userInfo.username;
  email.value = userInfo.email;
  console.log(email.value)
  return userId.value;
};

const headers = [
  { title: "", key: "imageUrl", sortable: false, width: "150px" },
  { title: "", key: "foodName", sortable: false, width: "auto" },
  { title: "", key: "price", sortable: false, width: "150px" },
];
const totalPrice = ref<number>(0);
const cartItemList = ref<any[]>([]);
const getCartInfo = async () => {
  const cartParam: any = {
    userId: getUserId(),
  };
  try {
    const { cartItemMeList } = cartItemMeListApi();
    cartItemList.value = await cartItemMeList(cartParam);
    totalCount.value = cartItemList.value[0].totalCount ?? 0;
    totalPrice.value = cartItemList.value.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
  } catch (err) {
    console.error("Fetch food error", err);
  }
};

onMounted(async () => {
  getCartInfo();
});

const formatPrice = (v: number) => v.toLocaleString("vi-VN") + "đ";
</script>

<style scoped>
.delivery {
  background-color: #729952 !important;
  border-radius: 5px !important;
  border: 0.5px solid #eee !important;
  color: rgb(255 255 255) !important;
}

.payment-custom {
  border-radius: 5px !important;
  border: 1px solid #eee !important;
}

.payment-col1 {
  border-right: 1px solid #eee !important;
}

.text-bold {
  font-weight: 600 !important;
}

.cart-table :deep(table),
.cart-table :deep(th),
.cart-table :deep(td) {
  border: none !important;
}

.cart-table :deep(.v-data-table__td) {
  vertical-align: middle;
  padding: 10px !important;
}

.image-wrapper {
  position: relative;
  max-width: 70px !important;
  border: 1px solid #eee !important;
  border-radius: 5px !important;
}

.qty-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #f57c00;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-price {
  font-weight: 500;
  white-space: nowrap;
  text-align: right;
  color: #f57c00;
}

.total-price {
  text-align: right;
  color: #f57c00;
}

.total-price-final {
  text-align: right;
  color: #f57c00;
  font-size: 20px;
}

.btn-shopping-cart {
  background-color: #029d16 !important;
  color: #e9e2e2 !important;
}
</style>
