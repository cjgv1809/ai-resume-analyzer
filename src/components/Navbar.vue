<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/">
      <p class="text-2xl font-bold text-gradient">RESUMIND</p>
    </RouterLink>
    <RouterLink to="/upload" class="primary-button w-fit"> Upload Resume </RouterLink>
  </nav>
</template>
