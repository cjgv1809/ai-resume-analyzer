<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import ScoreCircle from "~/components/ScoreCircle.vue";
import { usePuterStore } from "~/stores/puter";
import type { Resume } from "~/types";

const props = defineProps<{ resume: Resume }>();

const { fs } = usePuterStore();
const resumeUrl = ref("");

async function loadResume() {
  const blob = await fs.read(props.resume.imagePath);
  if (!blob) return;
  resumeUrl.value = URL.createObjectURL(blob);
}

onMounted(loadResume);
watch(() => props.resume.imagePath, loadResume);
</script>

<template>
  <RouterLink :to="`/resume/${resume.id}`" class="resume-card animate-in fade-in duration-1000">
    <div class="resume-card-header">
      <div class="flex flex-col gap-2">
        <h2 v-if="resume.companyName" class="!text-black font-bold break-words">{{ resume.companyName }}</h2>
        <h3 v-if="resume.jobTitle" class="text-lg break-words text-gray-500">{{ resume.jobTitle }}</h3>
        <h2 v-if="!resume.companyName && !resume.jobTitle" class="!text-black font-bold">Resume</h2>
      </div>
      <div class="flex-shrink-0">
        <ScoreCircle :score="resume.feedback.overallScore" />
      </div>
    </div>
    <div v-if="resumeUrl" class="gradient-border animate-in fade-in duration-1000">
      <div class="w-full h-full">
        <img
          :src="resumeUrl"
          alt="resume"
          class="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
        />
      </div>
    </div>
  </RouterLink>
</template>
