<template>
  <v-dialog
    persistent
    :model-value="modelValue"
    max-width="600"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title
        class="modal-title-custom text-white d-flex align-center justify-space-between"
      >
        {{ isLogin ? "ĐĂNG NHẬP TÀI KHOẢN" : "ĐĂNG KÝ TÀI KHOẢN" }}
        <v-btn icon @click="modelValue = false" variant="text">
          <v-icon class="text-white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Social -->
      <div class="d-flex justify-center gap-2 my-5">
        <v-btn color="#3b5998" variant="flat">
          <v-icon start>mdi-facebook</v-icon>
          Facebook
        </v-btn>

        <v-btn class="ml-3" color="#db4437" variant="flat">
          <v-icon start>mdi-google</v-icon>
          Google
        </v-btn>
      </div>

      <!-- Form -->
      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-row>
            <v-col>
              <label v-if="!isLogin" class="input-label text-common"
                >Tên người dùng</label
              >
              <v-text-field
                v-if="!isLogin"
                v-model="fullName"
                variant="outlined"
                hide-details="auto"
                class="custom-input"
                placeholder="Nhập họ và tên..."
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label class="input-label text-common">Email</label>
              <v-text-field
                v-model="email"
                variant="outlined"
                hide-details="auto"
                class="custom-input"
                placeholder="Nhập email..."
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mb-4">
            <v-col>
              <label class="input-label text-common">Mật khẩu</label>
              <v-text-field
                v-model="password"
                variant="outlined"
                hide-details="auto"
                class="custom-input"
                type="password"
                placeholder="Nhập mật khẩu..."
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Forgot -->
          <div v-if="isLogin" class="text-caption text-common mb-4">
            Bạn quên mật khẩu? Hãy bấm
            <a href="#" class="text-green">tại đây</a>
          </div>

          <!-- Submit -->
          <v-btn @click="submitForm()" block color="#029d16" size="large">
            {{ isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ" }}
          </v-btn>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <!-- Switch -->
      <div class="text-center my-4 text-caption">
        <template v-if="isLogin">
          Chưa có tài khoản? Đăng ký
          <a
            href="#"
            class="text-green"
            @click.prevent="emit('switch', 'register')"
          >
            tại đây
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
  <MessageDialog
    v-model="showMessage"
    :message="message"
    :isSuccess="isSuccess"
  />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { authRegisterApi } from "../composables/register";
import { userApi } from "../composables/userInfo";
import MessageDialog from "./MessageDialog.vue";
import { useLocalStorage } from "@vueuse/core";

const { loginBuyer } = authLoginApi();
const auth = useAuthStore();
const { getMe } = userApi();
const userStorage = useLocalStorage<any>("user_me", "");

const modelValue = defineModel<boolean>({ required: true });
const props = defineProps<{
  modelValue: boolean;
  mode: "login" | "register";
}>();

const emit = defineEmits(["update:modelValue", "switch"]);

const email = ref("");
const password = ref("");
const fullName = ref("");

const isLogin = computed(() => props.mode === "login");

const close = () => emit("update:modelValue", false);

const registerBuyer = async () => {
  const registerParam: any = ref({
    fullName: fullName.value,
    email: email.value,
    password: password.value,
  });
  try {
    const { registerBuyer } = authRegisterApi();
    const registerRes = await registerBuyer(registerParam.value);
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
  }
};

const doLogin = async () => {
  const loginParam = ref({
    email: email.value,
    password: password.value,
  });
  try {
    const res = await loginBuyer(loginParam.value);
    auth.setToken(res.token);
    const userMe = await getMe();
    handleDologinSucess(userMe);
  } catch (err) {
    handleDologinError();
  }
};

const submitForm = () => {
  if (isLogin) {
    doLogin();
  } else {
    registerBuyer();
  }
};
const showMessage = ref<boolean>(false);
const message = ref("");
const isSuccess = ref<boolean>(false);
const handleDologinSucess = (userMe: any) => {
  userStorage.value = JSON.stringify(userMe);
  showMessage.value = true;
  message.value = "Đăng nhập thành công";
  isSuccess.value = true;
};
const handleDologinError = () => {
  showMessage.value = true;
  message.value = "Đăng nhập thất bại, tên người dùng hoặc mật khẩu chưa đúng";
  isSuccess.value = false;
};
</script>

<style scoped>
.text-green {
  color: #7cb305;
  font-weight: 500;
  cursor: pointer;
}
</style>
