<script setup lang="ts">
import { computed, inject } from "vue";
import { accordionKey } from "./context";

const props = withDefaults(
  defineProps<{
    itemId: string;
    class?: string;
    iconPosition?: "left" | "right";
  }>(),
  { iconPosition: "right" },
);

const context = inject(accordionKey);
if (!context) {
  throw new Error("AccordionHeader must be used within an Accordion");
}

const isActive = computed(() => context.isItemActive(props.itemId));

function handleClick() {
  context!.toggleItem(props.itemId);
}
</script>

<template>
  <button
    :class="[
      'w-full px-4 py-3 text-left focus:outline-none transition-colors duration-200 flex items-center justify-between cursor-pointer',
      props.class,
    ]"
    @click="handleClick"
  >
    <div class="flex items-center space-x-3">
      <slot v-if="iconPosition === 'left'" name="icon">
        <svg
          :class="['w-5 h-5 transition-transform duration-200', { 'rotate-180': isActive }]"
          fill="none"
          stroke="#98A2B3"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </slot>
      <div class="flex-1">
        <slot />
      </div>
    </div>
    <slot v-if="iconPosition === 'right'" name="icon">
      <svg
        :class="['w-5 h-5 transition-transform duration-200', { 'rotate-180': isActive }]"
        fill="none"
        stroke="#98A2B3"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </slot>
  </button>
</template>
