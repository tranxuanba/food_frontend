<template>
  <v-app>
    <v-main>
      <v-container>
        <h1>An error occurred</h1>
        <p>{{ error?.message }}</p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const error = useError()
</script>
