<script setup lang="ts">
import { computed } from "vue";
import { cn } from "~/lib/utils";

const props = defineProps<{ score: number }>();

const tier = computed(() => {
  if (props.score > 69)
    return { bg: "bg-badge-green", text: "text-badge-green-text", icon: "/icons/check.svg" };
  if (props.score > 39)
    return { bg: "bg-badge-yellow", text: "text-badge-yellow-text", icon: "/icons/warning.svg" };
  return { bg: "bg-badge-red", text: "text-badge-red-text", icon: "/icons/warning.svg" };
});
</script>

<template>
  <div :class="cn('flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]', tier.bg)">
    <img :src="tier.icon" alt="score" class="size-4" />
    <p :class="cn('text-sm font-medium', tier.text)">{{ score }}/100</p>
  </div>
</template>
