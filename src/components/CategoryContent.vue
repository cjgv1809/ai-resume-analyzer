<script setup lang="ts">
import { cn } from "~/lib/utils";
import type { FeedbackTipWithExplanation } from "~/types";

defineProps<{ tips: FeedbackTipWithExplanation[] }>();
</script>

<template>
  <div class="flex flex-col gap-4 items-center w-full">
    <div class="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
      <div v-for="(tip, index) in tips" :key="index" class="flex flex-row gap-2 items-center">
        <img
          :src="tip.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'"
          alt="score"
          class="size-5"
        />
        <p class="text-xl text-gray-500">{{ tip.tip }}</p>
      </div>
    </div>
    <div class="flex flex-col gap-4 w-full">
      <div
        v-for="(tip, index) in tips"
        :key="index + tip.tip"
        :class="
          cn(
            'flex flex-col gap-2 rounded-2xl p-4',
            tip.type === 'good'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-yellow-50 border border-yellow-200 text-yellow-700',
          )
        "
      >
        <div class="flex flex-row gap-2 items-center">
          <img
            :src="tip.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'"
            alt="score"
            class="size-5"
          />
          <p class="text-xl font-semibold">{{ tip.tip }}</p>
        </div>
        <p>{{ tip.explanation }}</p>
      </div>
    </div>
  </div>
</template>
