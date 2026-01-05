<template>
  <v-row v-if="totalPages > 1" justify="start" class="my-3 text-common">
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      :total-visible="totalVisible"
      size="small"
      rounded="lg"
    ></v-pagination>
  </v-row>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

export interface PaginationOption {
  page: number;
  limit: number;
  offset?: number;
}

interface Props {
  pagination: PaginationOption;
  totalItems: number;
  totalVisible?: number;
}

const limitItemDefault = 10;

const props = withDefaults(defineProps<Props>(), {
  totalVisible: 5,
});

const emit = defineEmits<{
  (e: "update:pagination", value: PaginationOption): void;
}>();

/* ===== state nội bộ ===== */
const currentPage = ref<number>(props.pagination.page);
const itemsPerPage = ref<number>(props.pagination.limit ?? limitItemDefault);

/* ===== total page ===== */
const totalPages = computed(() => {
  if (!props.totalItems || itemsPerPage.value <= 0) return 0;
  return Math.ceil(props.totalItems / itemsPerPage.value);
});

/* ===== emit pagination ===== */
const emitPagination = () => {
  emit("update:pagination", {
    page: currentPage.value,
    limit: itemsPerPage.value,
    offset: (currentPage.value - 1) * itemsPerPage.value,
  });
};

/* ===== user đổi page ===== */
watch(currentPage, () => {
  emitPagination();
});

/* ===== parent update pagination ===== */
watch(
  () => props.pagination,
  (val) => {
    if (val.page !== currentPage.value) currentPage.value = val.page;
    if (val.limit !== itemsPerPage.value) itemsPerPage.value = val.limit;
  },
  { deep: true }
);

/* ===== totalItems thay đổi → reset page nếu vượt ===== */
watch(totalPages, (pages) => {
  if (currentPage.value > pages && pages > 0) {
    currentPage.value = 1;
    emitPagination();
  }
});
</script>
