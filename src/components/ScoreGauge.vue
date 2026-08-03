<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from "vue";

const props = withDefaults(defineProps<{ score?: number }>(), { score: 75 });

const pathLength = ref(0);
const pathRef = useTemplateRef<SVGPathElement>("path");

const percentage = computed(() => props.score / 100);
const strokeDashoffset = computed(() => pathLength.value * (1 - percentage.value));

onMounted(() => {
  if (pathRef.value) {
    pathLength.value = pathRef.value.getTotalLength();
  }
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="relative w-40 h-20">
      <svg viewBox="0 0 100 50" class="w-full h-full">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#a78bfa" />
            <stop offset="100%" stop-color="#fca5a5" />
          </linearGradient>
        </defs>

        <path
          d="M10,50 A40,40 0 0,1 90,50"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="10"
          stroke-linecap="round"
        />

        <path
          ref="path"
          d="M10,50 A40,40 0 0,1 90,50"
          fill="none"
          stroke="url(#gaugeGradient)"
          stroke-width="10"
          stroke-linecap="round"
          :stroke-dasharray="pathLength"
          :stroke-dashoffset="strokeDashoffset"
        />
      </svg>

      <div class="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <div class="text-xl font-semibold pt-4">{{ score }}/100</div>
      </div>
    </div>
  </div>
</template>
