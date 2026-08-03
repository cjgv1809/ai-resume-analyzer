<script setup lang="ts">
import ScoreGauge from "~/components/ScoreGauge.vue";
import SummaryCategory from "~/components/SummaryCategory.vue";
import type { Feedback } from "~/types";

defineProps<{ feedback: Feedback }>();
</script>

<template>
  <div class="bg-white rounded-2xl shadow-md w-full">
    <div class="flex flex-row items-center p-4 gap-8">
      <ScoreGauge :score="feedback.overallScore" />

      <div class="flex flex-col gap-2">
        <h2 class="text-2xl font-bold">Your Resume Score</h2>
        <p class="text-sm text-gray-500">This score is calculated based on the variables listed below.</p>
      </div>
    </div>

    <SummaryCategory title="Tone & Style" :score="feedback.toneAndStyle.score" />
    <SummaryCategory title="Content" :score="feedback.content.score" />
    <SummaryCategory title="Structure" :score="feedback.structure.score" />
    <SummaryCategory title="Skills" :score="feedback.skills.score" />
  </div>
</template>
