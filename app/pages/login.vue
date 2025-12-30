<template>
  <v-dialog
    :model-value="modelValue"
    max-width="420"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <v-card class="pa-6 position-relative">
      <v-card-title
        class="modal-title-custom text-white d-flex align-center justify-space-between"
      >
        {{ isLogin ? "ĐĂNG NHẬP TÀI KHOẢN" : "ĐĂNG KÝ TÀI KHOẢN" }}
        <v-btn icon @click="modelValue = false" variant="text">
          <v-icon class="text-white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Social -->
      <div class="d-flex justify-center gap-2 mb-4">
        <v-btn color="#3b5998" variant="flat">
          <v-icon start>mdi-facebook</v-icon>
          Facebook
        </v-btn>

        <v-btn color="#db4437" variant="flat">
          <v-icon start>mdi-google</v-icon>
          Google
        </v-btn>
      </div>

      <!-- Form -->
      <v-form>
        <v-text-field
          label="Email"
          v-model="email"
          type="email"
          variant="outlined"
          class="mb-3"
        />

        <v-text-field
          label="Mật khẩu"
          v-model="password"
          type="password"
          variant="outlined"
          class="mb-3"
        />

        <v-text-field
          v-if="!isLogin"
          label="Nhập lại mật khẩu"
          v-model="confirmPassword"
          type="password"
          variant="outlined"
          class="mb-3"
        />

        <!-- Forgot -->
        <div v-if="isLogin" class="text-caption mb-4">
          Bạn quên mật khẩu?
          <a href="#" class="text-green">tại đây</a>
        </div>

        <!-- Submit -->
        <v-btn block color="green" size="large">
          {{ submitText }}
        </v-btn>
      </v-form>

      <!-- Switch -->
      <div class="text-center mt-4 text-caption">
        <template v-if="isLogin">
          Chưa có tài khoản?
          <a
            href="#"
            class="text-green"
            @click.prevent="emit('switch', 'register')"
          >
            đăng ký tại đây
          </a>
        </template>

        <template v-else>
          Đã có tài khoản?
          <a
            href="#"
            class="text-green"
            @click.prevent="emit('switch', 'login')"
          >
            đăng nhập tại đây
          </a>
        </template>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  modelValue: boolean;
  mode: "login" | "register";
}>();

const emit = defineEmits(["update:modelValue", "switch"]);

const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const isLogin = computed(() => props.mode === "login");

const title = computed(() =>
  isLogin.value ? "ĐĂNG NHẬP TÀI KHOẢN" : "ĐĂNG KÝ TÀI KHOẢN"
);

const submitText = computed(() => (isLogin.value ? "Đăng nhập" : "Đăng ký"));

const close = () => emit("update:modelValue", false);
</script>

<style scoped>
.close-btn {
  position: absolute;
  top: -12px;
  right: -12px;
  background: black;
  color: white;
}

.text-green {
  color: #7cb305;
  font-weight: 500;
  cursor: pointer;
}
</style>
