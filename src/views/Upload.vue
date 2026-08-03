<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "~/components/Navbar.vue";
import FileUploader from "~/components/FileUploader.vue";
import { usePuterStore } from "~/stores/puter";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID, stripJsonCodeFence } from "~/lib/utils";
import { prepareInstructions } from "~/constants";
import type { Resume } from "~/types";

const { fs, ai, kv } = usePuterStore();
const router = useRouter();

const isProcessing = ref(false);
const statusText = ref("");
const file = ref<File | null>(null);

function handleFileSelect(selected: File | null) {
  file.value = selected;
}

interface AnalyzeArgs {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File;
}

async function handleAnalyze({ companyName, jobTitle, jobDescription, file }: AnalyzeArgs) {
  isProcessing.value = true;

  statusText.value = "Uploading the file...";
  const uploadedFile = await fs.upload([file]);
  if (!uploadedFile) {
    statusText.value = "Error: Failed to upload file";
    return;
  }

  statusText.value = "Converting to image...";
  const imageFile = await convertPdfToImage(file);
  if (!imageFile.file) {
    statusText.value = "Error: Failed to convert PDF to image";
    return;
  }

  statusText.value = "Uploading the image...";
  const uploadedImage = await fs.upload([imageFile.file]);
  if (!uploadedImage) {
    statusText.value = "Error: Failed to upload image";
    return;
  }

  statusText.value = "Preparing data...";
  const uuid = generateUUID();
  const data: Omit<Resume, "feedback"> & { jobDescription: string; feedback: unknown } = {
    id: uuid,
    resumePath: uploadedFile.path,
    imagePath: uploadedImage.path,
    companyName,
    jobTitle,
    jobDescription,
    feedback: "",
  };

  await kv.set(`resume:${uuid}`, JSON.stringify(data));

  statusText.value = "Analyzing...";
  const feedback = await ai.feedback(uploadedFile.path, prepareInstructions({ jobTitle, jobDescription }));
  if (!feedback) {
    statusText.value = "Error: Failed to analyze resume";
    return;
  }

  const feedbackText =
    typeof feedback.message.content === "string"
      ? feedback.message.content
      : feedback.message.content[0]?.text;

  try {
    data.feedback = JSON.parse(stripJsonCodeFence(feedbackText ?? "null"));
  } catch {
    statusText.value = "Error: AI returned an invalid response, please try again";
    return;
  }

  await kv.set(`resume:${uuid}`, JSON.stringify(data));
  statusText.value = "Analysis complete, redirecting...";
  router.push(`/resume/${uuid}`);
}

function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const formData = new FormData(form);

  const companyName = formData.get("company-name") as string;
  const jobTitle = formData.get("job-title") as string;
  const jobDescription = formData.get("job-description") as string;

  if (!file.value) return;

  handleAnalyze({ companyName, jobTitle, jobDescription, file: file.value });
}
</script>

<template>
  <main class="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section class="main-section">
      <div class="page-heading py-16 animate-in fade-in duration-700">
        <h1>Smart feedback for your dream job</h1>
        <template v-if="isProcessing">
          <div class="flex items-center gap-2">
            <span class="relative flex size-2.5">
              <span
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8e98ff] opacity-75"
              />
              <span class="relative inline-flex size-2.5 rounded-full bg-[#606beb]" />
            </span>
            <h2>{{ statusText }}</h2>
          </div>
          <img src="/images/resume-scan.gif" class="w-full" />
        </template>
        <h2 v-else>Drop your resume for an ATS score and improvement tips</h2>

        <form v-if="!isProcessing" id="upload-form" class="flex flex-col gap-4 mt-8" @submit="handleSubmit">
          <div class="form-div">
            <label for="company-name" class="text-sm font-semibold">Company Name</label>
            <input id="company-name" type="text" name="company-name" placeholder="Company Name" />
          </div>
          <div class="form-div">
            <label for="job-title" class="text-sm font-semibold">Job Title</label>
            <input id="job-title" type="text" name="job-title" placeholder="Job Title" />
          </div>
          <div class="form-div">
            <label for="job-description" class="text-sm font-semibold">Job Description</label>
            <textarea id="job-description" rows="5" name="job-description" placeholder="Job Description" />
          </div>

          <div class="form-div">
            <label for="uploader" class="text-sm font-semibold">Upload Resume</label>
            <FileUploader @file-select="handleFileSelect" />
          </div>

          <button class="primary-button" type="submit" :disabled="!file">Analyze Resume</button>
        </form>
      </div>
    </section>
  </main>
</template>
