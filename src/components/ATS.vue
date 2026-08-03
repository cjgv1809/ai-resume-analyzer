<script setup lang="ts">
import { computed } from "vue";
import type { FeedbackTip } from "~/types";

const props = defineProps<{ score: number; suggestions: FeedbackTip[] }>();

const gradientClass = computed(() => {
  if (props.score > 69) return "from-green-100";
  if (props.score > 49) return "from-yellow-100";
  return "from-red-100";
});

const iconSrc = computed(() => {
  if (props.score > 69) return "/icons/ats-good.svg";
  if (props.score > 49) return "/icons/ats-warning.svg";
  return "/icons/ats-bad.svg";
});

const subtitle = computed(() => {
  if (props.score > 69) return "Great Job!";
  if (props.score > 49) return "Good Start";
  return "Needs Improvement";
});
</script>

<template>
  <div :class="`bg-linear-to-b ${gradientClass} to-white rounded-2xl shadow-md w-full p-6`">
    <div class="flex items-center gap-4 mb-6">
      <img :src="iconSrc" alt="ATS Score Icon" class="w-12 h-12" />
      <div>
        <h2 class="text-2xl font-bold">ATS Score - {{ score }}/100</h2>
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-2">{{ subtitle }}</h3>
      <p class="text-gray-600 mb-4">
        This score represents how well your resume is likely to perform in Applicant Tracking Systems used by
        employers.
      </p>

      <div class="space-y-3">
        <div v-for="(suggestion, index) in suggestions" :key="index" class="flex items-start gap-3">
          <img
            :src="suggestion.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'"
            :alt="suggestion.type === 'good' ? 'Check' : 'Warning'"
            class="w-5 h-5 mt-1"
          />
          <p :class="suggestion.type === 'good' ? 'text-green-700' : 'text-amber-700'">
            {{ suggestion.tip }}
          </p>
        </div>
      </div>
    </div>

    <p class="text-gray-700 italic">
      Keep refining your resume to improve your chances of getting past ATS filters and into the hands of
      recruiters.
    </p>
  </div>
</template>
