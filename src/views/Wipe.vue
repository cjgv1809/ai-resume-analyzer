<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { usePuterStore } from "~/stores/puter";
import type { FSItem } from "~/types/puter";

const store = usePuterStore();
const { isLoading, error, user } = storeToRefs(store);
const files = ref<FSItem[]>([]);

async function loadFiles() {
  files.value = (await store.fs.readDir("./")) ?? [];
}

async function handleDelete() {
  const confirmed = window.confirm(
    `This permanently deletes all ${files.value.length} file(s) and the entire key-value store for ${user.value?.username}. This cannot be undone. Continue?`,
  );
  if (!confirmed) return;

  await Promise.all(files.value.map((file) => store.fs.delete(file.path)));
  await store.kv.flush();
  await loadFiles();
}

onMounted(loadFiles);
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error {{ error }}</div>
  <div v-else>
    Authenticated as: {{ user?.username }}
    <div>Existing files:</div>
    <div class="flex flex-col gap-4">
      <div v-for="file in files" :key="file.id" class="flex flex-row gap-4">
        <p>{{ file.name }}</p>
      </div>
    </div>
    <div>
      <button class="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" @click="handleDelete">
        Wipe App Data
      </button>
    </div>
  </div>
</template>
