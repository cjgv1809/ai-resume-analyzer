<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import Summary from "~/components/ResumeSummary.vue";
import ATS from "~/components/ATS.vue";
import Details from "~/components/ResumeDetails.vue";
import { usePuterStore } from "~/stores/puter";
import type { Feedback } from "~/types";

const { fs, kv } = usePuterStore();
const route = useRoute();

const imageUrl = ref("");
const resumeUrl = ref("");
const feedback = ref<Feedback | null>(null);

onMounted(async () => {
  const id = route.params.id as string;
  const record = await kv.get(`resume:${id}`);
  if (!record) return;

  const data = JSON.parse(record);

  const resumeBlob = await fs.read(data.resumePath);
  if (!resumeBlob) return;
  const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
  resumeUrl.value = URL.createObjectURL(pdfBlob);

  const imageBlob = await fs.read(data.imagePath);
  if (!imageBlob) return;
  imageUrl.value = URL.createObjectURL(imageBlob);

  feedback.value = data.feedback;
});
</script>

<template>
  <main class="!pt-0">
    <nav class="resume-nav">
      <RouterLink to="/" class="back-button">
        <img src="/icons/back.svg" alt="logo" class="w-2.5 h-2.5" />
        <span class="text-gray-800 text-sm font-semibold">Back to Homepage</span>
      </RouterLink>
    </nav>
    <div class="flex flex-row w-full max-lg:flex-col-reverse">
      <section
        class="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center"
      >
        <div
          v-if="imageUrl && resumeUrl"
          class="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit"
        >
          <a :href="resumeUrl" target="_blank" rel="noopener noreferrer">
            <img :src="imageUrl" class="w-full h-full object-contain rounded-2xl" title="resume" />
          </a>
        </div>
      </section>
      <section class="feedback-section">
        <h2 class="text-4xl !text-black font-bold">Resume Review</h2>
        <div v-if="feedback" class="flex flex-col gap-8 animate-in fade-in duration-1000">
          <Summary :feedback="feedback" />
          <ATS :score="feedback.ATS.score || 0" :suggestions="feedback.ATS.tips || []" />
          <Details :feedback="feedback" />
        </div>
        <img v-else src="/images/resume-scan-2.gif" class="w-full" />
      </section>
    </div>
  </main>
</template>
