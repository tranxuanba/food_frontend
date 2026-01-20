<!-- FoodSkeleton.vue -->
<template>
  <v-card class="product-card" elevation="0" variant="outlined" rounded="lg">
    <!-- Ảnh -->
    <v-skeleton-loader type="image" aspect-ratio="1" />

    <v-card-text class="text-center pt-3">
      <v-skeleton-loader type="text" width="80%" class="mx-auto" />
    </v-card-text>

    <v-card-actions class="px-3 pb-3">
      <v-skeleton-loader type="text" width="40%" />
      <v-spacer />
      <v-skeleton-loader type="avatar" size="32" />
      <v-skeleton-loader type="avatar" size="32" />
    </v-card-actions>
  </v-card>
</template>
