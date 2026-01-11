<template>
  <v-dialog v-model="messageDialog" max-width="500" persistent>
    <v-card>
      <v-card-text class="text-common">
        {{ message }}
      </v-card-text>
      <v-card-actions class="my-2 d-flex justify-center">
        <v-btn :class="isSuccess ? 'text-success' : 'text-error'" :text="isSuccess ? 'OK' : 'Trở về'"
          @click="handleOk" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";

const messageDialog = defineModel<boolean>({ required: true });
const props = defineProps<{
  message: string;
  isSuccess?: boolean;
}>();

const emit = defineEmits(["update:messageDialog"]);
const userStorage = useLocalStorage<any>("user_me", "");
const useRoleName = computed(
  () => JSON.parse(userStorage.value || "{}")?.roleName ?? ""
);
async function handleOk() {
  if (props.isSuccess) {
    if (useRoleName.value == 'ADMIN') {
      await navigateTo(`/admin-food-category`);
    } else {
      await navigateTo(`/food-main`);
    }
    window.location.reload();
  }
  messageDialog.value = false;
}
</script>

<style scoped>
.text-success {
  background-color: #029d16 !important;
  color: #e9e2e2 !important;
}

.text-error {
  background-color: #df4c20 !important;
  color: #e9e2e2 !important;
}
</style>
