<script setup lang="ts">
import { Accordion, AccordionContent, AccordionHeader, AccordionItem } from "~/components/accordion";
import CategoryHeader from "~/components/CategoryHeader.vue";
import CategoryContent from "~/components/CategoryContent.vue";
import type { Feedback } from "~/types";

defineProps<{ feedback: Feedback }>();

const sections = [
  { id: "tone-style", title: "Tone & Style", key: "toneAndStyle" as const },
  { id: "content", title: "Content", key: "content" as const },
  { id: "structure", title: "Structure", key: "structure" as const },
  { id: "skills", title: "Skills", key: "skills" as const },
];
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <Accordion>
      <AccordionItem v-for="section in sections" :id="section.id" :key="section.id">
        <AccordionHeader :item-id="section.id">
          <CategoryHeader :title="section.title" :category-score="feedback[section.key].score" />
        </AccordionHeader>
        <AccordionContent :item-id="section.id">
          <CategoryContent :tips="feedback[section.key].tips" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
