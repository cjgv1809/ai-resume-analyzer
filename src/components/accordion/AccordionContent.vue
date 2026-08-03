<script setup lang="ts">
import { computed, inject } from "vue";
import { accordionKey } from "./context";

const props = withDefaults(defineProps<{ itemId: string; class?: string }>(), {});

const context = inject(accordionKey);
if (!context) {
  throw new Error("AccordionContent must be used within an Accordion");
}

const isActive = computed(() => context!.isItemActive(props.itemId));
</script>

<template>
  <div
    :class="[
      'overflow-hidden transition-all duration-300 ease-in-out',
      isActive ? 'max-h-fit opacity-100' : 'max-h-0 opacity-0',
      props.class,
    ]"
  >
    <div class="px-4 py-3">
      <slot />
    </div>
  </div>
</template>
