<template>
  <div class="contact-fab">
    <v-speed-dial v-model="open" direction="up" transition="scale-transition">
      <!-- Nút chính -->
      <template #activator="{ props }">
        <div class="pulse-wrapper" :class="{ pulse: !open }">
          <v-btn
            v-bind="props"
            color="red-darken-1"
            size="large"
            icon
            elevation="8"
          >
            <v-icon size="28">mdi-message-text</v-icon>
          </v-btn>
        </div>
      </template>

      <!-- Zalo -->
      <v-btn icon color="white" elevation="6" @click="openZalo">
        <v-img :src="ZaloImg" alt="Zalo" class="zalo-icon" />
      </v-btn>

      <!-- Gọi điện -->
      <v-btn icon color="green" elevation="6" :href="`tel:${phone}`">
        <v-icon>mdi-phone</v-icon>
      </v-btn>

      <!-- Facebook Messenger -->
      <v-btn icon color="indigo" elevation="6" @click="openFacebook">
        <v-icon>mdi-facebook-messenger</v-icon>
      </v-btn>
    </v-speed-dial>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ZaloImg from "@/assets/images/zalo.png";

/* ===== CONFIG ===== */
const phone = "0355210795";
const facebookPageId = "your_facebook_page_id";
/* ================== */

const open = ref(false);

const openZalo = () => {
  window.open(`https://zalo.me/${phone}`, "_blank");
};

const openFacebook = () => {
  window.open(`https://m.me/${facebookPageId}`, "_blank");
};
</script>

<style scoped>
.contact-fab {
  position: fixed;
  right: 20px;
  bottom: 60px;
  z-index: 9999;
}
/* Hiệu ứng nháy */
.pulse {
  animation: pulse-ring 1.8s infinite;
}

@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  70% {
    box-shadow: 0 0 0 18px rgba(244, 67, 54, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
}
.pulse-wrapper {
  border-radius: 50%;
}
.zalo-icon {
  width: 24px;
  height: 24px;
}
</style>
