<script setup lang="ts">
import CategoryScoreBadge from "~/components/CategoryScoreBadge.vue";

defineProps<{ title: string; categoryScore: number }>();
</script>

<template>
  <div class="flex flex-row gap-4 items-center py-2">
    <p class="text-2xl font-semibold">{{ title }}</p>
    <CategoryScoreBadge :score="categoryScore" />
  </div>
</template>
