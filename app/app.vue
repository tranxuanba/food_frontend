<template>
  <NuxtLayout>
    <NuxtPage :key="$route.fullPath"/>
  </NuxtLayout>
</template>

<script setup lang="ts">
// app.vue chỉ dùng NuxtLayout + NuxtPage
</script>