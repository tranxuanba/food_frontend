<template>
  <div class="top-bar">
    <!-- LEFT -->
    <div class="left">
      <v-btn variant="text" color="white" size="small">
        <v-icon start>mdi-phone</v-icon>
        <span class="hotline-full">Hotline: 035 521 0795</span>
        <span class="hotline-short">035 521 0795</span>
      </v-btn>
    </div>

    <!-- DESKTOP INFO -->
    <div class="desktop-info">
      <v-chip text-color="white">
        <v-icon start>mdi-map-marker</v-icon>
        Căn hộ 3012A, I4 Imperia Smart City, Tây Mỗ – Đại Mỗ
      </v-chip>
      <v-chip text-color="white">
        <v-icon start>mdi-truck-fast</v-icon>
        Giao hàng nhanh: 2km
      </v-chip>
      <v-chip text-color="white">
        <v-icon start>mdi-clock-outline</v-icon>
        T2 - T7 · 7h30 – 18h00
      </v-chip>
    </div>

    <!-- MOBILE INFO MENU -->
    <div class="mobile-info">
      <v-menu location="bottom">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" color="white" size="small">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </template>

        <v-list density="compact">
          <v-list-item>
            <v-icon start>mdi-map-marker</v-icon>
            Căn hộ 3012A, I4 Imperia Smart City
          </v-list-item>
          <v-list-item>
            <v-icon start>mdi-truck-fast</v-icon>
            Giao hàng nhanh: 2km
          </v-list-item>
          <v-list-item>
            <v-icon start>mdi-clock-outline</v-icon>
            T2 - T7 · 7h30 – 18h00
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <!-- RIGHT -->
    <div class="right">
      <v-btn
        class="text-none"
        variant="text"
        size="small"
        @click="authClick(true)"
      >
        <v-icon start>mdi-login</v-icon>
        {{ loginUserName || "Đăng nhập" }}
      </v-btn>

      <v-btn
        v-if="!loginOk"
        class="text-none"
        variant="text"
        size="small"
        @click="authClick(false)"
      >
        <v-icon start>mdi-account-plus</v-icon>
        Đăng ký
      </v-btn>

      <v-btn
        v-if="loginOk"
        class="text-none"
        variant="text"
        size="small"
        @click="logoutClick"
      >
        <v-icon start>mdi-logout</v-icon>
        Đăng xuất
      </v-btn>
    </div>
  </div>

  <LoginDialog v-model="showAuth" :mode="mode" @switch="switchMode" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import LoginDialog from "../components/LoginDialog.vue";
import { useLocalStorage } from "@vueuse/core";

const auth = useAuthStore();

const showAuth = ref(false);
const loginOk = ref(false);
const mode = ref<"login" | "register">("login");

const authClick = (isLogin: boolean) => {
  if (loginOk.value) return;
  showAuth.value = true;
  mode.value = isLogin ? "login" : "register";
};

const switchMode = (m: "login" | "register") => {
  mode.value = m;
};

const userStorage = useLocalStorage<any>("user_me", {});
const loginUserName = computed(() => userStorage.value.username ?? "");

watch(
  loginUserName,
  (val) => {
    loginOk.value = !!val;
  },
  { immediate: true },
);

const logoutClick = async () => {
  loginOk.value = false;
  auth.clear();
  userStorage.value = {};
  await navigateTo("/food-main", { replace: true });
};
</script>

<style scoped>
.top-bar {
  background: #029d16;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  font-size: 14px;
}

.left,
.right,
.desktop-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Mặc định: DESKTOP */
.mobile-info {
  display: none;
}

.hotline-short {
  display: none;
}

/* MOBILE */
@media (max-width: 1100px) {
  .desktop-info {
    display: none;
  }

  .mobile-info {
    display: none; /* ẨN LUÔN NÚT MORE */
  }

  .hotline-full {
    display: none;
  }

  .hotline-short {
    display: inline;
  }

  .top-bar {
    padding: 4px 8px;
  }
}
/* MOBILE */
@media (max-width: 945px) {
  .desktop-info {
    display: none;
  }

  .mobile-info {
    display: none; /* ẨN LUÔN NÚT MORE */
  }

  .hotline-full {
    display: none;
  }

  .hotline-short {
    display: inline;
  }

  .top-bar {
    padding: 4px 8px;
  }
}
@media (max-width: 600px) {
  .desktop-info {
    display: none;
  }

  .mobile-info {
    display: none; /* ẨN LUÔN NÚT MORE */
  }

  .hotline-full {
    display: none;
  }

  .hotline-short {
    display: inline;
  }

  .top-bar {
    padding: 4px 8px;
  }
}
</style>
