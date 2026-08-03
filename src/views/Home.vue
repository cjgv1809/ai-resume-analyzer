<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import Navbar from "~/components/Navbar.vue";
import ResumeCard from "~/components/ResumeCard.vue";
import { usePuterStore } from "~/stores/puter";
import type { Resume } from "~/types";
import type { KVItem } from "~/types/puter";

const { kv } = usePuterStore();
const resumes = ref<Resume[]>([]);
const loadingResumes = ref(false);

onMounted(async () => {
  loadingResumes.value = true;

  const items = (await kv.list("resume:*", true)) as KVItem[] | undefined;
  resumes.value = items?.map((item) => JSON.parse(item.value) as Resume) ?? [];

  loadingResumes.value = false;
});
</script>

<template>
  <main class="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section class="main-section">
      <div class="page-heading py-16 animate-in fade-in duration-700">
        <h1>Track Your Applications & Resume Ratings</h1>
        <h2 v-if="!loadingResumes && resumes.length === 0">
          No resumes found. Upload your first resume to get feedback.
        </h2>
        <h2 v-else>Review your submissions and check AI-powered feedback.</h2>
      </div>

      <div v-if="loadingResumes" class="flex flex-col items-center justify-center gap-2 animate-in fade-in">
        <img src="/images/resume-scan-2.gif" class="w-[200px]" />
        <p class="text-dark-200">Loading your resumes...</p>
      </div>

      <div
        v-if="!loadingResumes && resumes.length > 0"
        class="resumes-section animate-in fade-in duration-700"
      >
        <ResumeCard v-for="resume in resumes" :key="resume.id" :resume="resume" />
      </div>

      <div
        v-if="!loadingResumes && resumes.length === 0"
        class="flex flex-col items-center justify-center mt-10 gap-6 animate-in fade-in duration-700"
      >
        <img src="/images/pdf.png" alt="" class="size-16 opacity-70" />
        <RouterLink to="/upload" class="primary-button w-fit text-xl font-semibold px-8">
          Upload Resume
        </RouterLink>
      </div>
    </section>
  </main>
</template>
