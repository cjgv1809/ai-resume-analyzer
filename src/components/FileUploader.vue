<script setup lang="ts">
import { ref } from "vue";
import { formatSize } from "~/lib/utils";

const emit = defineEmits<{ (e: "fileSelect", file: File | null): void }>();

const maxFileSize = 20 * 1024 * 1024; // 20MB
const file = ref<File | null>(null);
const isDragActive = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
const errorMessage = ref("");

function acceptFile(candidate: File | undefined) {
  if (!candidate) return;

  if (candidate.type !== "application/pdf") {
    errorMessage.value = "Only PDF files are supported.";
    return;
  }
  if (candidate.size > maxFileSize) {
    errorMessage.value = `File is too large — max ${formatSize(maxFileSize)}.`;
    return;
  }

  errorMessage.value = "";
  file.value = candidate;
  emit("fileSelect", candidate);
}

function onDrop(event: DragEvent) {
  isDragActive.value = false;
  acceptFile(event.dataTransfer?.files[0]);
}

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  acceptFile(target.files?.[0]);
}

function openFileDialog() {
  inputRef.value?.click();
}

function removeFile() {
  file.value = null;
  errorMessage.value = "";
  if (inputRef.value) inputRef.value.value = "";
  emit("fileSelect", null);
}
</script>

<template>
  <div class="w-full gradient-border">
    <div
      role="button"
      tabindex="0"
      class="rounded-2xl transition-all duration-200 hover:ring-1 hover:ring-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e98ff]"
      :class="isDragActive && 'ring-2 ring-[#8e98ff]'"
      @click="openFileDialog"
      @keydown.enter="openFileDialog"
      @dragover.prevent="isDragActive = true"
      @dragleave.prevent="isDragActive = false"
      @drop.prevent="onDrop"
    >
      <input
        ref="inputRef"
        type="file"
        accept="application/pdf,.pdf"
        class="hidden"
        @change="onInputChange"
      />

      <div class="space-y-4 cursor-pointer">
        <div v-if="file" class="uploader-selected-file" @click.stop>
          <img src="/images/pdf.png" alt="pdf" class="size-10" />
          <div class="flex items-center space-x-3">
            <div>
              <p class="text-sm font-medium text-gray-700 truncate max-w-xs">{{ file.name }}</p>
              <p class="text-sm text-gray-500">{{ formatSize(file.size) }}</p>
            </div>
          </div>
          <button class="p-2 cursor-pointer" @click="removeFile">
            <img src="/icons/cross.svg" alt="remove" class="w-4 h-4" />
          </button>
        </div>
        <div v-else>
          <div class="mx-auto w-16 h-16 flex items-center justify-center mb-2">
            <img src="/icons/info.svg" alt="upload" class="size-20" />
          </div>
          <p class="text-lg text-gray-500">
            <span class="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p class="text-lg text-gray-500">PDF (max {{ formatSize(maxFileSize) }})</p>
          <p v-if="errorMessage" class="text-sm text-red-600 font-medium mt-2 animate-in fade-in">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
