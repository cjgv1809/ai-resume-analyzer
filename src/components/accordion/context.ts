import type { InjectionKey, Ref } from "vue";

export interface AccordionContext {
  activeItems: Ref<string[]>;
  toggleItem: (id: string) => void;
  isItemActive: (id: string) => boolean;
}

export const accordionKey: InjectionKey<AccordionContext> = Symbol("accordion");
