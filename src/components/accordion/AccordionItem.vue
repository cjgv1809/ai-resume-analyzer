<script setup lang="ts">
withDefaults(defineProps<{ id: string; class?: string }>(), {});
</script>

<template>
  <div :class="['overflow-hidden border-b border-gray-200', $props.class]">
    <slot />
  </div>
</template>
