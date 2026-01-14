<template>
  <v-dialog v-model="confirmLogin" max-width="500" persistent>
    <v-card>
      <v-card-text class="text-common">
        Vui lòng đăng nhập để đặt hàng
      </v-card-text>
      <v-card-actions class="my-2 d-flex justify-center">
        <v-btn class="text-success text-none" text="Đăng nhập" @click="handleLogin" />
        <v-btn class="text-error text-none" text="Trở về" @click="handleCancel" />
      </v-card-actions>
    </v-card>
  </v-dialog>
  <LoginDialog v-model="showLogin" mode="login" />
</template>

<script setup lang="ts">

const confirmLogin = defineModel<boolean>({ required: true });
const emit = defineEmits(["update:visible"]);

const showLogin = ref(false);

function handleLogin() {
  showLogin.value = true;
  confirmLogin.value = false;
}

function handleCancel() {
  confirmLogin.value = false;
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
