<template>
  <div>
    <AppHeaderTop />
    <v-row>
      <v-col cols="1"></v-col>
      <v-col cols="10">
        <AppHeaderMain />
        <AppMenu />
        <main>
          <slot />
        </main>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeaderTop from "../components/AppHeaderTop.vue";
import AppHeaderMain from "../components/AppHeaderMain.vue";
import AppMenu from "../components/AppMenu.vue";
import AppFooter from "../components/AppFooter.vue";
</script>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
