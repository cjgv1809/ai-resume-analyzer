<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{ score?: number }>(), { score: 75 });

const radius = 40;
const stroke = 8;
const normalizedRadius = radius - stroke / 2;
const circumference = 2 * Math.PI * normalizedRadius;

const strokeDashoffset = computed(() => circumference * (1 - props.score / 100));
</script>

<template>
  <div class="relative w-[100px] h-[100px]">
    <svg height="100%" width="100%" viewBox="0 0 100 100" class="transform -rotate-90">
      <circle
        cx="50"
        cy="50"
        :r="normalizedRadius"
        stroke="#e5e7eb"
        :stroke-width="stroke"
        fill="transparent"
      />
      <defs>
        <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FF97AD" />
          <stop offset="100%" stop-color="#5171FF" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        :r="normalizedRadius"
        stroke="url(#grad)"
        :stroke-width="stroke"
        fill="transparent"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        stroke-linecap="round"
      />
    </svg>

    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="font-semibold text-sm">{{ score }}/100</span>
    </div>
  </div>
</template>
