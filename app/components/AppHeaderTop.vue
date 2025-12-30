<template>
  <div class="top-bar">
    <v-btn variant="text" color="white">
      <v-icon start>mdi-phone</v-icon>
      Hotline: 079 668 0669
    </v-btn>
    <v-chip text-color="white">
      <v-icon start>mdi-map-marker</v-icon>
      Địa chỉ: 339/26 Tô Hiến Thành, P.12, Q.10, TP. HCM
    </v-chip>
    <v-chip text-color="white">
      <v-icon start>mdi-truck-fast</v-icon>
      Giao hàng nhanh: Bán kính 2km
    </v-chip>
    <v-chip text-color="white">
      <v-icon start>mdi-clock-outline</v-icon>
      Giờ làm việc: T2 - T7 từ 7h30 đến 6h00
    </v-chip>
    <div>
      <v-btn @click="authClick(true)" variant="text" size="small">
        <v-icon start>mdi-login</v-icon>
        {{ loginUserName !== "" ? loginUserName : "Đăng nhập" }}
      </v-btn>

      <v-btn
        v-if="loginOk == false"
        @click="authClick(false)"
        variant="text"
        size="small"
      >
        <v-icon start>mdi-account-plus</v-icon>
        Đăng ký
      </v-btn>
      <v-btn
        v-if="loginOk == true"
        @click="logoutClick()"
        variant="text"
        size="small"
      >
        <v-icon start>mdi-logout</v-icon>
        Logout
      </v-btn>
    </div>
  </div>
  <LoginDialog v-model="showAuth" :mode="mode" @switch="switchMode" />
</template>
<script setup lang="ts">
import { ref } from "vue";
import LoginDialog from "../components/LoginDialog.vue";
import { useLocalStorage } from "@vueuse/core";

const auth = useAuthStore();

const showAuth = ref(false);
const loginOk = ref<boolean>(false);
const mode = ref<"login" | "register">("login");
const authClick = (isLogin: boolean) => {
  if (loginOk.value) return;
  showAuth.value = true;
  mode.value = isLogin ? "login" : "register";
};
const switchMode = (m: any) => {
  mode.value = m;
};

const userStorage = useLocalStorage<any>("user_me", "");

const loginUserName = computed(
  () => JSON.parse(userStorage.value || "{}")?.username ?? ""
);
if (loginUserName.value !== "") {
  loginOk.value = true;
}

watch(loginUserName, (newVal) => {
  if (newVal.value !== "") {
    loginOk.value = true;
  }else{
    loginOk.value = false;
  }
});

const logoutClick = () => {
  loginOk.value = false;
  auth.clear();
  userStorage.value = "";
};
</script>
<style scoped>
.top-bar {
  background: #029d16;
  align-items: center;
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 6px 16px;
  font-size: 14px;
}
</style>
