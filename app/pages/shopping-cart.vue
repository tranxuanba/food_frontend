<template>
  <v-container>
    <!-- Data table -->
    <v-card elevation="0">
      <v-data-table
        :headers="headers"
        :items="items"
        item-key="id"
        hide-default-footer
      >
        <!-- Image -->
        <template #item.image="{ item }">
          <v-img :src="item.image" width="80" height="80" cover />
        </template>

        <!-- Price -->
        <template #item.price="{ item }">
          <span>{{ formatPrice(item.price) }}</span>
        </template>

        <!-- Quantity -->
        <template #item.quantity="{ item }">
          <v-btn size="small" variant="tonal" @click="decrease(item)">
            −
          </v-btn>

          <span class="mx-3">{{ item.quantity }}</span>

          <v-btn size="small" variant="tonal" @click="increase(item)">
            +
          </v-btn>
        </template>

        <!-- Total -->
        <template #item.total="{ item }">
          <span>
            {{ formatPrice(item.price * item.quantity) }}
          </span>
        </template>

        <!-- Delete -->
        <template #item.actions="{ item }">
          <v-btn icon variant="text" color="grey" @click="remove(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Footer -->
    <div class="d-flex justify-space-between align-center mt-6">
      <div class="font-weight-bold text-common">
        Tổng tiền: {{ formatPrice(totalPrice) }}
      </div>

      <div class="d-flex gap-3">
        <v-btn color="#9c9696" variant="flat"> Tiếp tục mua hàng </v-btn>
        <v-btn color="#029d16" class="ml-2" variant="flat"> Tiến hành đặt hàng </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import Rau1 from "@/assets/images/rau1.jpg";
import Rau2 from "@/assets/images/rau2.jpg";
import { ref, onMounted } from "vue";

const items = ref([
  {
    id: 1,
    image: Rau1,
    name: "Khoai mỡ Organic 300gr",
    price: 26000,
    quantity: 1,
  },
  {
    id: 2,
    image: Rau2,
    name: "Bún Tươi Sấy Khô 400gr Hoa Nắng",
    price: 73000,
    quantity: 1,
  },
]);

const headers = [
  {
    title: "Sản phẩm",
    key: "image",
    headerProps: { class: "font-weight-bold text-common" },
  },
  {
    title: "Thông tin sản phẩm",
    key: "name",
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
  { title: "Xóa", key: "actions", headerProps: { class: "font-weight-bold text-common" } },
];

const formatPrice = (v: number) => v.toLocaleString("vi-VN") + "đ";

const increase = (item: any) => item.quantity++;
const decrease = (item: any) => {
  if (item.quantity > 1) item.quantity--;
};
const remove = (id: number) => {
  items.value = items.value.filter((i) => i.id !== id);
};

const totalPrice = computed(() =>
  items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
);
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
