<script setup lang="ts">
import { provide, ref } from "vue";
import { accordionKey } from "./context";

const props = withDefaults(
  defineProps<{
    defaultOpen?: string;
    allowMultiple?: boolean;
    class?: string;
  }>(),
  { allowMultiple: false },
);

const activeItems = ref<string[]>(props.defaultOpen ? [props.defaultOpen] : []);

function toggleItem(id: string) {
  if (props.allowMultiple) {
    activeItems.value = activeItems.value.includes(id)
      ? activeItems.value.filter((item) => item !== id)
      : [...activeItems.value, id];
  } else {
    activeItems.value = activeItems.value.includes(id) ? [] : [id];
  }
}

function isItemActive(id: string) {
  return activeItems.value.includes(id);
}

provide(accordionKey, { activeItems, toggleItem, isItemActive });
</script>

<template>
  <div :class="['space-y-2', props.class]">
    <slot />
  </div>
</template>
