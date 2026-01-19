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
        {{ isLogin ? "Đăng nhập tài khoản" : "Đăng ký tài khoản" }}
        <v-btn icon @click="modelValue = false" variant="text">
          <v-icon class="text-white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Social -->
      <div class="d-flex justify-center gap-2 my-5">
        <v-btn color="#3b5998" variant="flat" class="text-none">
          <v-icon start>mdi-facebook</v-icon>
          Facebook
        </v-btn>

        <v-btn class="ml-3 text-none" color="#db4437" variant="flat">
          <v-icon start>mdi-google</v-icon>
          Google
        </v-btn>
      </div>

      <!-- Form -->
      <v-form ref="formRef">
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
                  :rules="fullNameRules"
                  variant="outlined"
                  hide-details="auto"
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
                  :rules="emailRules"
                  hide-details="auto"
                  placeholder="Nhập email..."
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mb-4">
              <v-col>
                <label class="input-label text-common">Mật khẩu</label>
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  variant="outlined"
                  hide-details="auto"
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
            <v-btn
              @click="submitForm()"
              block
              color="#029d16"
              size="large"
              class="text-none"
            >
              {{ isLogin ? "Đăng nhập" : "Đăng ký" }}
            </v-btn>
          </v-col>
          <v-col cols="1"></v-col>
        </v-row>
      </v-form>
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

//validate
const fullNameRules = [
  (v: any) => !!v || "Tên người dùng không được để trống",
  (v: string | any[]) =>
    (v && v.length <= 100) || "Tên người dùng không được quá 100 ký tự",
];
const emailRules = [
  (v: any) => !!v || "Email không được để trống",
  (v: string) => /.+@.+\..+/.test(v) || "Email không đúng định dạng",
];
const passwordRules = [
  (v: any) => !!v || "Mật khẩu không được để trống",
  (v: string | any[]) =>
    (v && v.length >= 6 && v.length <= 12) || "Mật khẩu phải từ 6 đến 12 ký tự",
];

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
const registerBuyer = async () => {
  const registerParam: any = ref({
    fullName: fullName.value,
    email: email.value,
    password: password.value,
  });
  try {
    const { registerBuyer } = authRegisterApi();
    await registerBuyer(registerParam.value);
  } catch (err) {
    handleRegisterError();
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
    const userMe = await getMe(res.token);
    handleDologinSucess(userMe);
  } catch (err) {
    handleDologinError();
  }
};
const formRef = ref<any>(null);
const submitForm = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  if (isLogin.value) {
    await doLogin();
  } else {
    await registerBuyer();
    await doLogin();
  }
};
const showMessage = ref<boolean>(false);
const message = ref("");
const isSuccess = ref<boolean>(false);
const handleDologinSucess = async (userMe: any) => {
  modelValue.value = false;
  userStorage.value = userMe;
  showMessage.value = true;
  message.value = "Đăng nhập thành công";
  isSuccess.value = true;
};
const handleDologinError = () => {
  showMessage.value = true;
  message.value = "Đăng nhập thất bại, tên người dùng hoặc mật khẩu chưa đúng.";
  isSuccess.value = false;
};

const handleRegisterError = () => {
  showMessage.value = true;
  message.value =
    "Đăng ký tài khoản thất bại, địa chỉ email hoặc mật khẩu không hợp lệ hoặc email đã được sử dụng rồi.";
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
