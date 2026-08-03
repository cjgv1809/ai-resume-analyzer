<script setup lang="ts">
import { computed } from "vue";
import ScoreBadge from "~/components/ScoreBadge.vue";

const props = defineProps<{ title: string; score: number }>();

const textColor = computed(() => {
  if (props.score > 70) return "text-green-600";
  if (props.score > 49) return "text-yellow-600";
  return "text-red-600";
});
</script>

<template>
  <div class="resume-summary">
    <div class="category">
      <div class="flex flex-row gap-2 items-center justify-center">
        <p class="text-2xl">{{ title }}</p>
        <ScoreBadge :score="score" />
      </div>
      <p class="text-2xl">
        <span :class="textColor">{{ score }}</span
        >/100
      </p>
    </div>
  </div>
</template>
