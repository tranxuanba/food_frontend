<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  items: any[];
  modelValue: number;
  itemsPerPage?: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const limit = computed(() => props.itemsPerPage ?? 10);

const pageCount = computed(() => Math.ceil(props.items.length / limit.value));

const pagedItems = computed(() => {
  const start = (props.modelValue - 1) * limit.value;
  return props.items.slice(start, start + limit.value);
});
</script>

<template>
  <!-- slot để render list tùy ý -->
  <slot :items="pagedItems" />

  <div class="d-flex justify-center mt-4">
    <v-pagination
      :model-value="modelValue"
      :length="pageCount"
      rounded="lg"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>
