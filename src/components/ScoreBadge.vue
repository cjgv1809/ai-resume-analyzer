<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ score: number }>();

const badge = computed(() => {
  if (props.score > 70) return { color: "bg-badge-green text-green-600", text: "Strong" };
  if (props.score > 49) return { color: "bg-badge-yellow text-yellow-600", text: "Good Start" };
  return { color: "bg-badge-red text-red-600", text: "Needs Work" };
});
</script>

<template>
  <div :class="['px-3 py-1 rounded-full', badge.color]">
    <p class="text-sm font-medium">{{ badge.text }}</p>
  </div>
</template>
