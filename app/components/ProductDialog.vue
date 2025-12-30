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
              ></v-number-input>
            </div>

            <v-btn color="#029d16" class="ml-6" size="large"> MUA HÀNG </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

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

const quantity = ref(1);
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
